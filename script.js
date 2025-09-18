
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
  const uptimeEl = document.getElementById('uptime');
  
  let stream;
  let isPaused = true;
  let menuOpen = false;
  let startTime = null;
  let uptimeInterval;

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
        status.textContent = "Camera Active";
        
        // Start uptime counter
        startTime = new Date();
        updateUptime();
        uptimeInterval = setInterval(updateUptime, 1000);
      });
    } catch (err) {
      console.error("Error accessing camera:", err);
      status.textContent = "Camera Error!";
      status.style.color = "var(--danger)";
      
      // Use placeholder image for demo purposes
      video.src = "https://source.unsplash.com/random/1280x720/?city,street";
      video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        status.textContent = "Demo Mode";
        
        // Start uptime counter
        startTime = new Date();
        updateUptime();
        uptimeInterval = setInterval(updateUptime, 1000);
      });
    }
  }
  
  // Update uptime counter
  function updateUptime() {
    if (!startTime) return;
    
    const now = new Date();
    const diff = now - startTime;
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    uptimeEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Start/Pause button
  startBtn.addEventListener('click', () => {
    if (isPaused) {
      video.play();
      startBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
      startBtn.classList.add('btn-secondary');
      startBtn.classList.remove('btn-primary');
      pauseBtn.disabled = false;
      status.textContent = "Camera Active";
    } else {
      video.pause();
      startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
      startBtn.classList.add('btn-primary');
      startBtn.classList.remove('btn-secondary');
      pauseBtn.disabled = true;
      status.textContent = "Camera Stopped";
    }
    isPaused = !isPaused;
  });
  
  // Pause button
  pauseBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
      status.textContent = "Camera Active";
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
    a.download = 'camera-snapshot.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showToast('Snapshot saved successfully!');
    
    // Add to history
    const historyList = document.getElementById('historyList');
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    const li = document.createElement('li');
    li.innerHTML = `Snapshot captured <span class="time">${timeString}</span>`;
    historyList.prepend(li);
    
    // Keep only 5 history items
    if (historyList.children.length > 5) {
      historyList.removeChild(historyList.lastChild);
    }
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
