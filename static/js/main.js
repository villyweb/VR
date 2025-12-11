document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const modelInput = document.getElementById('modelInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const loading = document.getElementById('loading');
    const resultSection = document.getElementById('resultSection');
    const arLink = document.getElementById('arLink');
    const copyBtn = document.getElementById('copyBtn');

    // Handle click on upload area to trigger file selection
    uploadArea.addEventListener('click', () => {
        modelInput.click();
    });

    // Handle drag and drop events
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            modelInput.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });

    // Handle file selection
    modelInput.addEventListener('change', handleFileSelect);

    function handleFileSelect() {
        if (modelInput.files.length > 0) {
            const file = modelInput.files[0];
            const validExtensions = ['.glb', '.gltf', '.obj', '.fbx', '.dae', '.stl'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (validExtensions.includes(fileExtension)) {
                uploadBtn.disabled = false;
                uploadArea.innerHTML = `
                    <div class="upload-icon">✓</div>
                    <p>Selected: ${file.name}</p>
                    <p class="file-types">Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                `;
            } else {
                alert('Please select a valid 3D model file (GLB, GLTF, OBJ, FBX, DAE, STL)');
                uploadBtn.disabled = true;
            }
        }
    }

    // Handle upload button click
    uploadBtn.addEventListener('click', async () => {
        if (!modelInput.files.length) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('model', modelInput.files[0]);

        try {
            // Show loading indicator
            loading.style.display = 'block';
            uploadBtn.disabled = true;

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Hide loading and show result
                loading.style.display = 'none';
                resultSection.style.display = 'block';
                
                // Set the AR link
                arLink.textContent = data.ar_url;
                
                // Scroll to results
                resultSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            loading.style.display = 'none';
            uploadBtn.disabled = false;
            alert('Upload failed: ' + error.message);
        }
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(arLink.textContent);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    });
});