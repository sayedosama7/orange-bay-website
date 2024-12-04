import { useEffect, useState } from 'react';
import '../../css/reservation/sucess.css';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import axios from 'axios';
import { Loading } from '../Loading/Loading';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
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
                    <p>
                        <strong className="main-color">Booking ID:</strong> {bookDetails.bookingId}
                    </p>
                    <p>
                        <strong className="main-color">Ticket Name :</strong>{' '}
                        {bookDetails.ticketName}
                    </p>
                    <p>
                        <strong className="main-color">user type :</strong> {bookDetails.role}
                    </p>
                    <p>
                        <strong className="main-color">Number of Adults:</strong>{' '}
                        {bookDetails.numberOfAdults}
                    </p>
                    <p>
                        <strong className="main-color">Number of Children:</strong>{' '}
                        {bookDetails.numberOfChilds}
                    </p>
                    <p>
                        <strong className="main-color">Total Price:</strong>{' '}
                        {bookDetails.totalPrice} EGP
                    </p>
                    <p>
                        <strong className="main-color">Total Additional Price:</strong>{' '}
                        {bookDetails.totalAddtionalPrice} EGP
                    </p>

                    {bookingItems.map((item, index) => {
                        const {
                            price,
                            name,
                            seriamNumber,
                            email,
                            phoneNumber,
                            bookDate,
                            services,
                            createdOn,
                        } = item;

                        return (
                            <div key={index} className="card mb-4">
                                <div className="card-body">
                                    <p>
                                        <strong className="main-color">Booking ID:</strong>{' '}
                                        {bookDetails.bookingId}
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
                                        <strong className="main-color">Booking On:</strong>{' '}
                                        {formatDate(createdOn)}
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

                                    {price > 0 && (
                                        <p>
                                            <strong className="main-color">
                                                Total Services Price:
                                            </strong>{' '}
                                            {price} EGP
                                        </p>
                                    )}
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

            <Dialog open={showModal} onClose={closeModal} fullWidth>
                <DialogContent style={{ textAlign: 'center' }}>
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
                            `Booking ID: ${bookDetails.bookingId}`,
                            `Trip name: ${title}`,
                            `Name: ${name}`,
                            email ? `Email: ${email}` : '',
                            phoneNumber ? `Phone Number: ${phoneNumber}` : '',
                            `Serial Number: ${seriamNumber}`,
                            `Booking on: ${formatDate(currentDate)}`,
                            `Booking Date: ${formatDate(bookDate)}`,
                            services.length
                                ? `Services: ${services.map(service => service.name).join(', ')}`
                                : 'Services: No services',
                            price > 0 ? `Total Services Price: ${price} EGP` : '',
                        ]
                            .filter(line => line.trim() !== '')
                            .join('\n');

                        return (
                            <div
                                key={index}
                                className="qr-box"
                                style={{
                                    marginBottom: '20px',
                                    border: '1px solid black',
                                    padding: '20px',
                                }}
                            >
                                <QRCode value={qrData} className="qr-size" size={200} />
                                <p>
                                    <strong className="main-color">Booking ID:</strong>{' '}
                                    {bookDetails.bookingId}
                                </p>
                                <p>
                                    <strong className="main-color">Trip Name:</strong> {title}
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
                                {price > 0 && (
                                    <p>
                                        <strong className="main-color">
                                            Total Services Price:
                                        </strong>{' '}
                                        {price} EGP
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} className="btn-main">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Success;
