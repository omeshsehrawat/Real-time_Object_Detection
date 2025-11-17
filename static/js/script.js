document.addEventListener("DOMContentLoaded", () => {

  const videoFeed = document.getElementById("videoFeed");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const captureBtn = document.getElementById("captureBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const objectFilter = document.getElementById("objectFilter");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");


  const themeToggle = document.getElementById("themeToggle");
  const menuIcon = document.getElementById("menuIcon");
  const menuPanel = document.getElementById("menuPanel");
  const closeMenu = document.getElementById("closeMenu");


  let isStreaming = false;
  let currentStreamUrl = videoFeed.getAttribute("src");


  // Start camera
  startBtn.addEventListener("click", () => {
    if (!isStreaming) {
      videoFeed.src = currentStreamUrl + "?t=" + Date.now(); // Prevent caching
      videoFeed.style.display = "block";
      isStreaming = true;
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      updateStatus("Streaming", "success");
      showToast("Camera stream started");
    }
  });

  // Pause camera
  pauseBtn.addEventListener("click", () => {
    if (isStreaming) {
      videoFeed.src = "";
      videoFeed.style.display = "none";
      isStreaming = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      updateStatus("Paused", "warning");
      showToast("Camera stream paused");
    }
  });

  // Capture snapshot
  captureBtn.addEventListener("click", () => {
    if (!isStreaming) {
      showToast("Start the camera first!");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      // Set canvas dimensions to match video feed
      canvas.width = videoFeed.videoWidth || 640;
      canvas.height = videoFeed.videoHeight || 480;
      
      // Draw current frame
      context.drawImage(videoFeed, 0, 0, canvas.width, canvas.height);
      
      // Create download link
      const link = document.createElement("a");
      link.download = `snapshot_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      showToast("Snapshot saved successfully!");
    } catch (error) {
      console.error("Snapshot error:", error);
      showToast("Failed to capture snapshot");
    }
  });

  // Fullscreen toggle
  fullscreenBtn.addEventListener("click", () => {
    const videoContainer = document.querySelector('.video-container');
    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  });

  // Object filter
  objectFilter.addEventListener("change", (e) => {
    showToast(`Showing: ${e.target.value}`);
    // Add your object filtering logic here
  });

  /* ======================
        THEME TOGGLE
  ====================== */
  function initializeTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    const isDark = savedTheme === "dark";
    
    document.body.classList.toggle("dark-mode", isDark);
    themeToggle.innerHTML = isDark 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
  }

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.innerHTML = isDark 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
    
    showToast(`${isDark ? 'Dark' : 'Light'} mode activated`);
  });

  /* ======================
        MENU TOGGLE - FIXED
  ====================== */
  menuIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    menuPanel.classList.add("active");
  });

  closeMenu.addEventListener("click", () => {
    menuPanel.classList.remove("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (menuPanel.classList.contains("active") && 
        !menuPanel.contains(e.target) && 
        !menuIcon.contains(e.target)) {
      menuPanel.classList.remove("active");
    }
  });

  // Close menu with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuPanel.classList.contains("active")) {
      menuPanel.classList.remove("active");
    }
  });

  /* ======================
        UTILITY FUNCTIONS
  ====================== */
  function updateStatus(message, type = "info") {
    const statusElement = document.getElementById("status");
    if (statusElement) {
      statusElement.textContent = message;
      // You can add different colors based on type
      statusElement.style.color = type === "success" ? "#10b981" : 
                                 type === "warning" ? "#f59e0b" : "#3b82f6";
    }
  }

  function showToast(message) {
    if (!toast || !toastMessage) {
      console.warn("Toast elements not found");
      return;
    }
    
    toastMessage.textContent = message;
    toast.classList.add("show");
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // Initialize the application
  function init() {
    initializeTheme();
    updateStatus("Ready to start", "info");
    pauseBtn.disabled = true; // Start with pause button disabled
    
    // Auto-start the stream (optional)
    setTimeout(() => {
      startBtn.click();
    }, 1000);
  }

  // Handle video feed errors
  videoFeed.addEventListener("error", () => {
    updateStatus("Stream error", "warning");
    showToast("Error loading video stream");
    isStreaming = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  });

  videoFeed.addEventListener("load", () => {
    updateStatus("Streaming", "success");
  });

  // Initialize the app
  init();
});