// Global variables
let photos = [];
let currentFilter = 'kegiatan'; // Default ke kegiatan instead of 'all'

// DOM elements
const photoGrid = document.getElementById('photoGrid');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const modal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalCategory = document.getElementById('modalCategory');
const totalPhotosElement = document.getElementById('totalPhotos');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSamplePhotos();
});

function initializeApp() {
    // Mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            filterPhotos();
        });
    });

    // File upload handling
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Drag and drop
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
    }

    // Modal handling
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Bulk upload checkbox handling
    const bulkUploadCheckbox = document.getElementById('bulkUpload');
    const bulkSettings = document.getElementById('bulkSettings');
    const uploadBtnText = document.getElementById('uploadBtnText');
    
    if (bulkUploadCheckbox) {
        bulkUploadCheckbox.addEventListener('change', function() {
            if (this.checked) {
                bulkSettings.style.display = 'block';
                uploadBtnText.textContent = 'Upload Semua Foto';
                document.getElementById('photoTitle').placeholder = 'Tidak digunakan untuk bulk upload';
                document.getElementById('photoTitle').disabled = true;
            } else {
                bulkSettings.style.display = 'none';
                uploadBtnText.textContent = 'Upload';
                document.getElementById('photoTitle').placeholder = 'Judul foto';
                document.getElementById('photoTitle').disabled = false;
            }
        });
    }

    // Load photos from localStorage
    loadPhotosFromStorage();
}

function loadSamplePhotos() {
    // Sample photos untuk demo
    const samplePhotos = [
        {
            id: 1,
            title: 'Sholat Berjamaah',
            description: 'Kegiatan sholat berjamaah santri di masjid pesantren',
            category: 'kegiatan',
            src: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&h=300&fit=crop',
            date: new Date().toISOString()
        },
        {
            id: 2,
            title: 'Hafalan Al-Quran',
            description: 'Kegiatan tahfidz Al-Quran santri di halaman pesantren',
            category: 'tahfidz',
            src: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=300&fit=crop',
            date: new Date().toISOString()
        },
        {
            id: 3,
            title: 'Peringatan Maulid Nabi',
            description: 'Acara peringatan Maulid Nabi Muhammad SAW',
            category: 'acara',
            src: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=300&fit=crop',
            date: new Date().toISOString()
        },
        {
            id: 4,
            title: 'Wisuda Santri',
            description: 'Acara wisuda dan khataman santri Al-Kahfi',
            category: 'acara',
            src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
            date: new Date().toISOString()
        }
    ];

    // Study Tour M Beach Photos
    const studyTourPhotos = [
        'IMG_9808 (1).JPG', 'IMG_9809 (1).JPG', 'IMG_9810 (1).JPG', 'IMG_9811 (1).JPG', 'IMG_9812 (1).JPG',
        'IMG_9813 (1).JPG', 'IMG_9814 (1).JPG', 'IMG_9815 (1).JPG', 'IMG_9816 (1).JPG', 'IMG_9817 (1).JPG',
        'IMG_9818 (1).JPG', 'IMG_9819 (1).JPG', 'IMG_9820 (1).JPG', 'IMG_9821 (1).JPG', 'IMG_9822 (1).JPG',
        'IMG_9827 (1).JPG', 'IMG_9828 (1).JPG', 'IMG_9829 (1).JPG', 'IMG_9830 (1).JPG', 'IMG_9831 (1).JPG',
        'IMG_9832 (1).JPG', 'IMG_9833 (1).JPG', 'IMG_9834 (1).JPG', 'IMG_9835 (1).JPG', 'IMG_9836 (1).JPG',
        'IMG_9837 (1).JPG', 'IMG_9838 (1).JPG', 'IMG_9839 (1).JPG', 'IMG_9840 (1).JPG', 'IMG_9841 (1).JPG',
        'IMG_9842 (1).JPG', 'IMG_9843 (1).JPG', 'IMG_9844 (1).JPG', 'IMG_9845 (1).JPG', 'IMG_9846 (1).JPG',
        'IMG_9847 (1).JPG', 'IMG_9848 (1).JPG', 'IMG_9849 (1).JPG', 'IMG_9850 (1).JPG', 'IMG_9851 (1).JPG',
        'IMG_9852 (1).JPG', 'IMG_9853 (1).JPG', 'IMG_9854 (1).JPG'
    ];

    // M Beach Random Photos
    const mBeachRandomPhotos = [
        'IMG_0003.JPG', 'IMG_0005.JPG', 'IMG_0006.JPG', 'IMG_0007.JPG', 'IMG_0009.JPG', 'IMG_0010.JPG',
        'IMG_0011.JPG', 'IMG_0014.JPG', 'IMG_0015.JPG', 'IMG_0016.JPG', 'IMG_0017.JPG', 'IMG_0018.JPG',
        'IMG_0019.JPG', 'IMG_0020.JPG', 'IMG_0021.JPG', 'IMG_0022.JPG', 'IMG_0023.JPG', 'IMG_0024.JPG',
        'IMG_0025.JPG', 'IMG_0030.JPG', 'IMG_0031.JPG', 'IMG_0032.JPG', 'IMG_0032(1).JPG', 'IMG_0034.JPG',
        'IMG_0034(1).JPG', 'IMG_0036.JPG', 'IMG_0036(1).JPG', 'IMG_0037.JPG', 'IMG_0038.JPG', 'IMG_0039.JPG',
        'IMG_0040.JPG', 'IMG_0041.JPG', 'IMG_0042.JPG', 'IMG_0043.JPG', 'IMG_0044.JPG', 'IMG_0045.JPG',
        'IMG_0046.JPG', 'IMG_0047.JPG', 'IMG_0048.JPG', 'IMG_0050.JPG', 'IMG_0051.JPG', 'IMG_0052.JPG',
        'IMG_0053.JPG', 'IMG_0054.JPG', 'IMG_0055.JPG', 'IMG_0056.JPG', 'IMG_0057.JPG', 'IMG_0058.JPG',
        'IMG_0059.JPG', 'IMG_0060.JPG', 'IMG_0061.JPG', 'IMG_0062.JPG', 'IMG_0063.JPG', 'IMG_0064.JPG',
        'IMG_0071.JPG', 'IMG_0072.JPG', 'IMG_0073.JPG', 'IMG_0074.JPG', 'IMG_0075.JPG', 'IMG_0076.JPG',
        'IMG_0088.JPG', 'IMG_0092.JPG', 'IMG_0093.JPG', 'IMG_0094.JPG', 'IMG_0095.JPG', 'IMG_0101.JPG',
        'IMG_0102.JPG', 'IMG_0103.JPG', 'IMG_0104.JPG', 'IMG_0105.JPG', 'IMG_0106.JPG', 'IMG_0107.JPG',
        'IMG_0108.JPG', 'IMG_0109.JPG', 'IMG_0110.JPG', 'IMG_0111.JPG', 'IMG_0112.JPG', 'IMG_9776.JPG',
        'IMG_9777.JPG', 'IMG_9778.JPG', 'IMG_9779.JPG', 'IMG_9783.JPG', 'IMG_9788.JPG', 'IMG_9789.JPG',
        'IMG_9790.JPG', 'IMG_9791.JPG', 'IMG_9792 (1).JPG', 'IMG_9793.JPG', 'IMG_9796.JPG', 'IMG_9798.JPG',
        'IMG_9801.JPG', 'IMG_9802.JPG', 'IMG_9803.JPG', 'IMG_9804.JPG', 'IMG_9806.JPG', 'IMG_9807 (1).JPG',
        'IMG_9823 (1).JPG', 'IMG_9824 (1).JPG', 'IMG_9855 (1).JPG', 'IMG_9861.JPG', 'IMG_9864.JPG',
        'IMG_9872 (1).JPG', 'IMG_9873 (1).JPG', 'IMG_9874 (1).JPG', 'IMG_9928 (1).JPG', 'IMG_9929 (1).JPG',
        'IMG_9930 (1).JPG', 'IMG_9931 (1).JPG', 'IMG_9932 (1).JPG', 'IMG_9932 (1)(1).JPG', 'IMG_9938 (1).JPG',
        'IMG_9939 (1).JPG', 'IMG_9940 (1).JPG', 'IMG_9941 (1).JPG', 'IMG_9942 (1).JPG', 'IMG_9943 (1).JPG',
        'IMG_9944 (1).JPG', 'IMG_9945 (1).JPG', 'IMG_9946 (1).JPG', 'IMG_9947 (1).JPG', 'IMG_9948 (1).JPG',
        'IMG_9949 (1).JPG', 'IMG_9951 (1).JPG', 'IMG_9952 (1).JPG', 'IMG_9953 (1).JPG', 'IMG_9954 (1).JPG',
        'IMG_9955 (1).JPG', 'IMG_9956 (1).JPG', 'IMG_9957 (1).JPG', 'IMG_9958 (1).JPG', 'IMG_9960 (1).JPG',
        'IMG_9961 (1).JPG', 'IMG_9962 (1).JPG', 'IMG_9963 (1).JPG', 'IMG_9964 (1).JPG', 'IMG_9965 (1).JPG',
        'IMG_9966 (1).JPG', 'IMG_9967 (1).JPG', 'IMG_9968 (1).JPG', 'IMG_9969 (1).JPG', 'IMG_9970.JPG',
        'IMG_9971.JPG', 'IMG_9972.JPG', 'IMG_9973.JPG', 'IMG_9974.JPG', 'IMG_9979.JPG', 'IMG_9980.JPG',
        'IMG_9981.JPG', 'IMG_9982.JPG', 'IMG_9989.JPG', 'IMG_9990.JPG', 'IMG_9991.JPG', 'IMG_9992.JPG',
        'IMG_9993.JPG', 'IMG_9994.JPG', 'IMG_9995.JPG', 'IMG_9996.JPG', 'IMG_9997.JPG', 'IMG_9998.JPG', 'IMG_9999.JPG'
    ];

    let currentId = 7;
    
    // Add Study Tour photos
    studyTourPhotos.forEach((filename, index) => {
        samplePhotos.push({
            id: currentId++,
            title: `Study Tour M Beach - Foto ${index + 1}`,
            description: `Kegiatan study tour santri Al-Kahfi di M Beach`,
            category: 'studytour',
            src: `./formal/${filename}`,
            date: new Date().toISOString()
        });
    });

    // Add M Beach Random photos
    mBeachRandomPhotos.forEach((filename, index) => {
        samplePhotos.push({
            id: currentId++,
            title: `M Beach Random - Foto ${index + 1}`,
            description: `Momen random santri di M Beach`,
            category: 'mbeachrandom',
            src: `./m beach random/${filename}`,
            date: new Date().toISOString()
        });
    });

    // Hanya load sample photos jika belum ada photos di storage
    if (photos.length === 0) {
        photos = samplePhotos;
        savePhotosToStorage();
        renderPhotos();
        updatePhotoCount();
    }
}

function renderPhotos() {
    if (!photoGrid) return;
    
    const filteredPhotos = photos.filter(photo => photo.category === currentFilter);
    
    photoGrid.innerHTML = '';
    
    filteredPhotos.forEach(photo => {
        const photoElement = createPhotoElement(photo);
        photoGrid.appendChild(photoElement);
    });
    
    // Add animation
    setTimeout(() => {
        document.querySelectorAll('.photo-item').forEach((item, index) => {
            item.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
        });
    }, 100);
}

function createPhotoElement(photo) {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'photo-item';
    photoDiv.setAttribute('data-category', photo.category);
    
    photoDiv.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}" loading="lazy">
        <div class="photo-overlay">
            <h3>${photo.title}</h3>
            <p>${photo.description}</p>
            <span class="category-tag">${getCategoryName(photo.category)}</span>
        </div>
    `;
    
    photoDiv.addEventListener('click', () => openModal(photo));
    
    return photoDiv;
}

function getCategoryName(category) {
    const categoryNames = {
        'kegiatan': 'Kegiatan',
        'tahfidz': 'Tahfidz',
        'acara': 'Acara',
        'studytour': 'Study Tour M Beach',
        'mbeachrandom': 'M Beach Random',
        'reorganisasipeter': 'Reorganisasi Peter'
    };
    return categoryNames[category] || category;
}

function filterPhotos() {
    renderPhotos();
}

function openModal(photo) {
    if (!modal) return;
    
    modalImage.src = photo.src;
    modalImage.alt = photo.title;
    modalTitle.textContent = photo.title;
    modalDescription.textContent = photo.description;
    modalCategory.textContent = getCategoryName(photo.category);
    modalCategory.className = `category-tag category-${photo.category}`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// File upload functions
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
        processFiles(imageFiles);
    } else {
        alert('Harap pilih file gambar yang valid!');
    }
}

function processFiles(files) {
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Preview the image (you can add preview functionality here)
                console.log('File loaded:', file.name);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Show success message
    showNotification('File berhasil dipilih! Silakan isi informasi foto dan klik Upload.');
}

function uploadPhoto() {
    const category = document.getElementById('photoCategory').value;
    const description = document.getElementById('photoDescription').value.trim();
    const fileInput = document.getElementById('fileInput');
    const isBulkUpload = document.getElementById('bulkUpload').checked;
    
    if (!fileInput.files.length) {
        alert('Harap pilih file foto!');
        return;
    }
    
    if (isBulkUpload) {
        // Bulk upload
        const bulkPrefix = document.getElementById('bulkPrefix').value.trim() || 'Foto';
        const files = Array.from(fileInput.files);
        
        if (files.length === 0) {
            alert('Harap pilih foto untuk bulk upload!');
            return;
        }
        
        let uploadedCount = 0;
        const totalFiles = files.length;
        
        showNotification(`Memulai upload ${totalFiles} foto...`);
        
        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const newPhoto = {
                        id: Date.now() + index,
                        title: `${bulkPrefix} - Foto ${index + 1}`,
                        description: description || `${bulkPrefix} foto ke-${index + 1}`,
                        category: category,
                        src: e.target.result,
                        date: new Date().toISOString()
                    };
                    
                    photos.unshift(newPhoto);
                    uploadedCount++;
                    
                    // Update progress
                    if (uploadedCount === totalFiles) {
                        savePhotosToStorage();
                        renderPhotos();
                        updatePhotoCount();
                        
                        // Clear form
                        document.getElementById('bulkPrefix').value = '';
                        document.getElementById('photoDescription').value = '';
                        fileInput.value = '';
                        document.getElementById('bulkUpload').checked = false;
                        document.getElementById('bulkSettings').style.display = 'none';
                        document.getElementById('uploadBtnText').textContent = 'Upload';
                        document.getElementById('photoTitle').disabled = false;
                        document.getElementById('photoTitle').placeholder = 'Judul foto';
                        
                        showNotification(`Berhasil upload ${totalFiles} foto!`);
                        
                        setTimeout(() => {
                            document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
                        }, 1000);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
        
    } else {
        // Single upload
        const title = document.getElementById('photoTitle').value.trim();
        
        if (!title) {
            alert('Harap masukkan judul foto!');
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const newPhoto = {
                id: Date.now(),
                title: title,
                description: description || 'Tidak ada deskripsi',
                category: category,
                src: e.target.result,
                date: new Date().toISOString()
            };
            
            photos.unshift(newPhoto);
            savePhotosToStorage();
            renderPhotos();
            updatePhotoCount();
            
            // Clear form
            document.getElementById('photoTitle').value = '';
            document.getElementById('photoDescription').value = '';
            fileInput.value = '';
            
            showNotification('Foto berhasil diupload!');
            
            setTimeout(() => {
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        };
        
        reader.readAsDataURL(file);
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Storage functions
function savePhotosToStorage() {
    try {
        localStorage.setItem('schoolAlbumPhotos', JSON.stringify(photos));
    } catch (e) {
        console.error('Error saving photos to storage:', e);
    }
}

function loadPhotosFromStorage() {
    try {
        const savedPhotos = localStorage.getItem('schoolAlbumPhotos');
        if (savedPhotos) {
            const parsedPhotos = JSON.parse(savedPhotos);
            // Filter out pembelajaran category and check if we have M Beach Random photos
            const filteredPhotos = parsedPhotos.filter(photo => photo.category !== 'pembelajaran');
            const hasMBeachRandom = filteredPhotos.some(photo => photo.category === 'mbeachrandom');
            if (!hasMBeachRandom || parsedPhotos.some(photo => photo.category === 'pembelajaran')) {
                // Clear old data and reload with new sample photos without pembelajaran
                localStorage.removeItem('schoolAlbumPhotos');
                loadSamplePhotos();
                return;
            }
            photos = filteredPhotos;
            renderPhotos();
            updatePhotoCount();
        }
    } catch (e) {
        console.error('Error loading photos from storage:', e);
        // If error, reload sample photos
        loadSamplePhotos();
    }
}

function updatePhotoCount() {
    if (totalPhotosElement) {
        totalPhotosElement.textContent = photos.length;
    }
}

// Utility functions
function scrollToGallery() {
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
}

// Function to clear localStorage and reload (for development)
function clearStorageAndReload() {
    localStorage.removeItem('schoolAlbumPhotos');
    location.reload();
}

// Function to force reload sample photos
function forceReloadSamplePhotos() {
    localStorage.removeItem('schoolAlbumPhotos');
    photos = [];
    loadSamplePhotos();
    console.log('Sample photos reloaded with M Beach Random!');
}

// Function to force reload M Beach Random photos specifically
function forceLoadMBeachRandom() {
    localStorage.removeItem('schoolAlbumPhotos');
    photos = [];
    loadSamplePhotos();
    renderPhotos();
    updatePhotoCount();
    console.log('M Beach Random photos loaded without pembelajaran category!');
    showNotification('Kategori pembelajaran dihapus, foto dimuat ulang!');
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Lazy loading for images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search functionality (bonus feature)
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Cari foto...';
    searchInput.style.cssText = `
        padding: 10px 15px;
        border: 2px solid #e9ecef;
        border-radius: 25px;
        font-size: 1rem;
        width: 300px;
        margin: 0 20px;
    `;
    
    const debouncedSearch = debounce((query) => {
        searchPhotos(query);
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
    
    // Add search input to filter buttons container
    const filterContainer = document.querySelector('.filter-buttons');
    if (filterContainer) {
        filterContainer.appendChild(searchInput);
    }
}

function searchPhotos(query) {
    if (!query.trim()) {
        renderPhotos();
        return;
    }
    
    const filteredPhotos = photos.filter(photo => 
        photo.title.toLowerCase().includes(query.toLowerCase()) ||
        photo.description.toLowerCase().includes(query.toLowerCase())
    );
    
    photoGrid.innerHTML = '';
    
    filteredPhotos.forEach(photo => {
        const photoElement = createPhotoElement(photo);
        photoGrid.appendChild(photoElement);
    });
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeSearch, 1000);
});
