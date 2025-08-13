const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const pauseBtn = document.getElementById('pauseBtn');
const captureBtn = document.getElementById('captureBtn');
const menuIcon = document.getElementById('menuIcon');
const menuPanel = document.getElementById('menuPanel');
const sidebar = document.getElementById('sidebar');

let stream;
let isPaused = false;
let menuOpen = false;

// Start Camera
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing camera:", err);
    }
}

// Pause / Play Button
pauseBtn.addEventListener('click', () => {
    if (isPaused) {
        video.play();
        pauseBtn.textContent = "Pause";
    } else {
        video.pause();
        pauseBtn.textContent = "Play";
    }
    isPaused = !isPaused;
});

// Capture Button
captureBtn.addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = imgURL;
    a.download = 'capture.png';
    a.click();
});

// Toggle Menu
menuIcon.addEventListener('click', () => {
    if (menuOpen) {
        menuPanel.style.transform = "translateX(-100%)";
        sidebar.style.display = "block";
    } else {
        menuPanel.style.transform = "translateX(0)";
        sidebar.style.display = "none";
    }
    menuOpen = !menuOpen;
});

startCamera();