import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../css/reservation/overview.css';
import axios from 'axios';
import { baseURL, IMG_URL, TICKETS } from '../Api/Api';
import { jwtDecode } from 'jwt-decode';
import { Loading } from '../Loading/Loading';
import '../../css/reservation/navbook.css';

const Overview = ({ onDataUpdate }) => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sliderRef = React.useRef(null);
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [userType, setUserType] = useState('guest');

    useEffect(() => {
        const token = localStorage.getItem('token');
        let role = 'guest';

        if (token) {
            try {
                const decoded = jwtDecode(token);
                role =
                    decoded[
                        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                    ]?.toLowerCase() || 'guest';
                setUserType(role);
            } catch (error) {
                console.error('Error decoding token:', error);
                setUserType('guest');
            }
        } else {
            setUserType('guest');
        }
    }, []);

    // Fetch ticket details
    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${baseURL}/${TICKETS}/GetById?id=${id}`);
                const ticketData = response.data.value;

                const userDetails = ticketData.detailsDto.find(
                    detail => detail.userType.toLowerCase() === userType
                );
                const defaultDetails = ticketData.detailsDto[0];
                const selectedDetails = userDetails || defaultDetails;

                setTicket(ticketData);

                if (onDataUpdate) {
                    onDataUpdate({
                        id: ticketData.id,
                        ticketImg: ticketData.images[0],
                        title: ticketData.title,
                        adultPrice: selectedDetails.adultPrice,
                        childPrice: selectedDetails.childPrice,
                    });
                }

                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError('Error fetching ticket details. Please try again later.');
                console.error('Error fetching ticket details:', error);
            }
        };
        fetchTicketDetails();
    }, [id, onDataUpdate, userType]);

    const goToSlide = index => {
        sliderRef.current.slickGoTo(index);
        setCurrentSlide(index);
    };

    const settings = {
        dots: ticket?.images?.length > 1,
        infinite: ticket?.images?.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        customPaging: i => (
            <CustomPagination
                goToSlide={goToSlide}
                currentSlide={i}
                slideCount={ticket?.images?.length || 0}
            />
        ),
    };

    const CustomPagination = ({ currentSlide, slideCount, goToSlide }) => (
        <ul className="custom-dots">
            {Array.from({ length: slideCount }).map((_, index) => (
                <li
                    key={index}
                    className={index === currentSlide ? 'active' : ''}
                    onClick={() => goToSlide(index)}
                >
                    <div className={`circle ${index === currentSlide ? 'active' : ''}`}>
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
            {loading && <Loading />}

            <div>
                <h2 className="main-color">{ticket.title}</h2>
                <p className="fw-bold text-secondary mb-3">{ticket.description}</p>

                <Slider {...settings} ref={sliderRef}>
                    {ticket.images && ticket.images.length > 0 ? (
                        ticket.images.map((image, index) => (
                            <div key={index}>
                                <img
                                    className="overimg"
                                    src={`${IMG_URL}${image}`}
                                    alt={ticket.title}
                                />
                            </div>
                        ))
                    ) : (
                        <div>
                            <img
                                className="overimg"
                                src={`${IMG_URL}${ticket.image}`}
                                alt={ticket.title}
                            />
                        </div>
                    )}
                </Slider>

                <div className="slider-pagination mt-5">
                    {ticket?.images?.length > 1 && (
                        <CustomPagination
                            goToSlide={goToSlide}
                            currentSlide={currentSlide}
                            slideCount={ticket?.images?.length || 0}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overview;
