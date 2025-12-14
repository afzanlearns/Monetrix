# Monetrix – Smart Profit & Loss Analyzer

Monetrix is an AI-powered financial intelligence platform designed to help businesses automate their Profit & Loss (P&L) analysis. By combining traditional financial metrics with advanced AI insights, Monetrix transforms raw data into actionable business intelligence.

![Monetrix Hero](frontend/assets/logo.svg)

## 🚀 Key Features

### 📊 Smart P&L Analysis
- **Automated Calculations**: Instantly computes Gross Profit, Operating Profit, Net Profit, and margins based on user inputs.
- **Real-time Visualization**: Interactive charts (Bar, Doughnut, Line) utilizing Chart.js to visualize revenue streams and expense breakdowns.
- **Historical Comparison**: Compare current performance against previous periods to track growth and trends.

### 🤖 AI-Powered Insights ("Monetrix AI")
- **Intelligent Recommendations**: An integrated chatbot analyzes your financial data to provide tailored advice on cost-cutting and revenue optimization.
- **Context-Aware Interactions**: The AI understands the context of your currently entered data for more accurate responses.

### 🎨 Premium User Experience
- **"Midnight Purple" Theme**: A modern, dark-mode-first aesthetic with glassmorphism effects and smooth transitions.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices with a custom hamburger menu and adaptive layouts.
- **Guest Mode**: Try the platform immediately without signing up, with data persistent only for the session.

### 🔐 Secure Authentication
- **User Accounts**: Sign up and Login functionality with secure password handling.
- **Session Management**: persistent user sessions using JSON Web Tokens (JWT).

## 🛠️ Tech Stack

### Frontend
- **HTML5 & CSS3**: Custom responsive layout using Flexbox and Grid. No external CSS frameworks—pure, optimized vanilla CSS.
- **JavaScript (ES6+)**: Modular vanilla JS for DOM manipulation, API integration, and logic.
- **Chart.js**: For rendering interactive financial charts.

### Backend
- **Node.js**: Runtime environment.
- **Express.js**: Web server framework for handling API routes (`/auth`, `/analysis`).
- **MongoDB & Mongoose**: NoSQL database for storing user profiles and financial history.
- **JWT (JSON Web Tokens)**: For secure, stateless authentication.

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/afzanlearns/Monetrix.git
    cd Monetrix
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the `backend` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4.  **Run the Server**
    ```bash
    npm start
    # Server will run on http://localhost:5000
    ```

5.  **Launch Frontend**
    Open `frontend/index.html` in your browser (or use Live Server in VS Code).

## 📝 Usage

1.  **Landing Page**: Explore features and sign in.
2.  **Analyzer Dashboard**: Enter your Revenue, COGS, and Expenses data.
3.  **View Reports**: Scroll down to see calculated metrics and visual charts.
4.  **Ask AI**: Click the floating bot icon in the bottom-right to ask questions like "How can I improve my Net Margin?".

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
