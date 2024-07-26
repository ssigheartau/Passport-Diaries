"""Server for travel app."""

from flask import Flask, jsonify, request, session, json
import crud 
from model import db, connect_to_db, User, Trip
from datetime import datetime


from jinja2 import StrictUndefined


app = Flask(__name__)
app.secret_key = "dev" 
app.jinja_env.undefined = StrictUndefined





@app.route('/api/register', methods = ['POST'])
def register_user():
    username = request.json["username"]
    first_name = request.json["first_name"]
    last_name = request.json["last_name"]
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"message": "User already exists"}), 409
    
    new_user = User(username=username, first_name=first_name, last_name=last_name,email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "message": "User already exists",
        "id": new_user.user_id,
        "username": new_user.username,
        "first_name": new_user.first_name,
        "last_name": new_user.last_name,
        "email": new_user.email 
    })

@app.route('/api/login', methods = ['POST'])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first() 

    if user is None:
        return jsonify({"message": "Username not found", "status":"error"}), 401
    
    if user.password != password:
        return jsonify({"message": "Password does not match", "status":"error"}), 401
    
    session['user_id'] = user.user_id

    return jsonify({
        "message":"User sucessfully logged in",
        "status":"ok",
        "id": user.user_id,
        "username": user.username
    })

@app.route('/api/trip', methods = ['POST'])
def trip():
    trip_name = request.json["trip_name"]
    longitude= request.json["longitude"]
    latitude = request.json["latitude"]
    start_date = datetime.strptime(request.json["start_date"], '%Y-%m-%d').date()
    end_date = datetime.strptime(request.json["end_date"], '%Y-%m-%d').date()
    user_id = request.json["user_id"]


    

    if not all([longitude, latitude, start_date, end_date, user_id]):
        return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

    new_trip = Trip(trip_name=trip_name, longitude=longitude, latitude=latitude, start_date=start_date,end_date=end_date, user_id=user_id)
    db.session.add(new_trip)
    db.session.commit()

    users_saved_trips = Trip.query.filter_by(user_id=user_id).all()
    results = []

    for trip in users_saved_trips:
        result = {
            "trip_name": trip.trip_name, 
            "start_date": trip.start_date, 
            "end_date": trip.end_date,
        } 
        results.append(result)
    return jsonify({
        "message": "Trip created",
        "results": results, 
    })

@app.route('/api/current_user', methods=['GET'])
def get_current_user():
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        
        if user:
            users_saved_trips = Trip.query.filter_by(user_id=user_id).all()
            trips = [{"trip_id": trip.trip_id, "trip_name": trip.trip_name, "location": trip.location, "start_date": trip.start_date, "end_date": trip.end_date} for trip in users_saved_trips]

            return jsonify({"status": "ok", "user_id": user.user_id, "user_trips":trips}), 200
    
    return jsonify({"status": "error", "message": "User not logged in"}), 401



if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True, port=6060)