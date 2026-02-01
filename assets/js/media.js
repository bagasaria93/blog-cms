let filteredMedia = [];
let deleteMediaId = null;

function loadMedia() {
    const media = getAllMedia();
    filteredMedia = media;
    renderMedia();
}

function filterMedia() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const media = getAllMedia();
    
    filteredMedia = media.filter(item => 
        item.filename.toLowerCase().includes(search)
    );
    
    renderMedia();
}

function renderMedia() {
    const grid = document.getElementById('mediaGrid');
    document.getElementById('totalImages').textContent = filteredMedia.length;
    
    grid.innerHTML = filteredMedia.map(item => `
        <div class="bg-white rounded-lg shadow-sm overflow-hidden group">
            <div class="relative">
                <img src="${item.url}" alt="${item.filename}" class="w-full h-48 object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button onclick="copyToClipboard('${item.url}')" class="p-2 bg-white rounded-full hover:bg-gray-100">
                        <i data-lucide="copy" class="w-5 h-5 text-gray-700"></i>
                    </button>
                    <button onclick="openDeleteModal('${item.id}')" class="p-2 bg-white rounded-full hover:bg-gray-100">
                        <i data-lucide="trash-2" class="w-5 h-5 text-red-600"></i>
                    </button>
                </div>
            </div>
            <div class="p-3">
                <p class="text-sm font-medium text-gray-900 truncate">${item.filename}</p>
                <p class="text-xs text-gray-500">${new Date(item.uploadedAt).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function openUploadModal() {
    document.getElementById('uploadModal').classList.add('active');
    document.getElementById('imageUrl').value = '';
    document.getElementById('imageName').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
    lucide.createIcons();
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('active');
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const randomId = Math.floor(Math.random() * 1000000);
            const unsplashUrl = `https://images.unsplash.com/photo-${randomId}?w=800`;
            
            document.getElementById('imageUrl').value = unsplashUrl;
            document.getElementById('imageName').value = file.name;
            document.getElementById('previewImg').src = unsplashUrl;
            document.getElementById('imagePreview').classList.remove('hidden');
            lucide.createIcons();
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById('imageUrl').addEventListener('input', function() {
    const url = this.value;
    if (url) {
        document.getElementById('previewImg').src = url;
        document.getElementById('imagePreview').classList.remove('hidden');
        
        if (!document.getElementById('imageName').value) {
            const filename = url.split('/').pop().split('?')[0] || 'image.jpg';
            document.getElementById('imageName').value = filename;
        }
    }
});

function uploadImage() {
    const url = document.getElementById('imageUrl').value;
    const filename = document.getElementById('imageName').value;
    
    if (!url || !filename) {
        showToast('Please provide both URL and filename', 'error');
        return;
    }
    
    const media = getAllMedia();
    const newImage = {
        id: generateId(),
        url: url,
        filename: filename,
        uploadedAt: new Date().toISOString()
    };
    
    media.unshift(newImage);
    saveAllMedia(media);
    
    closeUploadModal();
    loadMedia();
    showToast('Image uploaded successfully!');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('URL copied to clipboard!');
    });
}

function openDeleteModal(id) {
    deleteMediaId = id;
    document.getElementById('deleteModal').classList.add('active');
    lucide.createIcons();
}

function closeDeleteModal() {
    deleteMediaId = null;
    document.getElementById('deleteModal').classList.remove('active');
}

function confirmDelete() {
    if (!deleteMediaId) return;
    
    const media = getAllMedia();
    const filteredMedia = media.filter(m => m.id !== deleteMediaId);
    saveAllMedia(filteredMedia);
    
    closeDeleteModal();
    loadMedia();
    showToast('Image deleted successfully!');
}