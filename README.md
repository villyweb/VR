# VR Model to AR Viewer

This web application allows users to upload 3D models (VR models) and generate links to view them in Augmented Reality (AR) on mobile devices.

## Features

- Upload 3D models in various formats (GLB, GLTF, OBJ, FBX, DAE, STL)
- Generate shareable AR links
- QR code generation for easy mobile access
- Responsive design for all devices
- AR viewing using WebAR technologies

## Supported File Formats

- GLB (GL Transmission Format Binary)
- GLTF (GL Transmission Format)
- OBJ (Wavefront Object)
- FBX (Filmbox)
- DAE (Digital Asset Exchange)
- STL (Stereolithography)

## How to Use

1. Start the application: `python app.py`
2. Open your browser and go to `http://localhost:5000`
3. Upload a 3D model file using the upload area
4. Copy the generated AR link or scan the QR code
5. Open the link on your mobile device to view the model in AR

## Technologies Used

- Flask (Python web framework)
- A-Frame (WebXR framework)
- AR.js (Augmented Reality library)
- Three.js (3D library)
- HTML5, CSS3, JavaScript (Frontend)

## Requirements

- Python 3.7+
- Flask
- Web browser with WebGL support

## Mobile AR Experience

The AR experience works best on mobile devices with:

- Modern browsers (Chrome, Firefox, Safari)
- Camera access
- WebGL support
- ARCore (Android) or ARKit (iOS) compatible device

For marker-based AR, print out a Hiro pattern and point your camera at it while viewing the model.