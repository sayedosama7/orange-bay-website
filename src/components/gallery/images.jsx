import React, { useState } from "react";
import Pagination from "react-js-pagination";
import "bootstrap/dist/css/bootstrap.min.css";
// import 'react-js-pagination/dist/Pagination.css';
const Images = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activePage, setActivePage] = useState(1);
  const imagesPerPage = 6;
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setActivePage(1);
  };
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };
  const images = [
    { id: 1, type: "panoramic", src: "im1.png" },
    { id: 2, type: "panoramic", src: "im2.png" },
    { id: 3, type: "panoramic", src: "im3.png" },
    { id: 4, type: "panoramic", src: "im4.png" },
    { id: 5, type: "relax", src: "im6.png" },
    { id: 6, type: "relax", src: "im8.png" },
    { id: 7, type: "relax", src: "im9.png" },
    { id: 8, type: "joy", src: "im10.png" },
    { id: 9, type: "joy", src: "im11.png" },
    { id: 11, type: "joy", src: "im12.png" },
    { id: 12, type: "dine", src: "im13.png" },
    { id: 13, type: "dine", src: "im14.png" },
    { id: 14, type: "dine", src: "im15.png" },
    { id: 15, type: "dine", src: "im1.png" },
  ];

  const filteredImages =
    activeFilter === "All"
      ? images
      : images.filter((image) => image.type === activeFilter);

  // Pagination logic
  const totalItemsCount = filteredImages.length;
  // const totalPages = Math.ceil(totalItemsCount / imagesPerPage);
  const startIndex = (activePage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const visibleImages = filteredImages.slice(startIndex, endIndex);
  return (
    <div className="image-gallery">
      <div className="filter-bar">
        <button
          className={`filter-button ${activeFilter === "All" ? "active" : ""}`}
          onClick={() => handleFilterClick("All")}
        >
          All
        </button>
        <button
          className={`filter-button ${
            activeFilter === "panoramic" ? "active" : ""
          }`}
          onClick={() => handleFilterClick("panoramic")}
        >
          Panoramic view
        </button>
        <button
          className={`filter-button ${
            activeFilter === "relax" ? "active" : ""
          }`}
          onClick={() => handleFilterClick("relax")}
        >
          Relax
        </button>
        <button
          className={`filter-button ${activeFilter === "joy" ? "active" : ""}`}
          onClick={() => handleFilterClick("joy")}
        >
          Joy & fun
        </button>
        <button
          className={`filter-button ${activeFilter === "dine" ? "active" : ""}`}
          onClick={() => handleFilterClick("dine")}
        >
          Dine
        </button>
      </div>
      <div className="image-grid">
        {visibleImages.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.type}
            className="image-item-gallery"
          />
        ))}
      </div>
      <Pagination
        activePage={activePage}
        itemsCountPerPage={imagesPerPage}
        totalItemsCount={totalItemsCount}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
        itemclassName="page-item"
        linkclassName="page-link"
        innerclassName="pagination"
      />
    </div>
  );
};

export default Images;
