document.addEventListener('DOMContentLoaded', function() {
    const scene = document.querySelector('a-scene');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const enterArBtn = document.getElementById('enterArBtn');
    
    // Hide loading indicator when scene is loaded
    scene.addEventListener('loaded', function() {
        // Small delay to ensure everything is ready
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, 2000);
    });
    
    // Handle AR session start
    enterArBtn.addEventListener('click', function() {
        // Request presentation to enter AR mode
        if (scene && scene.enterVR) {
            scene.enterVR();
        }
    });
    
    // Also try to enter AR automatically on mobile devices
    if (isMobileDevice()) {
        // Attempt to enter AR mode automatically after a short delay
        setTimeout(() => {
            if (scene && scene.enterVR) {
                // Only enter VR if user has interacted with the page
                // This is due to browser policies requiring user interaction
            }
        }, 3000);
    }
    
    // Helper function to detect mobile devices
    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || 
               (navigator.userAgent.indexOf("IEMobile") !== -1);
    }
    
    // Handle AR.js specific events
    if (window.ARjs) {
        // Configure AR.js for better performance
        const arSystem = new ARjs.System();
        arSystem.init();
    }
    
    // Adjust model scale based on device capabilities
    function adjustModelScale() {
        const modelEntity = document.getElementById('modelEntity');
        if (modelEntity) {
            // On mobile devices, we might want to adjust the scale
            if (isMobileDevice()) {
                modelEntity.setAttribute('scale', '0.2 0.2 0.2');
            } else {
                modelEntity.setAttribute('scale', '0.1 0.1 0.1');
            }
        }
    }
    
    adjustModelScale();
});

// Add error handling for the 3D model
window.addEventListener('load', function() {
    // Monitor for model loading errors
    const assetItem = document.getElementById('modelAsset');
    
    if (assetItem) {
        assetItem.addEventListener('model-error', function() {
            console.error('Error loading 3D model');
            // Show user-friendly error message
            const errorMsg = document.createElement('div');
            errorMsg.innerHTML = '<p style="color:red; text-align:center;">Error loading 3D model. Please try another file.</p>';
            document.body.appendChild(errorMsg);
        });
    }
});