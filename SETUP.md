# Monetrix Setup Guide

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Environment File
Create a `.env` file in the `backend` folder with the following:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/monetrix

# JWT Secret Key (use a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port (optional, defaults to 5000)
PORT=5000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGO_URI` accordingly.

### 4. Start the Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server should start on `http://localhost:5000`

## Frontend Setup

### 1. Update API Base URL
If your backend is running on a different port or URL, update the `API_BASE` constant in:
- `frontend/landing.js` (line 24)
- `frontend/analyzer.js` (line 11)

### 2. Open the Application
Simply open `frontend/index.html` in your browser, or use a local server:

```bash
# Using Python
cd frontend
python -m http.server 8000

# Using Node.js http-server
npx http-server frontend -p 8000
```

Then open `http://localhost:8000` in your browser.

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is installed and running
- Check that the `MONGO_URI` in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the `PORT` in `.env` to a different port (e.g., 5001)
- Or stop the process using port 5000

### Module Not Found Errors
- Run `npm install` in the backend folder
- Make sure you're using Node.js version 14 or higher

### CORS Errors
- Ensure the backend CORS is configured (already done in server.js)
- Check that the frontend API_BASE URL matches your backend URL

## Testing

1. Start the backend server
2. Open the frontend in a browser
3. Click "Login" and create an account
4. Navigate to the analyzer tool
5. Enter financial data and generate analysis

