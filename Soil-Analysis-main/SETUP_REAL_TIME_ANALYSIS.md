# Real-Time Soil Analysis Setup Guide

This guide will help you set up the real-time soil analysis system with your React frontend and Python Flask backend.

## Prerequisites

- Python 3.8+
- Node.js (already set up for your React app)
- TensorFlow/Keras installed

## Backend Setup

### 1. Install Python Dependencies

Navigate to the `Application_development` folder and install required packages:

```bash
cd "Soil-Analysis-main\Application_development"
pip install flask flask-cors tensorflow pillow opencv-python numpy
```

### 2. Prepare Your Model

Place your trained `soil_analysis_model.h5` file in the `Application_development` folder. If you don't have it yet, the backend will use pixel-based analysis as a fallback.

### 3. Start the Backend Server

```bash
python flask_application.py
```

You should see output like:
```
 * Running on http://127.0.0.1:5000
```

**Keep this terminal open while using the application.**

## Frontend Setup

Your React frontend is already configured to connect to the backend on `http://localhost:5000`.

### 1. Install Frontend Dependencies (if not already done)

```bash
cd "Agri link"
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

This will start your React app (typically on `http://localhost:5173` or `http://localhost:5174`).

## Using the Real-Time Soil Analysis

1. Navigate to the **Soil Analysis** page in your application
2. Click **"▶ Start Camera"** to activate your webcam
3. You'll see a connection status indicator - ensure Backend is connected
4. Two analysis modes:
   - **Manual**: Click **"📸 Analyze"** to analyze a single frame
   - **Auto**: Click **"⚡ Auto ON"** to continuously analyze frames every 1.5 seconds

## Features

- **Real-time Webcam Feed**: Direct from your device camera
- **ML-Powered Analysis**: Uses your trained model for soil type prediction
- **Confidence Score**: Shows prediction confidence percentage
- **Color Analysis**: RGB values of the analyzed soil sample
- **Auto-Analysis**: Continuous real-time predictions
- **Fallback Mode**: Pixel-based analysis if model is unavailable

## Troubleshooting

### "Backend not available" error
- Make sure Flask server is running on port 5000
- Check if the Python process is still active in your terminal
- Try restarting the Flask server

### High latency between frames
- This is normal - the model takes time to process images
- Adjust the analysis interval in `SoilAnalysis.jsx` (currently 1.5 seconds)
- Reduce image quality if needed

### Model not found
- The backend includes fallback color-based analysis
- Place your `soil_analysis_model.h5` in the `Application_development` folder to use ML predictions

### Camera permission denied
- Grant camera access to your browser
- Check browser camera permissions in settings

## Running Multiple Instances

If you want to run on different ports:

**Backend** (change port in `flask_application.py`):
```python
app.run(debug=True, port=5001)  # Changed from 5000
```

**Frontend** (update API_URL in `SoilAnalysis.jsx`):
```javascript
const API_URL = 'http://localhost:5001';  // Match your backend port
```

## Next Steps

1. Train and optimize your ML model for better accuracy
2. Add data logging to save analysis results
3. Integrate with your backend database for historical analysis
4. Add export/download functionality for results
