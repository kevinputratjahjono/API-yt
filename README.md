cd backend
python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn google-auth google-auth-oauthlib google-api-python-client python-multipart

cd frontend
npm init -y
npm install
npx tailwindcss init -p


npm run dev



