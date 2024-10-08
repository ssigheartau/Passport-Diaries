"""Server for travel app."""

from flask import Flask, jsonify, request, session, json 
import os
import requests
import crud 
from model import db, connect_to_db, User, Trip, Activity, Itinerary, Favorite
from datetime import datetime




from jinja2 import StrictUndefined


app = Flask(__name__)
app.secret_key = "dev" 
app.jinja_env.undefined = StrictUndefined

YELP_API_KEY = os.getenv('VITE_YELP_FUSION_ACCESS_TOKEN')
# print(f"Yelp API Key: {YELP_API_KEY}")




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
    location = request.json["location"]
    start_date = datetime.strptime(request.json["start_date"], '%Y-%m-%d').date()
    end_date = datetime.strptime(request.json["end_date"], '%Y-%m-%d').date()
    user_id = request.json["user_id"]


    

    if not all([longitude, latitude, start_date, end_date, user_id]):
        return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

    new_trip = Trip(trip_name=trip_name, location=location,longitude=longitude, latitude=latitude, start_date=start_date,end_date=end_date, user_id=user_id)
    db.session.add(new_trip)
    db.session.commit()

    users_saved_trips = Trip.query.filter_by(user_id=user_id).all()
    results = []

    for trip in users_saved_trips:
        result = {
            "trip_name": trip.trip_name, 
            "location" : trip.location,
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


@app.route('/api/trip/<int:trip_id>', methods=['GET'])
def get_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if trip:
        trip_data = {
            "trip_id": trip.trip_id,
            "trip_name": trip.trip_name,
            "location" : trip.location,
            "longitude": trip.longitude,
            "latitude": trip.latitude,
            "start_date": trip.start_date.strftime('%Y-%m-%d'),
            "end_date": trip.end_date.strftime('%Y-%m-%d')
        }
        return jsonify({"status": "ok", "trip": trip_data}), 200
    return jsonify({"status": "error", "message": "Trip not found"}), 404

@app.route('/api/yelp_search', methods=['POST'])
def yelp_search():
    search_term = request.json.get("term", "")
    latitude = request.json.get("latitude")
    longitude = request.json.get("longitude")
    search_type = request.json.get("type", "")  # 'activities' or 'restaurants'

    headers = {
        "Authorization": f"Bearer {YELP_API_KEY}"
    }

    params = {
        
        "latitude": latitude,
        "longitude": longitude,
        "limit": 30,
        "sort_by": "rating"
    }

    if search_term:
        params["term"] = search_term

    if search_type == 'restaurants':
        params["categories"] = "restaurants"
    elif search_type == 'activities':
        params["categories"] = "active"

    response = requests.get("https://api.yelp.com/v3/businesses/search", headers=headers, params=params)

    if response.status_code != 200:
        return jsonify({"status": "error", "message": "Failed to fetch Yelp data"}), response.status_code

    return jsonify({"status": "ok", "results": response.json().get("businesses", [])}), 200


@app.route('/api/add_activity', methods=['POST'])
def add_activity():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"status": "error", "message": "User not logged in"}), 401

    name = request.json.get("name")
    details = request.json.get("details", "")
    trip_id = request.json.get("trip_id", None)
    location = request.json.get("location", {})  # Get location from request
    rating = request.json.get("rating", None)    # Get rating from request


    new_activity = Activity(name=name, details=details, user_id=user_id, trip_id=trip_id, location=location, rating=rating)
    db.session.add(new_activity)
    db.session.commit()

    return jsonify({"status": "ok", "activity_id": new_activity.activity_id}), 200

@app.route('/api/get_activities/<int:trip_id>', methods=['GET'])
def get_activities(trip_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"status": "error", "message": "User not logged in"}), 401

    activities = Activity.query.filter_by(user_id=user_id, trip_id=trip_id).all()
    activities_list = [{"id": activity.activity_id, "name": activity.name, "details": activity.details, "location": activity.location, "rating": activity.rating} for activity in activities]

    return jsonify({"status": "ok", "activities": activities_list}), 200

@app.route('/api/add_itinerary_item', methods=['POST'])
def add_itinerary_item():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"status": "error", "message": "User not logged in"}), 401

    trip_id = request.json.get("trip_id")
    name = request.json.get("name")
    category = request.json.get("category", "")
    date = request.json.get("date")
    time = request.json.get("time")
    address = request.json.get("address", "")
    tickets_bought = request.json.get("tickets_bought", False)

    new_itinerary_item = Itinerary(
        name=name, category=category, date=datetime.strptime(date, '%Y-%m-%d'), time=time,
        address=address, tickets_bought=tickets_bought, trip_id=trip_id
    )
    db.session.add(new_itinerary_item)
    db.session.commit()

    return jsonify({"status": "ok", "itinerary_id": new_itinerary_item.itinerary_id}), 200

@app.route('/api/get_itinerary/<int:trip_id>', methods=['GET'])
def get_itinerary(trip_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"status": "error", "message": "User not logged in"}), 401

    itinerary_items = Itinerary.query.filter_by(trip_id=trip_id).all()
    itinerary_list = [{
        "id": item.itinerary_id,
        "name": item.name,
        "category": item.category,
        "date": item.date.strftime('%Y-%m-%d'),
        "time": item.time.strftime('%H:%M'), 
        "address": item.address,
        "tickets_bought": item.tickets_bought
    } for item in itinerary_items]

    return jsonify({"status": "ok", "itinerary": itinerary_list}), 200





if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True, port=6060)