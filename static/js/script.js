const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const captureBtn = document.getElementById('captureBtn');
const menuIcon = document.getElementById('menuIcon');
const closeMenu = document.getElementById('closeMenu');
const menuPanel = document.getElementById('menuPanel');
const sidebar = document.getElementById('sidebar');
const status = document.getElementById('status');
const themeToggle = document.getElementById('themeToggle');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

let stream;
let isPaused = true;
let menuOpen = false;

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
});

// Start Camera
async function startCamera() {
  try {
    status.textContent = "Accessing camera...";
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
    });
    video.srcObject = stream;
    
    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      status.textContent = "Camera Ready";
    });
  } catch (err) {
    console.error("Error accessing camera:", err);
    status.textContent = "Camera Error!";
    status.style.color = "var(--danger)";
    
    // Simulate video for demo purposes
    simulateVideo();
  }
}

// Simulate video for demo (when camera not available)
function simulateVideo() {
  video.src = "https://source.unsplash.com/random/1280x720/?traffic,street";
  video.addEventListener('loadeddata', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    status.textContent = "Demo Mode";
  });
}

// Start/Pause button
startBtn.addEventListener('click', () => {
  if (isPaused) {
    video.play();
    startBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
    startBtn.classList.add('btn-secondary');
    startBtn.classList.remove('btn-primary');
    pauseBtn.disabled = false;
    status.textContent = "Camera Running";
  } else {
    video.pause();
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    startBtn.classList.add('btn-primary');
    startBtn.classList.remove('btn-secondary');
    pauseBtn.disabled = true;
    status.textContent = "Stopped";
  }
  isPaused = !isPaused;
});

// Pause button
pauseBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    status.textContent = "Camera Running";
  } else {
    video.pause();
    pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    status.textContent = "Paused";
  }
});

// Snapshot
captureBtn.addEventListener('click', () => {
  const imgURL = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = imgURL;
  a.download = 'snapshot.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast('Snapshot saved successfully!');
});

// Fullscreen
fullscreenBtn.addEventListener('click', () => {
  const videoContainer = document.querySelector('.video-container');
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
});

// Menu toggle
function toggleMenu() {
  if(menuOpen){
    menuPanel.style.transform = "translateX(-100%)";
    sidebar.style.display = "flex";
  } else {
    menuPanel.style.transform = "translateX(0)";
    sidebar.style.display = "none";
  }
  menuOpen = !menuOpen;
}
menuIcon.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', toggleMenu);
document.querySelectorAll('.menu-btn').forEach(btn => btn.addEventListener('click', toggleMenu));

// Show toast notification
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Initialize camera and UI
startCamera();
