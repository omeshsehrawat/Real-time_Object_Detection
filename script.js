
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
  
  const truckCountEl = document.getElementById('truckCount');
  const personCountEl = document.getElementById('personCount');
  const cycleCountEl = document.getElementById('cycleCount');
  const carCountEl = document.getElementById('carCount');
  const liveTruckCountEl = document.getElementById('liveTruckCount');
  const livePersonCountEl = document.getElementById('livePersonCount');
  const liveCycleCountEl = document.getElementById('liveCycleCount');
  const liveCarCountEl = document.getElementById('liveCarCount');
  const countBox = document.querySelector('.count-box');
  const historyList = document.getElementById('historyList');
  
  let stream;
  let isPaused = true;
  let menuOpen = false;
  let detectionInterval;
  let totalCount = 0;
  let detectionHistory = [];
  
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
        startDetections();
        
        // Simulate initial objects for demo
        setTimeout(() => {
          simulateDetections();
        }, 1000);
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
      startDetections();
      
      // Simulate initial objects for demo
      setTimeout(() => {
        simulateDetections();
      }, 1000);
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
      status.textContent = "Detecting...";
      startDetections();
    } else {
      video.pause();
      startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
      startBtn.classList.add('btn-primary');
      startBtn.classList.remove('btn-secondary');
      pauseBtn.disabled = true;
      status.textContent = "Stopped";
      stopDetections();
    }
    isPaused = !isPaused;
  });
  
  // Pause button
  pauseBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
      status.textContent = "Detecting...";
      startDetections();
    } else {
      video.pause();
      pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
      status.textContent = "Paused";
      stopDetections();
    }
  });
  
  // Snapshot
  captureBtn.addEventListener('click', () => {
    const imgURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = imgURL;
    a.download = 'detection-snapshot.png';
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
  
  // Start detection process (simulated for demo)
  function startDetections() {
    stopDetections();
    detectionInterval = setInterval(detectObjects, 1000);
  }
  
  // Stop detection process
  function stopDetections() {
    clearInterval(detectionInterval);
  }
  
  // Simulate object detection for demo
  function simulateDetections() {
    // Add some initial objects to history
    addDetectionToHistory('person', 3);
    addDetectionToHistory('truck', 1);
    addDetectionToHistory('car', 2);
    addDetectionToHistory('cycle', 1);
    
    // Update counts
    updateCount('person', 3);
    updateCount('truck', 1);
    updateCount('car', 2);
    updateCount('cycle', 1);
    
    totalCount = 7;
    countBox.textContent = totalCount;
  }
  
  // Detect objects (simulated)
  function detectObjects() {
    if (Math.random() > 0.3) { // 70% chance of detection each second
      const objects = ['person', 'truck', 'car', 'cycle'];
      const randomObject = objects[Math.floor(Math.random() * objects.length)];
      const count = Math.floor(Math.random() * 2) + 1; // 1 or 2 objects
      
      addDetectionToHistory(randomObject, count);
      updateCount(randomObject, count);
      
      totalCount += count;
      countBox.textContent = totalCount;
      
      drawDetectionBoxes(randomObject, count);
    }
  }
  
  // Draw detection boxes on canvas (simulated)
  function drawDetectionBoxes(objectType, count) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * (canvas.width - 100);
      const y = Math.random() * (canvas.height - 100);
      const width = 80 + Math.random() * 70;
      const height = 60 + Math.random() * 60;
      
      // Draw box
      ctx.strokeStyle = getColorForObject(objectType);
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Draw background for label
      ctx.fillStyle = getColorForObject(objectType);
      ctx.font = '14px Arial';
      const text = `${objectType} ${i+1}`;
      const textWidth = ctx.measureText(text).width;
      
      ctx.fillRect(x, y - 20, textWidth + 10, 20);
      
      // Draw label
      ctx.fillStyle = 'white';
      ctx.fillText(text, x + 5, y - 5);
    }
  }
  
  // Get color for object type
  function getColorForObject(objectType) {
    const colors = {
      'person': '#ef4444',
      'truck': '#3b82f6',
      'car': '#f59e0b',
      'cycle': '#10b981'
    };
    
    return colors[objectType] || '#888';
  }
  
  // Add detection to history
  function addDetectionToHistory(objectType, count) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    detectionHistory.unshift({
      type: objectType,
      count: count,
      time: timeString
    });
    
    // Keep only last 5 history items
    if (detectionHistory.length > 5) {
      detectionHistory.pop();
    }
    
    updateHistoryList();
  }
  
  // Update history list in UI
  function updateHistoryList() {
    historyList.innerHTML = '';
    
    if (detectionHistory.length === 0) {
      historyList.innerHTML = '<li>No detections yet</li>';
      return;
    }
    
    detectionHistory.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item.count} ${item.type}(s)</span>
        <span class="time">${item.time}</span>
      `;
      historyList.appendChild(li);
    });
  }
  
  // Update count for an object type
  function updateCount(objectType, count) {
    const elements = {
      'person': [personCountEl, livePersonCountEl],
      'truck': [truckCountEl, liveTruckCountEl],
      'car': [carCountEl, liveCarCountEl],
      'cycle': [cycleCountEl, liveCycleCountEl]
    };
    
    if (elements[objectType]) {
      elements[objectType].forEach(el => {
        const current = parseInt(el.textContent);
        el.textContent = current + count;
      });
    }
  }
  
  // Initialize camera and UI
  startCamera();
