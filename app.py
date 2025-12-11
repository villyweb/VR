from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
import os
import uuid
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Allowed file extensions for 3D models
ALLOWED_EXTENSIONS = {'glb', 'gltf', 'obj', 'fbx', 'dae', 'stl'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'model' not in request.files:
        return jsonify({'error': 'No file selected'}), 400
    
    file = request.files['model']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Create a unique filename
        unique_id = str(uuid.uuid4())
        filename = secure_filename(file.filename)
        extension = filename.rsplit('.', 1)[1].lower()
        new_filename = f"{unique_id}.{extension}"
        
        # Save the file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
        file.save(filepath)
        
        # Generate the AR view URL
        ar_url = url_for('ar_view', model_id=unique_id, _external=True)
        
        return jsonify({
            'success': True,
            'model_id': unique_id,
            'filename': filename,
            'ar_url': ar_url
        })
    
    return jsonify({'error': 'Invalid file type. Please upload a 3D model file.'}), 400

@app.route('/ar/<model_id>')
def ar_view(model_id):
    # Check if the model file exists
    for ext in ALLOWED_EXTENSIONS:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"{model_id}.{ext}")
        if os.path.exists(filepath):
            return render_template('ar_viewer.html', model_id=model_id, file_ext=ext)
    
    return "Model not found", 404

@app.route('/api/model_info/<model_id>')
def model_info(model_id):
    for ext in ALLOWED_EXTENSIONS:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"{model_id}.{ext}")
        if os.path.exists(filepath):
            return jsonify({
                'model_id': model_id,
                'file_size': os.path.getsize(filepath),
                'file_type': ext,
                'download_url': url_for('download_model', model_id=model_id)
            })
    
    return jsonify({'error': 'Model not found'}), 404

@app.route('/download/<model_id>')
def download_model(model_id):
    for ext in ALLOWED_EXTENSIONS:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"{model_id}.{ext}")
        if os.path.exists(filepath):
            return send_from_directory(
                app.config['UPLOAD_FOLDER'], 
                f"{model_id}.{ext}", 
                as_attachment=True
            )
    
    return "Model not found", 404

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)