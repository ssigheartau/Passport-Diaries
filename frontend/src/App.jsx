import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from "mapbox-gl";
import './App.css'
import LoginRegister from './Components/LoginRegister';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;




function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });
  
 
    return (
      <div>
        <LoginRegister />
      
      <div className="App">
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container" />
      </div>
      </div>
    );
  }


export default App
