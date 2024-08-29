import React, { useState } from 'react';

const YelpSearch = ({ results, activeTab, fetchYelpData, addToItinerary}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm) {
      fetchYelpData(searchTerm,activeTab);
    }
  };


  return (
    <div>
      <div className='ylp'>
        <div className='search-box'>
          <input
            type="text"
            placeholder="Search "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className='search-button' onClick={handleSearch}>Search</button>
      </div>
      
      <div className="yelp-results-wrapper">
        <div className="yelp-results">
          {results.length > 0 && results.map((result) => (
            <div key={result.id} className="yelp-result card">
              <div className="image-content">
                <div className="overlay"></div>
                <div className="card-image">
                  <img src={result.image_url} alt={result.name} className="card-img" />
                </div>
              </div>
              <div className="card-content">
                <h3 className="name">{result.name}</h3>
                <p className="description">Rating: {result.rating}</p>
                <p className="description">{result.location.address1}, {result.location.city}</p>
                <p className="description">Phone: {result.phone}</p>
                <button className="button add-to-iti" onClick={() => addToItinerary(result)}>Add to Itinerary</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YelpSearch;
