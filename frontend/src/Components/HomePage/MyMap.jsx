import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useNavigate } from "react-router-dom";
import TripCard from "./TripCard";
import './MyMapStyle.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MyMap = () => {
    const mapContainer = useRef(null);
    const geocoderContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(5);

    const [tripName, setTripName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [tripDetails, setTripDetails] = useState([]);
    // const [tripStartDate, setTripStartDate] = useState('');
    // const [tripEndDate, setTripEndDate] = useState('');
    // const [tripName, setTripName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [tripID, setTripID] = useState('');

    // Fetch current user on component mount
    useEffect(() => {
        fetch("/api/current_user")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "ok") {
                    setUserId(data.user_id);
                    setTripDetails(data.user_trips);
                } else {
                    setErrorMessage(data.message);
                }
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
                setErrorMessage('Failed to fetch user data.');
            });
    }, []);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lng, lat], // Initial map center
            zoom: zoom, // Initial zoom level
        });

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
        });

        // Add the geocoder to the map
        map.current.addControl(geocoder);

        if (geocoderContainer.current) {
            geocoderContainer.current.appendChild(geocoder.onAdd(map.current));
        }

        geocoder.on('result', (e) => {
            const coords = e.result.geometry.coordinates;
            setLongitude(coords[0]);
            setLatitude(coords[1]);
            setLocation(e.result.place_name);
            // saveGeocodingResult(coords[0], coords[1]);
            
        });
    }, [lng, lat, zoom]);

    // const saveGeocodingResult = (longitude, latitude) => {
    //     console.log('Geocoding Result:', { longitude, latitude });
    // }


    const handleAddTrip = (event) => {
       event.preventDefault()
        
        if (!userId) {
            setErrorMessage('User not logged in.');
            return;
        }
        

        // console.log("Sending data:", { trip_name, longitude, latitude, start_date, end_date, user_id });

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch("/api/trip", {
            method: "POST",
            body: JSON.stringify({ trip_name: tripName,
              longitude,
              latitude,
              location,
              start_date: startDate,
              end_date: endDate,
              user_id: userId}),
            headers: myHeaders,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.status !== "ok") {
                console.log(responseJson.results);
                setErrorMessage(responseJson.message); 
                // Option 1 -- pick which trip details we want to include in tripDetails
                // setTripDetails({
                //     startDate: new Date(responseJson.start_date).toDateString(),
                //     endDate: new Date(responseJson.end_date).toDateString(),
                //     tripName: responseJson.trip_name,
                // })

                // Option 2 -- set tripDetails to the entire responseJson object
                setTripDetails(responseJson.results)
                setLocation('')
                setStartDate('')
                setEndDate('')
                // setTripStartDate(new Date(responseJson.start_date).toDateString())
                // setTripEndDate(responseJson.end_date)
            } else {
              //     {
              //     setTripID(responseJson.tripID)
              //     setTripName(responseJson.trip_name),
              //     setStartDate(responseJson.start_date),
              //     setEndDate (responseJson.end_date),
              //     setLongitude (responseJson.longitude),
              //     setLatitude (responseJson.latitude),
              //     setUserId (responseJson.user_id)
              // };
              
              // Update the trips state with the newly created trip
              setTrips([...trips, newTrip]);
                 // Clear the form fields
              // setTripName('');
              // setStartDate('');
              // setEndDate('');
              // setLongitude('');
              // setLatitude('');
              // setTrips([...trips, responseJson.trip]);


              // Navigate to the details page of the new trip
              navigate(`/tripdetails/${responseJson.trip_id}`);
          }
  })
        .catch((error) => {
            console.error('Error:', error);
            setErrorMessage('Failed to add trip.');
        });
    };

    // const updateTripName = (event) => {
    //     setTripName(event.target.value);
    // };

    // const updateStartDate = (event) => {
    //     setStartDate(event.target.value);
    // };

    // const updateEndDate = (event) => {
    //     setEndDate(event.target.value);
    // };
    console.log('tripDetails state', tripDetails)
    return (
      <div>
        <div className="sidebar">
            
            <p>Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</p>
        </div>
        <div className='your-trip'>Your trip awaits...</div>
        <div class="things">
  <div class="content">
    <div class="arrow">
      <div class="curve"></div>
      <div class="point"></div>
    </div>
  </div> 
  <div class="content">
    
  </div>
</div>
        <div className="map-container" ref={mapContainer} />
        <div className="form-box-trip-form">
              <form className="trip-box" onSubmit={handleAddTrip}>
                  <h1 className="add-trip">Add a Trip</h1>

                  <input
                      className="trip-name"
                      type="text"
                      placeholder="Trip Name"
                      value={tripName}
                      
                      onChange={(e) => setTripName(e.target.value)}
                      required
                  />
                  
                  <input
                      
                      className="start-date"
                      type="date"
                      placeholder="Start Date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                  />
                  <input
                      className="end-date"
                      type="date"
                      placeholder="End Date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                  />
                  <button type="submit">Add Trip</button>
              </form>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {/* {tripDetails.length > 0 && tripDetails.map((trip, i) => (
                <div className={`trip-result-${i}`}>
                    <p>{trip.trip_name && trip.trip_name}</p>
                    <p>{trip.start_date && new Date(trip.start_date).toDateString()}</p>
                    <p>{trip.end_date && new Date(trip.end_date).toDateString()}</p>
                </div>
              ))} */}
          </div>
          
          <div className='upcoming-trips'>Upcoming Trips</div>
          <div className="trip-card">
                {tripDetails.length > 0 && tripDetails.map((trip, i) => (
                  <TripCard key={i} trip={trip} />
              ))}
          </div>
      </div>
  );
};



export default MyMap;
 