import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/reservation/overview.css";
import axios from "axios";
import { baseURL, TICKETS } from "../Api/Api";

const Overview = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ
  const sliderRef = React.useRef(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slideCount = 5;

  // Fetch ticket details
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true); // بدأ التحميل
        setError(null); // إعادة تعيين الأخطاء
        const response = await axios.get(`${baseURL}/${TICKETS}/${id}`);
        setTicket(response.data);
        setLoading(false); // انتهى التحميل
      } catch (error) {
        setLoading(false); // انتهى التحميل رغم وجود الخطأ
        setError("Error fetching ticket details. Please try again later.");
        console.error("Error fetching ticket details:", error);
      }
    };
    fetchTicketDetails();
  }, [id]);

  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
    setCurrentSlide(index);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: (i) => (
      <CustomPagination goToSlide={goToSlide} currentSlide={i} slideCount={5} />
    ),
  };

  const CustomPagination = ({ currentSlide, slideCount, goToSlide }) => (
    <ul className="custom-dots">
      {Array.from({ length: slideCount }).map((_, index) => (
        <li
          key={index}
          className={index === currentSlide ? "active" : ""}
          onClick={() => goToSlide(index)}
        >
          <div className={`circle ${index === currentSlide ? "active" : ""}`}>
            {index + 1}
          </div>
        </li>
      ))}
    </ul>
  );

  if (loading) return <div>Loading ticket details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{ticket.title}</h2>
      <Slider {...settings} ref={sliderRef}>
        <div>
          <img src={ticket.image} className="overimg" alt={ticket.title} />
        </div>
      </Slider>
      <br />
      <p>{ticket.description}</p>
      <div className="slider-pagination">
        <CustomPagination
          goToSlide={goToSlide}
          currentSlide={currentSlide}
          slideCount={slideCount}
        />
      </div>
    </div>
  );
};

export default Overview;
