import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle } from 'lucide-react';

export default function SoilAnalysis() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [activeTab, setActiveTab] = useState('camera');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageInputRef = useRef(null);
  const streamRef = useRef(null);

  const soilTypes = {
    Sandy: { color: '#c4a747', description: 'Light, fast-draining soil' },
    Clay: { color: '#8b6f47', description: 'Dense, water-retaining soil' },
    Loamy: { color: '#7a6e4b', description: 'Balanced, ideal soil' },
    Silty: { color: '#9e9b7e', description: 'Fine-textured, holding soil' },
    Peaty: { color: '#4a4a3a', description: 'Organic, nutrient-rich soil' }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setIsStreaming(true);
    } catch (error) {
      setCameraError('Camera error: ' + error.message);
    }
  };

  useEffect(() => {
    if (isStreaming && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [isStreaming]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setIsStreaming(false);
  };

  const analyzeImageData = (imageData) => {
    const data = imageData.data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 16) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    const avgR = r / count, avgG = g / count, avgB = b / count;
    const brightness = (avgR + avgG + avgB) / 3;
    let type = 'Loamy';
    if (brightness > 200) type = 'Sandy';
    else if (avgR > avgG && avgR > avgB && avgR > 120) type = 'Clay';
    else if (avgG > avgR && avgG > avgB && avgG > 100) type = 'Peaty';
    else if (brightness < 80) type = 'Silty';
    return { type, color: soilTypes[type].color, description: soilTypes[type].description, rgb: { r: Math.round(avgR), g: Math.round(avgG), b: Math.round(avgB) } };
  };

  const handleAnalyze = () => {
    if (!isStreaming || !videoRef.current) return;
    setAnalyzing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setTimeout(() => {
      setResult(analyzeImageData(imageData));
      setAnalyzing(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', marginBottom: '1rem' }}>Soil Analysis</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={!isStreaming ? startCamera : stopCamera} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold' }}>
          {isStreaming ? 'Stop' : 'Start'} Camera
        </button>
        <button onClick={handleAnalyze} disabled={!isStreaming || analyzing} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: isStreaming && !analyzing ? '#3b82f6' : '#9ca3af', color: 'white', fontWeight: 'bold', cursor: isStreaming && !analyzing ? 'pointer' : 'not-allowed' }}>
          {analyzing ? 'Analyzing' : 'Analyze'}
        </button>
      </div>
      <div style={{ position: 'relative', aspectRatio: '16/9', backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', marginBottom: '2rem' }}>
        {isStreaming ? (
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Camera preview
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      {result && (
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px', color: 'white' }}>
          <h2>Result: {result.type}</h2>
          <p>{result.description}</p>
        </div>
      )}
    </div>
  );
}
