import React from "react";
import { BsPeople, BsCalendar, BsGlobe } from "react-icons/bs";
import "../../css/Searchbar.css";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <div className="search-bar-overlay"></div>
      <div className="search-bar-item s1">
        <BsPeople className="search-icon" />
        <select className="search-input" defaultValue="" required>
          <option value="" disabled hidden>
            Number of people
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <div className="search-bar-item s2">
        <BsCalendar className="search-icon" />
        <input
          type="date"
          className="search-input"
          placeholder="pick your Date"
        />
      </div>
      <div className="search-bar-item">
        <BsGlobe className="search-icon" />
        <select className="search-input" defaultValue="" required>
          <option value="" disabled hidden>
            Nationality
          </option>
          <option value="egypt">Egypt</option>
          <option value="usa">USA</option>
          <option value="uk">UK</option>
          {/* Add more countries as options */}
        </select>
      </div>
      <button className="search-button">Search</button>
    </div>
  );
};
export default SearchBar;
