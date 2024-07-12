"""Database for Travel webapp."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """A user."""

    __tablename__= "users"

    user_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    username = db.Column(db.String(30),unique=True)
    password = db.Column(db.String(15))
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    trips = db.relationship('Trip', back_populates='user')
    participants = db.relationship('Participant', back_populates='user')

    def __repr__(self):
        return f"<User user_id={self.user_id} email={self.email} username={self.username}>"



class Trip(db.Model):
    """A trip."""

    __tablename__= "trips"

    trip_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    trip_name = db.Column(db.String)
    location = db.Column(db.String)
    start_date = db.Column(db.Integer)
    end_date = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    user = db.relationship('User', back_populates='trips')
    itineraries = db.relationship('Itinerary', back_populates='trip')
    favorites = db.relationship('Favorite', back_populates='trip')
    packings = db.relationship('Packing', back_populates='trip')
    transportations = db.relationship('Transport', back_populates='trip')
    accommodations = db.relationship('Accommodation', back_populates='trip')
    budgets = db.relationship('Budget', back_populates='trip')
    todos = db.relationship('ToDo', back_populates='trip')
    participants = db.relationship('Participant', back_populates='trip')

    def __repr__(self):
        return f"<Trip trip_id={self.trip_id} trip_name={self.trip_name} location={self.location}>"



class Itinerary(db.Model):
    """An itinerary."""

    __tablename__= "itineraries"

    itinerary_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    name = db.Column(db.String)
    category = db.Column(db.String)
    date = db.Column(db.Integer)
    time = db.Column(db.Integer)
    tickets_bought = db.Column(db.Boolean)
    address = db.Column(db.String)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.trip_id'))

    trip = db.relationship('Trip', back_populates='itineraries')

    def __repr__(self):
        return f"<Itinerary itinerary_id={self.itinerary_id} name={self.name} category={self.category}>"


class Favorite(db.Model):
    """A favorited activity."""

    __tablename__= "favorites"

    favorite_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    activity_name = db.Column(db.String)
    category = db.Column(db.String)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.trip_id'))

    trip = db.relationship('Trip', back_populates='favorites')

    def __repr__(self):
        return f"<Favorite favorite_id={self.favorite_id} activity_name={self.activity_name} category={self.category}>"


class Packing(db.Model):
    """Packing list for a trip."""

    __tablename__= "packings"

    packing_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    item_name = db.Column(db.String)
    is_packed = db.Column(db.Boolean)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.trip_id'))

    trip = db.relationship('Trip', back_populates='packings')

    def __repr__(self):
        return f"<Packing packing_id={self.packing_id} item_name={self.item_name} is_packed={self.is_packed}>"


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
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.trip_id'))

    trip = db.relationship('Trip', back_populates='transportations')

    def __repr__(self):
        return f"<Transport transportation_id={self.transportation_id} transport_type={self.transport_type} pick_up_time={self.pick_up_time} drop_off_time={self.drop_off_time}>"


class Accommodation(db.Model):
    """Accommodation information."""

    __tablename__= "accommodations"

    accommodation_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    accommodation_type = db.Column(db.String)
    accommodation_name = db.Column(db.String)
    confirmation_number = db.Column(db.String)
    address = db.Column(db.String)
    check_in = db.Column(db.Integer)
    check_out = db.Column(db.Integer)
    start_day = db.Column(db.Integer)
    end_day = db.Column(db.Integer)
    extra_details = db.Column(db.String)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.trip_id'))

    trip = db.relationship('Trip', back_populates='accommodations')

    def __repr__(self):
        return f"<Accommodation accommodation_id={self.accommodation_id} accommodation_type={self.accommodation_type} accommodation_name={self.accommodation_name} confirmation_number={self.confirmation_number}>"


class Budget(db.Model):
    """Budget sheet for each trip."""

    __tablename__= "budgets"

    budget_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    item_name = db.Column(db.String)
    amount = db.Column(db.Integer)
    category = db.Column(db.String)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.trip_id'))

    trip = db.relationship('Trip', back_populates='budgets')

    def __repr__(self):
        return f"<Budget budget_id={self.budget_id} item_name={self.item_name} amount={self.amount} category={self.category}>"



class ToDo(db.Model):
    """A to do list for each trip."""

    __tablename__= "todos"

    todo_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    task = db.Column(db.String)
    is_done = db.Column(db.Boolean)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.trip_id'))

    trip = db.relationship('Trip', back_populates='todos')

    def __repr__(self):
        return f"<ToDo todo_id={self.todo_id} task={self.task} is_done={self.is_done}>"


class Participant(db.Model):
    """Participants for each trip."""

    __tablename__= "participants"

    participant_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.trip_id'))

    trip = db.relationship('Trip', back_populates='participants')
    conversations = db.relationship('Conversation', secondary='tripparticipantconversations', back_populates='participants')
    user = db.relationship('User', back_populates='participants')

    def __repr__(self):
        return f"<Participant participant_id={self.participant_id} user_id={self.user_id} trip_id={self.trip_id}>"


class Conversation(db.Model):
    """Conversations for each trip."""

    __tablename__= "conversations"

    conversation_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    message = db.Column(db.String)
    created_at = db.Column(db.Integer)

    participants = db.relationship('Participant', secondary='tripparticipantconversations', back_populates='conversations')


    def __repr__(self):
        return f"<Conversation conversation_id={self.conversation_id} message={self.message} created_at={self.created_at}>"




class TripParticipantsConversation(db.Model):
    """Middle table for Conversation and Participants for each trip."""

    __tablename__= "tripparticipantconversations"

    trip_participant_conversation_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    participant_id = db.Column(db.Integer, db.ForeignKey('participants.participant_id'), nullable=False)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.conversation_id'), nullable=False)

    def __repr__(self):
        return f"<TripParticipantsConversation trip_participant_conversation_id={self.trip_participant_conversation_id} participant_id={self.participant_id} conversation_id={self.conversation_id}>"





def connect_to_db(app):

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///travel'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True

    db.app = app
    db.init_app(app)

    print('Connected to database!')


if __name__ == '__main__':
    from server import app

    connect_to_db(app)

