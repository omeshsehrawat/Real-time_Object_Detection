from flask import Flask, render_template, Response, request, jsonify, session
import time
from camera_access import CameraStreamer
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import registartion_database
import os
import threading

app = Flask(__name__)

load_dotenv()
app.secret_key = os.getenv("SECRET_KEY")

registartion_database.create_users_table()

streamer = CameraStreamer()
threading.Thread(target=streamer.start, daemon=True).start()


@app.route('/')
def login():
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('registration.html')

    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        hashed_password = generate_password_hash(password)

        success = registartion_database.add_user(email, username, hashed_password)
        if success:
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "message": "Email or username already exists."})


@app.route('/login', methods=['GET', 'POST'])
def login_user():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
    
    else:
        email = request.args.get('email')
        password = request.args.get('password')

    user = registartion_database.get_user_by_email(email)

    if user and check_password_hash(user["password"], password):
        session["user_id"] = user["id"]
        session["username"] = user["username"]
        session["email"] = user["email"]
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Invalid email or password"})

@app.route("/logout")
def logout():
    session.clear()
    return render_template('login.html')

@app.route('/home')
def home():
    return render_template('index.html')

@app.route("/video_feed")
def video_feed():
    def gen():
        while True:
            frame = streamer.get_frame()
        
            if frame:
                yield(b"--frame\r\n"
                      b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")
            time.sleep(0.03)  # ~30 FPS limiter
    return Response(gen(), mimetype="multipart/x-mixed-replace; boundary=frame")

if __name__ == '__main__':
    app.run(debug=True)