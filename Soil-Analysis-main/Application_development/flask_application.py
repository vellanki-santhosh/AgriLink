from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import cv2
import base64
import io
import os

# Load the pre-trained model
try:
    model = load_model("soil_analysis_model.h5")
except:
    print("Warning: soil_analysis_model.h5 not found, using placeholder predictions")
    model = None

soil_classes = ['Sandy', 'Clay', 'Loamy']

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

def preprocess_image(image):
    """Preprocess image for model prediction"""
    image = image.resize((128, 128))
    image_array = np.array(image) / 255.0  # Normalize
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

def analyze_pixel_data(image):
    """Fallback pixel-based analysis when model is not available"""
    img_array = np.array(image)
    avg_color = np.mean(img_array, axis=(0, 1))
    brightness = np.mean(avg_color)
    
    # Determine soil type based on color
    if brightness > 200:
        return 'Sandy', 0.9
    elif img_array[:,:,0].mean() > img_array[:,:,1].mean():  # More red
        return 'Clay', 0.8
    elif img_array[:,:,1].mean() > img_array[:,:,0].mean():  # More green
        return 'Loamy', 0.85
    else:
        return 'Loamy', 0.75

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

@app.route('/analyze', methods=['POST'])
def analyze_soil():
    """File-based soil analysis"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file:
        try:
            image = Image.open(file.stream)
            image_array = preprocess_image(image)
            
            if model:
                prediction = model.predict(image_array, verbose=0)
                soil_type = soil_classes[np.argmax(prediction)]
                confidence = float(np.max(prediction))
            else:
                soil_type, confidence = analyze_pixel_data(image)
            
            return jsonify({
                'soil_type': soil_type,
                'confidence': confidence,
                'description': get_soil_description(soil_type)
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    return jsonify({'error': 'Invalid file format'}), 400

@app.route('/analyze-frame', methods=['POST'])
def analyze_frame():
    """Real-time webcam frame analysis"""
    try:
        data = request.get_json()
        if 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        image_array = preprocess_image(image)
        
        if model:
            prediction = model.predict(image_array, verbose=0)
            soil_type = soil_classes[np.argmax(prediction)]
            confidence = float(np.max(prediction))
        else:
            soil_type, confidence = analyze_pixel_data(image)
        
        return jsonify({
            'soil_type': soil_type,
            'confidence': confidence,
            'description': get_soil_description(soil_type),
            'rgb': get_soil_color(soil_type)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_soil_description(soil_type):
    """Get soil type description"""
    descriptions = {
        'Sandy': 'Light, fast-draining soil',
        'Clay': 'Dense, water-retaining soil',
        'Loamy': 'Balanced, ideal soil',
        'Silty': 'Fine-textured, holding soil',
        'Peaty': 'Organic, nutrient-rich soil'
    }
    return descriptions.get(soil_type, 'Unknown soil type')

def get_soil_color(soil_type):
    """Get soil type color representation"""
    colors = {
        'Sandy': {'r': 196, 'g': 167, 'b': 71},
        'Clay': {'r': 139, 'g': 111, 'b': 71},
        'Loamy': {'r': 122, 'g': 110, 'b': 75},
        'Silty': {'r': 158, 'g': 155, 'b': 126},
        'Peaty': {'r': 74, 'g': 74, 'b': 58}
    }
    return colors.get(soil_type, {'r': 128, 'g': 128, 'b': 128})

if __name__ == "__main__":
    os.makedirs("uploaded_images", exist_ok=True)
    app.run(debug=True, port=5000)
