"""CRUD operations."""

from backend.model import db, User, Trip, Itinerary, Favorite, Participant, Conversation,TripParticipantsConversation, connect_to_db

def create_user(username, password, first_name, last_name, email):
    """Create and return a new user."""

    user = User(username=username, password=password, first_name=first_name, last_name=last_name, email=email)

    return user

def create_trip(trip_name, location, start_date, end_date, user_id):
    """Create and return a new trip"""

    trip = Trip(trip_name=trip_name, location=location, start_date=start_date, end_date=end_date, user_id=user_id)

    return trip 

def all_trips():
    """Return all the trips."""

    list_of_trips = Trip.query.all()

    return list_of_trips

def create_itinerary(name,category,date, time, tickets_bought, address):
    """Create and return a new itinerary"""
    itinerary = Itinerary(name=name, category=category, date=date, time=time, tickets_bought=tickets_bought, address=address)

    return itinerary

def create_favorite(activity_name, category):
    """Create and return a list of favorited activities the user will potentially want to add to the itinerary."""

    favorite = Favorite(activity_name=activity_name, category=category)

    return favorite

def all_favorite():
    """Return all activities added to a favorite list"""

    list_of_favorites=Favorite.query.all()
    
    return list_of_favorites














if __name__ == '__main__':
    from backend.server import app
    connect_to_db(app)