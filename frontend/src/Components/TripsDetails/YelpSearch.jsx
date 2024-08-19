import React, { useState } from 'react';

const YelpSearch = ({ results, activeTab }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    
  };

  return (
    <div>
      
      <input
        type="text"
        placeholder="Search for something specific"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div className="yelp-results">
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result.id} className="yelp-result">
              <h3>{result.name}</h3>
              <p>{result.location.address1}, {result.location.city}</p>
              <p>Rating: {result.rating}</p>
              <button>Add to Itinerary</button>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default YelpSearch;
