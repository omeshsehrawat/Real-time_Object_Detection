# Real-Time Object Detection on Edge Computing

## 📌 Project Overview
This project focuses on building a real-time object detection system using an RTSP camera stream processed on edge computing devices. The system accesses live video, performs inference using a custom-trained YOLO model, and displays detected objects with bounding boxes. The objective is to achieve low-latency, real-time object detection suitable for security, monitoring, and automation applications.

## 🚀 Features
- Real-time object detection on live RTSP feed  
- Custom YOLO model support (trained on person, car, bike, etc.)  
- Flask-based web dashboard  
- Dark/Light mode toggle  
- Start/Pause camera controls  
- Snapshot capture and download  
- Object filter dropdown  
- Responsive UI  
- Edge-device compatible (Jetson Nano/DeepStream supported)  

## 🏗 Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python, Flask  
- **AI Model:** YOLO (custom trained)  
- **Edge Framework:** NVIDIA DeepStream + GStreamer  
- **Others:** SQLite (for storing logs/entries), RTSP camera  

## 📸 System Workflow
1. RTSP camera feed is accessed using Flask  
2. Frames are processed using YOLO on the edge device  
3. Detection results are sent back to the frontend  
4. UI displays bounding boxes + object labels  
5. User can perform operations like:  
   - Start/pause stream  
   - Take snapshot  
   - Switch theme  
   - Filter object categories  

## 📂 Project Structure
project/

│── static/

│ ├── css/

│ ├── js/

│ └── images/

│── templates/

│ ├── index.html

│ ├── home.html

│── app.py

│── model/

│── requirements.txt

│── README.md


## 🔧 Installation & Setup
1. Clone the repo  

2. Install dependencies  

3. Run Flask app  


## 🧪 Training Custom YOLO Model
Steps to train:  
- Collect RTSP camera frames → annotate  
- Train YOLO on custom dataset  
- Export model to ONNX  
- Convert ONNX → DeepStream engine  
- Deploy the engine in the DeepStream pipeline  

