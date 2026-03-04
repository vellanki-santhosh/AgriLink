# 🌱 AgriLink - Smart Agricultural Marketplace

An intelligent agricultural marketplace platform connecting farmers with resources they need to thrive. Features include equipment rental, worker hiring, crop calendar management, and **real-time AI-powered soil analysis**.

## 🚀 Features

- **Real-Time Soil Analysis**: ML-powered soil classification using live webcam feed
- **Equipment Rental**: Browse and rent agricultural equipment
- **Worker Management**: Hire agricultural workers efficiently
- **Land Monitoring**: Track and manage your agricultural lands
- **Crop Calendar**: Plan your crop cycle with intelligent suggestions
- **Dashboard**: Comprehensive agricultural insights and analytics
- **Market Messages**: Communicate with other farmers and vendors
- **Transport Services**: Get transportation solutions for your produce

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library
- **React Router** - Navigation

### Backend
- **Flask** - Python web framework
- **TensorFlow/Keras** - ML model for soil analysis
- **OpenCV** - Image processing
- **CORS** - Cross-origin requests

## 📋 Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **Git**
- Modern web browser with camera support

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vellanki-santhosh/AgriLink.git
cd AgriLink
```

### 2. Setup Frontend

```bash
cd "Agri link"
npm install
npm run dev
```

Frontend will run on `http://localhost:5173` (or next available port)

### 3. Setup Backend

```bash
cd Soil-Analysis-main/Application_development
pip install -r requirements.txt
python flask_application.py
```

Backend will run on `http://localhost:5000`

## 📖 Project Structure

```
AgriLink/
├── Agri link/                          # React Frontend
│   ├── src/
│   │   ├── pages/                      # Page components
│   │   │   ├── SoilAnalysis.jsx       # 🌱 Real-time soil analysis
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Lands.jsx
│   │   │   ├── Equipment.jsx
│   │   │   └── ...
│   │   ├── components/                 # Reusable components
│   │   ├── api/                        # API client
│   │   └── Layout.jsx                  # Main layout
│   ├── package.json
│   └── vite.config.js
│
├── Soil-Analysis-main/                 # AI & ML
│   ├── Application_development/        # Flask Backend
│   │   ├── flask_application.py        # Main server
│   │   ├── requirements.txt
│   │   └── start-backend.bat
│   └── ML Integration/                 # ML models
│
├── SOIL_ANALYSIS_QUICK_START.md        # Quick setup guide
└── start-frontend.bat                  # Frontend startup script
```

## 🧪 Real-Time Soil Analysis

The application includes an advanced real-time soil analysis feature powered by machine learning.

### How to Use:

1. Navigate to **Soil Analysis** from the menu
2. Click **"Start Camera"** to activate your webcam
3. Two analysis modes:
   - **Manual**: Click "Analyze" for single predictions
   - **Auto**: Click "⚡ Auto ON" for continuous real-time analysis

### Features:
- 🎥 Live webcam streaming
- 🤖 ML-powered soil classification (Sandy, Clay, Loamy, Silty, Peaty)
- 📊 Confidence scores and RGB analysis
- ⚡ Real-time predictions every 1.5 seconds
- 🎯 Fallback color-based analysis

## 🔧 Configuration

### API Endpoints

**Backend**: `http://localhost:5000`

```
GET /health
  → Check backend status

POST /analyze-frame
  → Real-time frame analysis
  → Request: { image: "base64_encoded_image" }
  → Response: { soil_type, confidence, description, rgb }

POST /analyze
  → File upload analysis
  → Request: FormData with file
  → Response: { soil_type, confidence, description, rgb }
```

### Environment Variables

Create `.env` in `Agri link/` if needed:
```env
VITE_API_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Backend not connecting
- Ensure Flask server is running: `python flask_application.py`
- Check if port 5000 is available
- Verify no firewall blocking localhost:5000

### Camera permission denied
- Grant camera access to your browser
- Check browser privacy settings

### Dependencies installation fails
- Clear npm cache: `npm cache clean --force`
- Clear pip cache: `pip cache purge`
- Reinstall: `npm install && pip install -r requirements.txt`

## 📦 Dependencies

### Frontend
- react
- react-router-dom
- lucide-react
- tailwindcss

### Backend
- flask
- flask-cors
- tensorflow
- pillow
- opencv-python
- numpy

See `requirements.txt` and `package.json` for complete lists.

## 🚀 Deployment

### GitHub Pages (Automatic)

This project is configured for automatic GitHub Pages deployment:

1. **Already Configured**: The `.github/workflows/deploy.yml` workflow is set up
2. **Automatic Deployment**: Pushes to `main` branch auto-deploy to GitHub Pages
3. **Live URL**: https://vellanki-santhosh.github.io/AgriLink/

**To Enable GitHub Pages:**
1. Go to your repository on GitHub
2. Navigate to Settings → Pages
3. Under "Build and deployment", select "GitHub Actions"
4. Push to main branch - deployment happens automatically!

### Frontend (Manual - Vercel, Netlify, etc.)
```bash
cd "Agri link"
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku, Railways, etc.)
1. Set environment variables
2. Install Python dependencies
3. Run Flask app on specified port

**Note**: GitHub Pages serves static files only. For full functionality with backend features (soil analysis), you'll need to deploy the Flask backend separately and update the API_URL in the frontend.

## 📝 Development

### Running in Development Mode
```bash
# Terminal 1 - Frontend
cd "Agri link"
npm run dev

# Terminal 2 - Backend
cd Soil-Analysis-main/Application_development
python flask_application.py
```

### Building for Production
```bash
# Frontend
npm run build

# Backend
- Set `debug=False` in flask_application.py
- Use production WSGI server (Gunicorn)
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Vellanki Santhosh**
- GitHub: [@vellanki-santhosh](https://github.com/vellanki-santhosh)
- Repository: [AgriLink](https://github.com/vellanki-santhosh/AgriLink)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation

---

**Made with ❤️ for Indian Agriculture**
