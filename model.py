""" Models for travel app."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """A user."""

    __tablename__= "users"

    user_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    username = db.Column(db.String(30),unique=True)
    password = db.Column(db.String(8))
    first_name = db.Column(db.String)
    last_name = db.Coulmn(db.String)
    email = db.Column(db.String, unique=True)


class Trip(db.Model):
    """A trip."""

    __tablename__= "trips"

    trip_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    trip_name = db.Column(db.String)
    location = db.Column(db.String)
    start_date = db.Column(db.Integer)
    end_date = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users=user_id'))


class Itineraries(db.Model):
    """An itinerary."""

    __tablename__= "itineraries"

    itineraries_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    name = db.Column(db.String)
    category = db.Column(db.String)
    date = db.Column(db.Integer)
    time = db.Column(db.Integer)
    tickets_bought = db.Column(db.Boolean)
    address = db.Column(db.String)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips=trip_id'))


class Favorite(db.Model):
    """A favorited activity."""

    __tablename__= "favorites"

    favorite_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    activity_name = db.Column(db.String)
    category = db.Column(db.String)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips=trip_id'))


class Packing(db.Model):
    """Packing list for a trip."""

    __tablename__= "packings"

    packing_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    item_name = db.Column(db.String)
    is_packed = db.Column(db.Boolean)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips=trip_id'))

class Transport(db.Model):
    """Transportation information."""

    __tablename__= "transportations"

    transportation_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    transport_type = db.Column(db.String)
    pick_up_time = db.Column(db.Integer)
    drop_off_time = db.Column(db.Integer)
    start_day = db.Column(db.Integer)
    end_day = db.Column(db.Integer)
    extra_details = db.Column(db.String)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips=trip_id'))

class Accomodation(db.Model):
    """Accomodation information."""

    __tablename__= "accomodations"

    accomodation_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    accomodation_type = db.Column(db.String)
    accomodation_name = db.Column(db.String)
    confirmation_number = db.Column(db.String)
    address = db.Column(db.String)
    check_in = db.Column(db.Integer)
    check_out = db.Column(db.Integer)
    start_day = db.Column(db.Integer)
    end_day = db.Column(db.Integer)
    extra_details = db.Column(db.String)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips=trip_id'))





























































def connect_to_db(app):
    """Connect to database."""

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///travel'
    app.config['SQLALCHEMY_ECHO'] = True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = app
    db.init_app(app)

if __name__ == '__main__':
    from server import app

    connect_to_db(app)
    