
# _Passport Diaries: Your Personalized Travel Companion_






Welcome to Passport Diaries, a digital travel journal designed to help you plan and manage your dream vacations with ease. Built with Flask and React, this app allows you to organize your trips, discover new activities, and visualize your travel plans on an interactive map. With features like automated location suggestions, Yelp-powered activity searches, and customizable itineraries, Passport Diaries makes trip planning a breeze. Explore, plan, and embark on unforgettable adventures with Passport Diaries as your trusted travel companion.
Feel free to modify it to fit your style!


## Table of Contents🐛

* Getting Started
* Tech
* Features
* Future Work
* About ME


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for further development, exploration and testing.

#### Prerequisites

To run the webapp locally: Install Python 3.9.6/ Install PostgreSQL/ Install Vite

Before starting the webapp: 
Change ```vite.config.js``` to:
```sh
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:6060",
        changeOrigin: true,
      },
    },
  },
});
```

Clone the repo:

```sh
https://github.com/ssigheartau/Passport-Diaries.git
```
In one terminal: 

Create a virtual environment:

```sh
virtualenv env
source env/bin/activate
```

Install requirements:

```sh
(env)$ pip3 install -r requirements.txt
```
Create the db: 
```sh
createdb passport_diaries
python3 -i model.py  
db.create_all()
```
Then, run the server with ```python3 server.py```:

```sh
(env)$ python3 server.py
 * ...
 * Running on http://10.0.0.84:6060/ (Press CTRL+C to quit)
 * Restarting with stat
 * Connected to the db!
```

In the second terminal: 

Activating the API:
```sh
env
source env.sh
```
Run the frontend:
```sh
cd frontend 
npm run dev
```


You should see similar success messages in the console. If you have any issues getting up and running, please contact the author via GitHub.


## Tech
 * PostgreSQL
* SQLAlchemy
* Flask
* AJAX
* Vite
* React
* JavaScript
* Python
* CSS
* Mapbox API(Mapbox GLJS, Mapbox Geocoding)
* Yelp Fusion API




## Features
 Users can login or create an account 
 <img src = screenshots/login_page.png alt="Login Page"/>
 Users can use the search feature to look up vacation destinations
 <img src = screenshots/Search.png alt="Search"/>
 Users can view all their saved upcoming vacations
 <img src = screenshots/all_trips.png alt="All Trips"/>
 Each trip has its own page to further edit 
 <img src = screenshots/trip_page.png alt="Trip Page"/>
 Users can search for activities thru the built in Yelp search feature. They can either search by keyword or utilize the built in Top Rate "Activities", "Restaurants" button
 <img src = screenshots/yelp_search.png alt="Yelp Search"/>
 Users can all add personal activities to the itinerary
 <img src = screenshots/itinerary_add.png alt="Itinerary Add"/>
 Users can add activities to the itinerary from their saved list of activites curated thru the Yelp search
 <img src = screenshots/activities_list.png alt="Activities List"/>
 


## Future Work 

* Each trip will display an image 
* Each trip will have a marker on the homescreen map
* Trips will have more feature to customize with
** Budget template 
** A packing list template
** Accommodation/Transportation template 
** To Do List 
** Add friends to the trip 
** Give friends the ability to add to the trip 
** Add a comments section where friends can communicate during the planning process 
 
 


## About ME
Sorina Sigheartau created Passport Diaries- for more information, connect on [LinkedIn](https://www.linkedin.com/in/sorina-sigheartau-3358b5255/)

[VIEW DEMO ON YOUTUBE](https://youtu.be/iNtTrd5Lsk4)
 <img src = screenshots/youtube.png alt="youtube"/>


