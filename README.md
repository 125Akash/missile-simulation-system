# 🚀 Missile Simulation System

An advanced full-stack web application that simulates real-time missile launches between countries using geospatial visualization, animation logic, and intelligent targeting.

---

## 🌍 Live Demo

🔗 https://your-project.vercel.app  

---

## 💻 GitHub Repository

🔗 https://github.com/125Akash/missile-simulation-system  

---

## ⚙ Backend API

🔗 https://missile-simulation-system.onrender.com  

---

## 📌 Project Overview

This project is an interactive missile simulation platform where users can:

- Select a country
- Choose missile systems
- Visualize missile trajectories on a world map
- See radar scanning and impact animations

It combines **frontend visualization + backend computation** to create a realistic simulation experience.

---

# ✨ Features

## 🚀 Missile Simulation
- Real-time missile launch animation
- Smooth curved trajectories
- Multi-target attack simulation

## 🌍 Country & Missile System
- Multiple countries supported
- Each country has its own missile data
- Includes systems like:
  - Agni Series (India)
  - BrahMos
  - DF Series (China)
  - Minuteman (USA)
  - Sarmat (Russia)

## 🧠 Smart Missile Logic
- Automatically selects best missile based on distance
- Manual override option available

## 📡 Radar System
- Rotating radar effect
- Visual detection zone
- Live scanning animation

## 🎯 Target System
- Target cities displayed on map
- Distance-based color coding
- Smart fallback for short-range missiles

## 💥 Impact Visualization
- Explosion marker on impact
- Time-to-target display
- Clean UI time box

## 🎥 Camera Effects
- Auto zoom to impact location
- Sequential tracking for multiple missiles

---

# 🛠 Tech Stack

## 🔹 Frontend
- React.js
- Leaflet.js (Map rendering)
- CSS (Modern UI + animations)

## 🔹 Backend
- FastAPI (Python)
- REST API
- JSON-based data system

## 🔹 Deployment
- Frontend → Vercel
- Backend → Render

---

# 🧩 Project Structure
missile-simulation-system/
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ └── MapView.js
│ │ ├── App.js
│ │ ├── App.css
│ │ └── assets/
│ │ └── rocket.png
│ └── package.json
│
├── backend/
│ ├── main.py
│ ├── requirements.txt
│ └── data/
│ └── countries.json
│
└── README.md


---

# ⚙️ FRONTEND DETAILS

## 📁 Location

## 🔧 Responsibilities
- UI rendering
- Map visualization
- Animation logic
- User interaction

## 🔥 Key File

### `MapView.js`
Handles:
- Missile trajectory animation
- Radar system
- Explosion effect
- Auto zoom

## 🌐 API Integration

Frontend calls backend APIs:

```js
axios.get("https://missile-simulation-system.onrender.com/countries")

📁 Location

Responsibilities
Serve country & missile data
Calculate targets based on range
Provide API endpoints
🔥 Main File
main.py

Key endpoints:

GET /countries
GET /targets/{country}/{missile}
🧠 Backend Logic
1. Load Data

Reads from:

data/countries.json
2. Target Calculation
Computes distance between countries
Filters based on missile range
3. Response

Returns JSON to frontend

📡 API ENDPOINTS
Endpoint	Description
/countries	Get all countries & missiles
/targets/{country}/{missile}	Get reachable targets
🔄 HOW SYSTEM WORKS
Step 1: Select Country

User selects country → missiles loaded

Step 2: Select Missile
AI selects best missile OR user selects manually
Step 3: Fetch Targets

Backend calculates reachable targets

Step 4: Launch Animation
Curved trajectory generated
Missile moves across map
Step 5: Impact
Explosion displayed
Time calculated
🧠 CORE CONCEPTS USED
Geospatial math (lat/lng)
Curve interpolation (Bezier logic)
Real-time animation using React state
API-based architecture
Fallback logic for edge cases
⚠️ CHALLENGES SOLVED
No-target issue for short-range missiles
LatLng undefined errors
Smooth animation without lag
Sync between backend and frontend
Deployment issues (CORS, API linking)
📦 INSTALLATION (LOCAL SETUP)
🔹 Clone Repo
git clone https://github.com/125Akash/missile-simulation-system.git
cd missile-simulation-system
🔹 Backend Setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
🔹 Frontend Setup
cd frontend
npm install
npm start
🌐 DEPLOYMENT
Backend (Render)
Root: backend
Build: pip install -r requirements.txt
Start: uvicorn main:app --host 0.0.0.0 --port 10000
Frontend (Vercel)
Root: frontend
Auto deploy from GitHub
🔮 FUTURE IMPROVEMENTS
Missile defense interception system
AI war strategy simulation
Satellite tracking integration
Real-time global data integration
Advanced analytics dashboard
👨‍💻 AUTHOR

Akash Sabe

GitHub: https://github.com/125Akash
⭐ SUPPORT

If you liked this project:

⭐ Star this repo
📢 Share feedback
🚀 Use it in your portfolio

📜 DISCLAIMER

This project is for educational and simulation purposes only.
No real-world military application is intended.


---

# 🎯 WHAT THIS DOES

This README now:

✔ Clearly explains frontend + backend  
✔ Shows system architecture  
✔ Looks professional to recruiters  
✔ Makes your project “portfolio-level”  

---

# 🚀 FINAL STEP

```bash
git add README.md
git commit -m "added detailed README"
git push
'''backend/
