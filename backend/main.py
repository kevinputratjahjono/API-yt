# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import json
import os
import csv
from io import StringIO
from fastapi.responses import StreamingResponse

SCOPES = ["https://www.googleapis.com/auth/yt-analytics.readonly", "https://www.googleapis.com/auth/youtube.readonly"]
CLIENT_SECRET_FILE = "client_secret.json"
TOKEN_FILE = "token.json"
REDIRECT_URI = "http://localhost:8000/oauth2callback"

app = FastAPI()

# Allow React dev server
origins = [
    "http://localhost:5173",
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Helpers
# -----------------------------
def save_credentials(creds: Credentials):
    with open(TOKEN_FILE, "w") as f:
        f.write(creds.to_json())


def load_credentials():
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as f:
            data = json.load(f)
            return Credentials.from_authorized_user_info(data, SCOPES)
    return None


def ensure_creds():
    creds = load_credentials()
    if not creds:
        raise HTTPException(status_code=401, detail="Not authenticated. Call /auth first.")
    # Refresh if expired
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        save_credentials(creds)
    return creds


# -----------------------------
# OAuth endpoints
# -----------------------------
@app.get("/auth")
def auth():
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRET_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )
    auth_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent"
    )
    return {"auth_url": auth_url}


@app.get("/oauth2callback")
def oauth2callback(code: str, state: str | None = None):
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRET_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )
    flow.fetch_token(code=code)
    creds = flow.credentials
    save_credentials(creds)
    return {"status": "Authenticated. Token saved!", "token_valid": creds.valid}


# -----------------------------
# Test: get channel info
# -----------------------------
@app.get("/me")
def me():
    creds = ensure_creds()
    youtube = build("youtube", "v3", credentials=creds)
    channel = youtube.channels().list(part="snippet,statistics", mine=True).execute()
    return channel


# -----------------------------
# Analytics: countries
# -----------------------------
@app.get("/analytics/countries")
def analytics_countries(start: str = "2024-01-01", end: str = "2024-12-31", max_results: int = 50):
    creds = ensure_creds()
    youtubeAnalytics = build("youtubeAnalytics", "v2", credentials=creds)
    response = youtubeAnalytics.reports().query(
        ids="channel==MINE",
        startDate=start,
        endDate=end,
        metrics="views,estimatedMinutesWatched,averageViewDuration",
        dimensions="country",
        sort="-views",
        maxResults=max_results
    ).execute()
    return response


# -----------------------------
# Analytics: videos (top N by views)
# -----------------------------
@app.get("/analytics/videos")
def analytics_videos(start: str = "2024-01-01", end: str = "2024-12-31", max_results: int = 50):
    creds = ensure_creds()
    youtubeAnalytics = build("youtubeAnalytics", "v2", credentials=creds)
    # Query per-video metrics
    response = youtubeAnalytics.reports().query(
        ids="channel==MINE",
        startDate=start,
        endDate=end,
        metrics="views,estimatedMinutesWatched,averageViewDuration",
        dimensions="video",
        sort="-views",
        maxResults=max_results
    ).execute()
    # maps video ids to rows
    return response


# -----------------------------
# Analytics: time series (daily)
# -----------------------------
@app.get("/analytics/timeseries")
def analytics_timeseries(start: str = "2024-01-01", end: str = "2024-12-31", metrics: str = "views"):
    creds = ensure_creds()
    youtubeAnalytics = build("youtubeAnalytics", "v2", credentials=creds)
    response = youtubeAnalytics.reports().query(
        ids="channel==MINE",
        startDate=start,
        endDate=end,
        metrics=metrics,
        dimensions="day",
        sort="day"
    ).execute()
    return response


# -----------------------------
# Download CSV (countries)
# -----------------------------
@app.get("/download/countries.csv")
def download_countries_csv(start: str = "2024-01-01", end: str = "2024-12-31"):
    resp = analytics_countries(start=start, end=end)
    rows = resp.get("rows", [])
    headers = [h["name"] for h in resp.get("columnHeaders", [])]
    stream = StringIO()
    writer = csv.writer(stream)
    writer.writerow(headers)
    for r in rows:
        writer.writerow(r)
    stream.seek(0)
    return StreamingResponse(stream, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=countries.csv"})
