# app.py
from flask import Flask, request, jsonify, send_file
from PIL import Image
import io
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        file = request.files['image']
        sizes = json.loads(request.form['sizes'])
        img = Image.open(io.BytesIO(file.read()))

        resized_images = [img.resize((size['width'], size['height'])) for size in sizes]
        image_urls = []

        for i, resized_image in enumerate(resized_images):
            buffer = io.BytesIO()
            resized_image.save(buffer, format='JPEG')
            buffer.seek(0)
            filename = f'resized_image_{i}.jpg'
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            with open(filepath, 'wb') as f:
                f.write(buffer.getbuffer())
            image_urls.append(request.host_url + 'uploads/' + filename)

        return jsonify({'image_urls': image_urls})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename))

if __name__ == '__main__':
    app.run(debug=True)