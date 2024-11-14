import React from "react";
import SearchBar from "../homepage/searchbar";
import "../../css/dining/firstdining.css";
import Images from "./images";

export default function FirstGallery() {
  return (
    <div>
      <div className="slider-overrlay"></div>
      <div className="slider-overlayy"></div>
      <div className="slider-text">
        <h1 className="slider-title">Gallery</h1>
        <p className="slider-description">
          Orange Bay hosts a variety of restaurants and bars scattered around
          the island
        </p>
      </div>
      <img src="dining.png" className="dining" alt="" />
      <SearchBar />
      <Images />
    </div>
  );
}
