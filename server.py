"""Server for travel app."""

from flask import Flask 
import crud as crud
from model import connect_to_db


app = Flask(__name__)












if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True, port=6060)