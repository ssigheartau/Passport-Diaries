import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import YelpSearch from './YelpSearch';
import './TripDetails.css';
import Navbar from "../Navbar /Navbar"; 

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [yelpResults, setYelpResults] = useState([]);
  const [activeTab, setActiveTab] = useState('activities'); 
  const [itinerary, setItinerary] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityToAdd, setActivityToAdd] = useState(null);
  const [dayCards, setDayCards] = useState([]);

  
  useEffect(() => {
    fetch(`/api/trip/${tripId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          setTrip(data.trip);
          console.log("Trip data:", data.trip); 
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
    if (trip) {
      // Calculate number of days based on trip start and end dates
      const startDate = new Date(trip.start_date);
      const endDate = new Date(trip.end_date);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      // Calculate the total number of days in the trip, inclusive of both start and end dates
      const numberOfDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 ;

      const initialDayCards = Array.from({ length: numberOfDays }, (_, i) => {
        const dayDate = new Date(startDate.getTime());  
        dayDate.setDate(startDate.getDate() + i + 1 );  
        return {
          date: dayDate,  
          activities: []  
        };
      });

      setDayCards(initialDayCards);  

      // Fetch activities
      fetch('/api/get_activities')
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'ok') {
            setItinerary(data.activities);
          } else {
            console.error("Error fetching activities:", data.message);
          }
        });

      // Fetch itinerary
      fetch(`/api/get_itinerary/${tripId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched itinerary data:', data);

          if (data.status === 'ok') {
            const savedDayCards = [...initialDayCards];

            data.itinerary.forEach((item) => {
              
                const dayIndex = dayCards.findIndex((day) => day.date.toISOString().split('T')[0] === item.date);  
              
              console.log(`Mapping activity "${item.name}" to day index: ${dayIndex}`);

              if (savedDayCards[dayIndex]) {
                savedDayCards[dayIndex].activities.push({
                  name: item.name,
                  time: item.time,
                  details: item.details,
                });
              }
            });

            setDayCards(savedDayCards);
            console.log("Updated dayCards:", savedDayCards);

          } else {
            console.error("Error fetching itinerary:", data.message);
          }
        })
        .catch((error) => {
          console.error('Error fetching itinerary:', error);
        });
    }
  }, [trip]); 

  
  const openModal = (activity) => {
    setActivityToAdd(activity);
    setIsModalOpen(true);
  };

  const addActivityToDayCard = () => {
    if (!activityToAdd) {
      alert("Please select an activity.");
      return;
    }

    const newActivity = {
      ...activityToAdd,
      time: selectedTime,
    };

    fetch('/api/add_itinerary_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trip_id: trip.trip_id,
        name: newActivity.name,
        date: dayCards[selectedDay].date.toISOString().split('T')[0], 
        time: selectedTime,
        details: newActivity.details,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'ok') {
        setDayCards(prevCards => 
          prevCards.map((day, index) => {
            if (index === selectedDay) {
              return {
                ...day,
                activities: [...day.activities, newActivity],
              };
            }
            return day;
          })
        );

        setIsModalOpen(false);
        setActivityToAdd(null);
        setSelectedTime('');
      } else {
        console.error("Error adding activity to day card:", data.message);
      }
    })
    .catch((error) => {
      console.error('Error adding activity to day card:', error);
    });
  };

  // Map rendering logic
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
        center: [trip.longitude, trip.latitude],
        zoom: 9,
      });

      marker.current = new mapboxgl.Marker()
        .setLngLat([trip.longitude, trip.latitude])
        .addTo(map.current);
    }
  }, [trip]);

  const fetchYelpData = (term, type) => {
    const body = JSON.stringify({
      term: term || '',
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
          setActiveTab('activities');  
        } else {
          setErrorMessage(data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching Yelp data:', error);
        setErrorMessage('Failed to fetch Yelp data.');
      });
  };

  const addToItinerary = (activity) => {
    fetch('/api/add_activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: activity.name,
        details: activity.details,
        trip_id: trip.trip_id,
        location: activity.location,  
        rating: activity.rating        
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'ok') {
        setItinerary([...itinerary, activity]);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      } else {
        console.error("Error adding activity to itinerary:", data.message);
      }
    });
  };

  if (!trip) {
    return <div>{errorMessage ? errorMessage : 'Loading...'}</div>;
  }

  const startDate = new Date(trip.start_date);

  return (
    <div>
      <Navbar/>
      <h1 className='t-name'>{trip.trip_name}</h1> 
      <h2 className='trip-location'>{trip.location} </h2>
      
      <div className="map-container" ref={mapContainer} />
      <div className="tabs">
        <button className={`tab-button ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>
          Search Activities
        </button>
        <button className={`tab-button ${activeTab === 'dayCards' ? 'active' : ''}`} onClick={() => setActiveTab('dayCards')}>
          Itinerary
        </button>
        <button className={`tab-button ${activeTab === 'itinerary' ? 'active' : ''}`} onClick={() => setActiveTab('itinerary')}>
          Activities List
        </button>
      </div>

      {showPopup && (
        <div className="popup">
          Activity added to your itinerary!
        </div>
      )}  

      {activeTab === 'activities' && (
        <div>
          <div className="yelp-controls">
            <button className="activ" onClick={() => fetchYelpData('', 'activities')}>Top Activities</button>
            <button className="res" onClick={() => fetchYelpData('', 'restaurants')}>Top Restaurants</button>
            <YelpSearch results={yelpResults} activeTab={activeTab} fetchYelpData={fetchYelpData} addToItinerary={addToItinerary} />
          </div>
        </div>
      )}

      {activeTab === 'dayCards' && (
        <div className="day-cards-container">
          {dayCards.map((day, i) => {
            const formattedDate = day.date ? day.date.toLocaleDateString() : 'Invalid date';

            return (
              <div key={i} className="day-card itinerary-card">
                <h3 className="day-card-date">{formattedDate}</h3>
                <div className="activities">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="activity">
                      <p><span className="activity-time">{activity.time}</span> - {activity.name}</p>
                      {activity.details && (
                        <p><span className="details-label">Details:</span> {activity.details}</p>
                      )}
                    </div>
                  ))}
                </div>
                <button className="add-activity-btn" onClick={() => openModal({ name: '', details: '' })}>Add Your Own Activity</button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'itinerary' && (
        <div className="itinerary-container">
          <h2>List of Activities</h2>
          {itinerary.length > 0 ? (
            <div className="itinerary-slider">
              {itinerary.map((item, index) => (
                <div key={index} className="itinerary-item card">
                  <h3>{item.name}</h3>
                  <p>{item.location?.address1 || 'No address available'} {item.location?.city || ''} {item.location?.state || ''} {item.location?.zip_code || ''}</p>
                  <p>Rating: {item.rating ? item.rating : 'No rating available'}</p>
                  <button className="add-to-day-btn" onClick={() => openModal(item)}>Add to Day</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No activities added to your itinerary.</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <h2>{activityToAdd.name ? `Add "${activityToAdd.name}" to Day` : "Add Your Own Activity"}</h2>
            
          <p>Activity Name:</p>
          <input 
            type="text" 
            value={activityToAdd.name} 
            onChange={(e) => setActivityToAdd({...activityToAdd, name: e.target.value})} 
          />
          <p>Details:</p>
          <textarea 
            value={activityToAdd.details} 
            onChange={(e) => setActivityToAdd({...activityToAdd, details: e.target.value})} 
          />
          
          <p>Select Time: 
            <input 
              type="time" 
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)} 
            />
          </p>
          <p>Select Day:</p>
          <select onChange={(e) => setSelectedDay(parseInt(e.target.value, 10))}>
            {dayCards.map((_, index) => {
              const date = new Date(startDate);
              date.setDate(startDate.getDate() + index + 1 );
              return <option key={index} value={index}>{date.toLocaleDateString()}</option>;
            })}
          </select>
          <button onClick={addActivityToDayCard}>Add to Day</button>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default TripDetails;
