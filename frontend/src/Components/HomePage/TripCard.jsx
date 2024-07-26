import { useNavigate } from "react-router-dom";

const TripCard = ({ trip }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/tripdetails/${trip.trip_id}`);
    };

    return (
        <div className="trip-card" onClick={handleClick}>
            <h3>{trip.trip_name}</h3>
            <p>{trip.start_date} - {trip.end_date}</p>
        </div>
    );
};

export default TripCard;
