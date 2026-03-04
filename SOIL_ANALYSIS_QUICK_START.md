# 🌱 Real-Time Soil Analysis - Quick Start

## What Changed?

Your Soil Analysis page now has:
✅ **Real-time webcam feed** - Live video streaming  
✅ **ML Model Integration** - Uses your trained soil classification model  
✅ **Auto-Analysis Mode** - Continuous predictions as you move the camera  
✅ **Confidence Scores** - Shows prediction accuracy percentage  
✅ **Color Analysis** - RGB breakdown of soil samples  
✅ **Live Status Indicator** - Visual feedback when streaming  

## 🚀 Getting Started (3 Steps)

### Step 1: Start the Backend (Terminal 1)

Windows:
```bash
cd "Soil-Analysis-main\Application_development"
start-backend.bat
```

Or manually:
```bash
cd "Soil-Analysis-main\Application_development"
pip install -r requirements.txt
python flask_application.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

### Step 2: Start the Frontend (Terminal 2)

Windows:
```bash
start-frontend.bat
```

Or manually:
```bash
cd "Agri link"
npm install
npm run dev
```

### Step 3: Open Your App

Click on the **Soil Analysis** page and you'll see:
- ✅ "Backend connected" (green status)
- Live camera controls
- Start Camera button

## 📸 How to Use

### Manual Analysis
1. Click **"▶ Start Camera"** 
2. Point at soil sample
3. Click **"📸 Analyze"** to get a prediction
4. View results: soil type, confidence score, RGB values

### Auto Real-Time Analysis (Recommended)
1. Click **"▶ Start Camera"**
2. Click **"⚡ Auto ON"** 
3. The system analyzes continuously every 1.5 seconds
4. Move camera around to see different predictions
5. Click **"⚡ Auto ON"** again to stop

## 🎯 Tips for Best Results

- **Lighting**: Use good natural lighting on the soil sample
- **Distance**: Keep camera 10-15 cm from the soil
- **Stability**: Keep the camera steady for consistent results
- **Clean Surface**: Analyze clean soil samples for accuracy

## 📁 Project Structure

```
Agri link/
  src/pages/
    SoilAnalysis.jsx ← Updated with real-time features

Soil-Analysis-main/
  Application_development/
    flask_application.py ← Updated backend with /analyze-frame endpoint
    requirements.txt ← New: dependencies for backend
    start-backend.bat ← New: Easy startup script
    soil_analysis_model.h5 ← (Place your trained model here)
```

## 🔧 Features Explained

| Feature | What It Does |
|---------|-------------|
| **Start/Stop Camera** | Activates/deactivates your device camera |
| **Analyze** | Takes one frame and sends to backend for ML prediction |
| **Auto Mode** | Continuously analyzes frames every 1.5 seconds |
| **Connection Status** | Shows if backend is running and accessible |
| **Confidence %** | How confident the model is (0-100%) |
| **Color Display** | Visual representation of average soil color |

## 🐛 Common Issues & Fixes

### "Backend not available"
→ Make sure Flask is running in Terminal 1

### Camera shows "Access Denied"
→ Grant camera permission to your browser

### Model not found (but analysis still works)
→ Your ML model isn't detected, using fallback color analysis  
→ Place `soil_analysis_model.h5` in `Soil-Analysis-main/Application_development/`

### Auto-analysis is slow
→ This is normal - ML prediction takes time  
→ Increase interval from 1.5s to 2-3s if needed (edit SoilAnalysis.jsx line 74)

## 📊 API Endpoints

Your backend now has these endpoints:

```
GET /health
  → Check if backend is running

POST /analyze-frame
  → Real-time frame analysis
  → Body: { image: "base64_encoded_image" }
  → Response: { soil_type, confidence, description, rgb }

POST /analyze
  → File upload analysis
  → Body: FormData with file
  → Response: { soil_type, confidence, description, rgb }
```

## 🔐 Important Notes

- Backend runs on `http://localhost:5000` by default
- Frontend connects at `http://localhost:5173` or next available port
- Both must be running for real-time analysis to work
- Camera requires HTTPS in production (use HTTP for localhost development)

## 🎉 Next Steps

1. **Train Your Model**: Create a better ML model with more training data
2. **Save Results**: Add database integration to store predictions
3. **Export Data**: Add result download/export functionality
4. **Mobile**: Test on mobile devices with rear-facing cameras
5. **Performance**: Optimize model for faster predictions

---

Need help? Check the detailed setup guide: [SETUP_REAL_TIME_ANALYSIS.md](SETUP_REAL_TIME_ANALYSIS.md)
