<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Advanced Real-Time Object Detection</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">

  <!-- Sidebar -->
  <div class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <h2>Object Detection</h2>
      <button class="theme-toggle" id="themeToggle">
        <i class="fas fa-moon"></i>
      </button>
    </div>
    
    <div>
      <h3>Total Detected: <span class="count-box">0</span></h3>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <i class="fas fa-truck"></i>
        <div class="count" id="truckCount">0</div>
        <div class="label">Trucks</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-user"></i>
        <div class="count" id="personCount">0</div>
        <div class="label">People</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-bicycle"></i>
        <div class="count" id="cycleCount">0</div>
        <div class="label">Cycles</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-car"></i>
        <div class="count" id="carCount">0</div>
        <div class="label">Cars</div>
      </div>
    </div>

    <div class="live-count">
      <h3><i class="fas fa-chart-line"></i> Live Count</h3>
      <div class="object-item">
        <span>Truck</span>
        <span id="liveTruckCount">0</span>
      </div>
      <div class="object-item">
        <span>Person</span>
        <span id="livePersonCount">0</span>
      </div>
      <div class="object-item">
        <span>Cycle</span>
        <span id="liveCycleCount">0</span>
      </div>
      <div class="object-item">
        <span>Car</span>
        <span id="liveCarCount">0</span>
      </div>
    </div>

    <div class="history">
      <h3><i class="fas fa-history"></i> Detection History</h3>
      <ul id="historyList">
        <li>No detections yet</li>
      </ul>
    </div>
  </div>

  <!-- Menu Panel -->
  <div class="menu-panel" id="menuPanel">
    <div class="menu-header">
      <h2>Menu</h2>
      <button class="close-menu" id="closeMenu">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <button class="menu-btn"><i class="fas fa-video"></i> Camera Panel</button>
    <button class="menu-btn"><i class="fas fa-tachometer-alt"></i> Dashboard</button>
    <button class="menu-btn"><i class="fas fa-database"></i> Database</button>
    <button class="menu-btn"><i class="fas fa-cog"></i> Settings</button>
    <button class="menu-btn"><i class="fas fa-chart-bar"></i> Analytics</button>
    <button class="menu-btn"><i class="fas fa-download"></i> Export Data</button>
    <button class="menu-btn"><i class="fas fa-question-circle"></i> Help</button>
  </div>

  <!-- Main -->
  <div class="main">
    <div class="top-bar">
      <div class="menu-icon" id="menuIcon">
        <i class="fas fa-bars"></i>
      </div>
      <div class="title-section">
        <h1>Real-Time Object Detection</h1>
        <p>AI-powered object recognition and tracking</p>
      </div>
      <div class="status" id="status">Initializing</div>
    </div>

    <div class="video-container">
      <video id="video" autoplay playsinline muted></video>
      <canvas id="canvas"></canvas>
    </div>

    <div class="controls">
      <button id="startBtn" class="btn-primary"><i class="fas fa-play"></i> Start</button>
      <button id="pauseBtn" class="btn-secondary"><i class="fas fa-pause"></i> Pause</button>
      <button id="captureBtn" class="btn-secondary"><i class="fas fa-camera"></i> Snapshot</button>
      <select id="objectFilter">
        <option value="all">All Objects</option>
        <option value="person">Person</option>
        <option value="truck">Truck</option>
        <option value="cycle">Cycle</option>
        <option value="car">Car</option>
      </select>
      <button id="fullscreenBtn" class="btn-secondary"><i class="fas fa-expand"></i></button>
    </div>
  </div>

</div>

<div class="toast" id="toast">
  <i class="fas fa-check-circle"></i>
  <span id="toastMessage">Snapshot saved successfully!</span>
</div>
<script src="script.js"></script>
</script>
</body>
</html>
