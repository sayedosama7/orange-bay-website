import React from "react";
import Slider from "./slider";
import SearchBar from "./searchbar";
import Welcome from "./welcome";
import Popular from "./popular";
import Program from "./program";
import Explore from "./explore";
import Membership from "./membership";
import Activities from "./activities";
import RelatedTripsComponent from "./related";
import Sponsors from "./sponsers";
export default function Home() {
  return (
    <div>
      <Slider />
      <SearchBar />
      <div className="container">
        <Welcome />
        <Popular />
      </div>
      <Program />
      <br /> <br /> <br /> <br /> <br />
      <Explore />
      <Membership />
      <Activities />
      <RelatedTripsComponent />
      <Sponsors />
    </div>
  );
}
