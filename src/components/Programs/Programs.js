import React, { useEffect, useState } from 'react';
import MySlider from '../homepage/slider';
import { Loading } from '../Loading/Loading';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { baseURL, IMG_URL, TICKETS } from '../Api/Api';
import { Link } from 'react-router-dom';

const Programs = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState('guest');

    const checkUserType = () => {
        const token = localStorage.getItem('token');
        let role = '';

        if (token) {
            try {
                const decoded = jwtDecode(token);
                role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                setUserType(role || 'guest');
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            setUserType('guest');
        }
    };

    // Fetch tickets
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/${TICKETS}`, {
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserType();
        fetchData();
    }, []);

    return (
        <>
            {loading && <Loading />}
            <div className="program">
                <MySlider />
                <div className="container mt-5">
                    <div className="row">
                        {data.length > 0 ? (
                            data.map(ticket => {
                                const userDetails = ticket.detailsDto.find(detail => detail.userType === userType);

                                const defaultDetails = ticket.detailsDto[0];

                                const selectedDetails = userDetails || defaultDetails;

                                return (
                                    <div className="col-md-6 col-lg-4 mb-5 px-3 ticket" key={ticket.id}>
                                        <Link to={`/details/${ticket.id}`}>
                                            <div className="card ticket-card h-100 position-relative">
                                                <img
                                                    className="img-fluid"
                                                    style={{
                                                        height: "300px",
                                                        objectFit: "cover",
                                                    }}
                                                    src={`${IMG_URL}${ticket.images[0]}`}
                                                    alt="tickets"
                                                />
                                                <div className="position-absolute ticket-price">
                                                    <p className="m-0">
                                                        Adult: {selectedDetails.adultPrice}
                                                    </p>
                                                    <p className="m-0">
                                                        Child: {selectedDetails.childPrice}
                                                    </p>
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title">{ticket.title}</h5>
                                                    <p className="card-text text-primary">{ticket.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })
                        ) : (
                            <h5 className='text-center'>No Programs Found</h5>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Programs;
