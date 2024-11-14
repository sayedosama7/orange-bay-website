import React, { useState } from 'react';
import "../../css/dining/resturants.css";

const ImageGallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const images = [
    { id: 1, type: 'Restaurants', src: 'resturant1.png' },
    { id: 2, type: 'Restaurants', src: 'resturant2.png' },
    { id: 3, type: 'Restaurants', src: 'resturant3.png' },
    { id: 4, type: 'Restaurants', src: 'resturant4.png' },
    { id: 5, type: 'Bars', src: 'bar1.png' },
    { id: 6, type: 'Bars', src: 'bar2.png' },
  ];

  const filteredImages =
    activeFilter === 'All' ? images : images.filter((image) => image.type === activeFilter);

  return (
    <div className="image-gallery">
      <div className="filter-bar">
        <button
          className={`filter-button ${activeFilter === 'All' ? 'active' : ''}`}
          onClick={() => handleFilterClick('All')}
        >
          All
        </button>
        <button
          className={`filter-button ${activeFilter === 'Restaurants' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Restaurants')}
        >
          Restaurants
        </button>
        <button
          className={`filter-button ${activeFilter === 'Bars' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Bars')}
        >
          Bars
        </button>
        <button
          className={`filter-button ${activeFilter === 'Lounges' ? 'active' : ''}`}
          onClick={() => handleFilterClick('Lounges')}
        >
          Lounges
        </button>
      </div>
      <div className="image-grid">
        {filteredImages.map((image) => (
          <img key={image.id} src={image.src} alt={image.type} className="image-item" />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
