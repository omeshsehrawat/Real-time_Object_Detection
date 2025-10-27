document.addEventListener("DOMContentLoaded", () => {
  const videoFeed = document.getElementById("videoFeed");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const captureBtn = document.getElementById("captureBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  const themeToggle = document.getElementById("themeToggle");
  const sidebar = document.getElementById("sidebar");
  const menuIcon = document.getElementById("menuIcon");
  const menuPanel = document.getElementById("menuPanel");
  const closeMenu = document.getElementById("closeMenu");

  // Flask MJPEG stream URL
  const streamURL = videoFeed.getAttribute("src");

  /* ======================
        CAMERA CONTROLS
  ====================== */

  // Start camera
  startBtn.addEventListener("click", () => {
    videoFeed.src = streamURL;
    videoFeed.style.display = "block";
    showToast("Camera started");
  });

  // Pause camera
  pauseBtn.addEventListener("click", () => {
    videoFeed.src = "";
    videoFeed.style.display = "none";
    showToast("Camera paused");
  });

  // Capture snapshot
  captureBtn.addEventListener("click", () => {
    if (videoFeed.style.display === "none" || !videoFeed.src) {
      showToast("Camera is not running!");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoFeed.width || 640;
    canvas.height = videoFeed.height || 480;
    const ctx = canvas.getContext("2d");

    const frame = new Image();
    frame.crossOrigin = "anonymous";
    frame.src = videoFeed.src;

    frame.onload = () => {
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `snapshot_${Date.now()}.png`;
      link.click();
      showToast("Snapshot saved successfully!");
    };

    frame.onerror = () => {
      showToast("Unable to capture snapshot. Try again.");
    };
  });

  // Fullscreen toggle
  fullscreenBtn.addEventListener("click", () => {
    if (videoFeed.requestFullscreen) {
      videoFeed.requestFullscreen();
    } else if (videoFeed.webkitRequestFullscreen) {
      videoFeed.webkitRequestFullscreen();
    } else if (videoFeed.msRequestFullscreen) {
      videoFeed.msRequestFullscreen();
    }
  });

  /* ======================
        THEME TOGGLE
  ====================== */
  const currentTheme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark-mode", currentTheme === "dark");

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.innerHTML = isDark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  });

  // Set correct icon on load
  themeToggle.innerHTML =
    currentTheme === "dark"
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

  /* ======================
        MENU PANEL
  ====================== */

  // Check if elements exist before adding listeners
  if (menuIcon && menuPanel && closeMenu) {
    menuIcon.addEventListener("click", () => {
      menuPanel.classList.add("active");
    });

    closeMenu.addEventListener("click", () => {
      menuPanel.classList.remove("active");
    });

    // Optional: Close menu when clicking outside of it
    document.addEventListener("click", (e) => {
      if (
        menuPanel.classList.contains("active") &&
        !menuPanel.contains(e.target) &&
        !menuIcon.contains(e.target)
      ) {
        menuPanel.classList.remove("active");
      }
    });
  } else {
    console.warn("Menu elements not found in DOM!");
  }

  /* ======================
        TOAST FUNCTION
  ====================== */
  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }
});
