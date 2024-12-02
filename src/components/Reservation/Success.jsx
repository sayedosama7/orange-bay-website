import { useEffect, useState } from 'react';
import '../../css/reservation/sucess.css';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import axios from 'axios';
import { Loading } from '../Loading/Loading';

const Success = ({ bookDetail }) => {
    const { currentDate, title } = bookDetail;

    const [bookDetails, setBookDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            const token = localStorage.getItem('token');
            const responseMessage = localStorage.getItem('bookingResponse');

            const match = responseMessage.match(/id (\d+)/);
            const bookingId = match ? match[1] : null;

            if (!bookingId) {
                setError('No booking ID found.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(
                    `http://elgzeraapp.runasp.net/api/Booking/${bookingId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.isSuccess) {
                    setBookDetails(response.data.value);
                    console.log(response.data.value);
                } else {
                    setError('Failed to fetch booking details.');
                }
            } catch (err) {
                setLoading(false);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, []);
    if (loading)
        return (
            <div>
                <Loading />
            </div>
        );
    if (error) return <p>Error: {error}</p>;
    if (!bookDetails) return <p>No booking details found.</p>;

    const { bookingItems = [] } = bookDetails || {};

    const formatDate = date => {
        if (!date || isNaN(new Date(date).getTime())) return 'Invalid date';
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleHome = () => {
        localStorage.removeItem('bookingResponse');
        navigate('/program');
    };

    const handlePrintQR = () => {
        localStorage.removeItem('bookingResponse');
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    return (
        <div className="container text-capitalize mt-5 text-center">
            <div className="row">
                <div className="col-md-6 m-auto">
                    <h1 className="success-title text-center mb-4 pt-2">Booking Confirmed! 🎉</h1>
                    {bookingItems.map((item, index) => {
                        const {
                            price,
                            name,
                            seriamNumber,
                            email,
                            phoneNumber,
                            bookDate,
                            services,
                        } = item;

                        return (
                            <div key={index} className="card mb-4">
                                <div className="card-body">
                                    <p>
                                        <strong className="main-color">Booking ID:</strong>{' '}
                                        {bookDetails.bookingId}
                                    </p>
                                    <p>
                                        <strong className="main-color">trip name:</strong> {title}
                                    </p>
                                    <p>
                                        <strong className="main-color">Serial Number:</strong>{' '}
                                        {seriamNumber}
                                    </p>
                                    <p>
                                        <strong className="main-color">Name:</strong> {name}
                                    </p>
                                    {email && (
                                        <p>
                                            <strong className="main-color">Email:</strong> {email}
                                        </p>
                                    )}
                                    {phoneNumber && (
                                        <p>
                                            <strong className="main-color">Phone Number:</strong>{' '}
                                            {phoneNumber}
                                        </p>
                                    )}
                                    <p>
                                        <strong className="main-color">Booking Date:</strong>{' '}
                                        {formatDate(bookDate)}
                                    </p>
                                    <h5 className="main-color">Services:</h5>
                                    {services.length > 0 ? (
                                        services.map((service, serviceIndex) => (
                                            <div key={serviceIndex}>
                                                <p>{service.name}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No services</p>
                                    )}
                                    <p>
                                        <strong className="main-color">Total Price:</strong> {price}{' '}
                                        EGP
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 m-auto mt-3 d-flex justify-content-between">
                    <button onClick={handleHome} className="btn btn-main">
                        Back Home
                    </button>
                    <button onClick={handlePrintQR} className="btn btn-primary">
                        Print QR Code
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        {bookingItems.map((item, index) => {
                            const {
                                price,
                                name,
                                seriamNumber,
                                email,
                                phoneNumber,
                                bookDate,
                                services,
                            } = item;
                            const qrData = [
                                // `Ticket ${index + 1}:`,
                                `trip name: ${title}`,
                                `Booking ID: ${bookDetails.bookingId}`,
                                `Serial Number: ${seriamNumber}`,
                                `Booking Date: ${formatDate(bookDate)}`,
                                `Booking on: ${formatDate(currentDate)}`,
                                `Name: ${name}`,
                                email ? `Email: ${email}` : '',
                                phoneNumber ? `Phone Number: ${phoneNumber}` : '',
                                services.length
                                    ? `Services: ${services
                                          .map(service => service.name)
                                          .join(', ')}`
                                    : 'Services: No services',
                                `Total Price: ${price} EGP`,
                            ]
                                .filter(line => line.trim() !== '')
                                .join('\n');

                            return (
                                <div key={index} className="card mb-3">
                                    <div className="card-body">
                                        <QRCode className="m-auto mb-3" value={qrData} size={250} />
                                        {/* <p>
                                            <strong className="main-color">
                                                Ticket {index + 1}
                                            </strong>
                                        </p> */}
                                        <p>
                                            <strong className="main-color">Booking ID:</strong>{' '}
                                            {bookDetails.bookingId}
                                        </p>
                                        <p>
                                            <strong className="main-color">trip name:</strong>{' '}
                                            {title}
                                        </p>
                                        <p>
                                            <strong className="main-color">Serial Number:</strong>{' '}
                                            {seriamNumber}
                                        </p>
                                        <p>
                                            <strong className="main-color">Name:</strong> {name}
                                        </p>
                                        {email && (
                                            <p>
                                                <strong className="main-color">Email:</strong>{' '}
                                                {email}
                                            </p>
                                        )}
                                        {phoneNumber && (
                                            <p>
                                                <strong className="main-color">
                                                    Phone Number:
                                                </strong>{' '}
                                                {phoneNumber}
                                            </p>
                                        )}

                                        <p>
                                            <strong className="main-color">Booking on:</strong>{' '}
                                            {formatDate(currentDate)}
                                        </p>

                                        <p>
                                            <strong className="main-color">Booking Date:</strong>{' '}
                                            {formatDate(bookDate)}
                                        </p>
                                        <h5 className="main-color">Services:</h5>
                                        {services.length > 0 ? (
                                            services.map((service, serviceIndex) => (
                                                <div key={serviceIndex}>
                                                    <p>{service.name}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No services</p>
                                        )}
                                        <h5>
                                            <strong className="main-color">Total Price:</strong>{' '}
                                            {price} EGP
                                        </h5>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Success;
