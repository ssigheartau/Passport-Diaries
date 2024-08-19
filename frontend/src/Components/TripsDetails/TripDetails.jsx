import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import YelpSearch from './YelpSearch'; // Import the YelpSearch component

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [yelpResults, setYelpResults] = useState([]);
  const [activeTab, setActiveTab] = useState('activities'); // Track which tab is active

  useEffect(() => {
    fetch(`/api/trip/${tripId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          setTrip(data.trip);
        } else {
          setErrorMessage(data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching trip details:', error);
        setErrorMessage('Failed to fetch trip details.');
      });
  }, [tripId]);

  useEffect(() => {
    if (!trip) return;

    if (map.current) {
      map.current.flyTo({
        center: [trip.longitude, trip.latitude],
        zoom: 9
      });

      if (marker.current) {
        marker.current.setLngLat([trip.longitude, trip.latitude]);
      } else {
        marker.current = new mapboxgl.Marker()
          .setLngLat([trip.longitude, trip.latitude])
          .addTo(map.current);
      }
    } else {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [trip.longitude, trip.latitude], // Initial map center
        zoom: 9, // Initial zoom level
      });

      marker.current = new mapboxgl.Marker()
        .setLngLat([trip.longitude, trip.latitude])
        .addTo(map.current);
    }
  }, [trip]);

  const fetchYelpData = (type) => {
    const body = JSON.stringify({
      term: '', // empty term to fetch top-rated in the category
      latitude: trip.latitude,
      longitude: trip.longitude,
      type: type,
    });

    fetch('/api/yelp_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body,
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'ok') {
        setYelpResults(data.results);
        setActiveTab(type);
      } else {
        setErrorMessage(data.message);
      }
    })
    .catch((error) => {
      console.error('Error fetching Yelp data:', error);
      setErrorMessage('Failed to fetch Yelp data.');
    });
  };

  if (!trip) {
    return <div>{errorMessage ? errorMessage : 'Loading...'}</div>;
  }

  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);
  const numberOfDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div>
      <h1>{trip.trip_name}</h1> 
      <h2>{trip.location} </h2>
      
      <div className="map-container" ref={mapContainer} />
      <div>
        {Array.from({ length: numberOfDays }, (_, i) => (
          <div key={i} className="day-card">
            <h3>Day {i + 1}</h3>
          </div>
        ))}
        <div className="yelp-controls">
          <button onClick={() => fetchYelpData('activities')}>Top Activities</button>
          <button onClick={() => fetchYelpData('restaurants')}>Top Restaurants</button>
          <YelpSearch results={yelpResults} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
