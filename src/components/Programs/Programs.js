import React, { useEffect, useState } from 'react';
import MySlider from '../homepage/slider';
import { Loading } from '../Loading/Loading';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { baseURL, IMG_URL, TICKETS } from '../Api/Api';
import { Link } from 'react-router-dom';

const Programs = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch tickets
    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let role = '';

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            }

            if (role === 'Admin' || role === 'Employee') {
                const response = await axios.get(`${baseURL}/${TICKETS}`, {
                    headers: {
                        Accept: '*/*',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                setData(response.data);
            } else {
                console.warn('Access denied: Only admins and employees can fetch ticket data.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                            data.map(ticket => (
                                <div className="col-md-6 col-lg-4 mb-4 ticket" key={ticket.id}>
                                    <div className="card h-100 position-relative">
                                        <img
                                            className='img- fluid'
                                            style={{
                                                height: "300px",
                                                objectFit: 'cover',
                                            }}
                                            src={`${IMG_URL}${ticket.image}`}
                                            alt='tickets'
                                        />
                                        <div className='position-absolute ticket-price'>
                                            <p className='m-0'>start with</p>
                                            <p className='m-0'>{ticket.price}</p>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{ticket.title}</h5>
                                            <p className="card-text text-primary">{ticket.description}</p>
                                            <Link to={`/reservation/${ticket.id}`} className="position-absolute">details</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h5 className='text-center'>No Programs Found</h5>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Programs;
