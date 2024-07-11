

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """A user."""

    __tablename__= "users"

    user_id = db.Column(db.Integer, autoincrement= True, primary_key=True)
    username = db.Column(db.String(30),unique=True)
    password = db.Column(db.String(8))
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    email = db.Column(db.String, unique=True)

    trips = db.relationship('Trip', back_populates='user')
    participants = db.relationship('Participant', back_populates='user')

    def __repr__(self):
        return f"<User user_id={self.user_id} email={self.email} username={self.username}>"



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

