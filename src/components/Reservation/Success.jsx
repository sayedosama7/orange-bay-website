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
import DialogTitle from '@mui/material/DialogTitle';
const Success = () => {
    const [bookDetails, setBookDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [openDialogDetails, setOpenDialogDetails] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            const token = localStorage.getItem('token');
            const responseMessage = localStorage.getItem('bookingResponse');

            const match = responseMessage?.match(/id (\d+)/);
            const id = match ? match[1] : null;
            setBookingId(id);
            if (!id) {
                setError('No booking ID found.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`http://elgzeraapp.runasp.net/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data) {
                    setBookDetails(response.data);
                    console.log('Booking with ID:', response.data);
                } else {
                    setError('Failed to fetch booking details.');
                }
            } catch (err) {
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, []);

    useEffect(() => {
        const preventBackNavigation = () => {
            navigate('/program', { replace: true });
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', preventBackNavigation);

        return () => {
            window.removeEventListener('popstate', preventBackNavigation);
        };
    }, [navigate]);

    if (loading)
        return (
            <div>
                <Loading />
            </div>
        );
    if (error) return <p>Error: {error}</p>;
    if (!bookDetails) return <p>No booking details found.</p>;

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
        localStorage.removeItem('booking');
        localStorage.removeItem('cart');
        navigate('/program', { replace: true });
    };

    const handlePrintQR = () => {
        localStorage.removeItem('bookingResponse');
        localStorage.removeItem('booking');
        localStorage.removeItem('cart');
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);
    const type = {
        1: 'adult',
        2: 'child',
    };

    const handleOpenDialogDetails = detail => {
        setSelectedBooking(detail);
        setOpenDialogDetails(true);
    };

    const handleCloseDialogDetails = () => {
        setOpenDialogDetails(false);
        setSelectedBooking(null);
    };

    return (
        <div className="container text-capitalize mt-5 text-center">
            <div className="row">
                <h1 className="success-title text-center mb-4 pt-2">Booking Confirmed! 🎉</h1>
                {bookDetails?.map((booking, bookingIndex) => {
                    return booking.serialNumbers && booking.serialNumbers.length > 0 ? (
                        booking.serialNumbers.map((detail, index) => (
                            <div className="col-md-4" key={index}>
                                <div
                                    className="card"
                                    style={{
                                        marginBottom: '10px',
                                        padding: '10px',
                                    }}
                                >
                                    <div className="card-body">
                                        <p>
                                            <strong className="main-color">Booking Id : </strong>{' '}
                                            {bookingId}
                                        </p>
                                        <p>
                                            <strong className="main-color">Serial Number : </strong>{' '}
                                            {detail.serialNumber}
                                        </p>
                                        <p>
                                            <strong className="main-color">Ticket Title:</strong>{' '}
                                            {detail.ticketTitle}
                                        </p>

                                        <p>
                                            <strong className="main-color">User Name:</strong>{' '}
                                            {detail.userName}
                                        </p>
                                        <p>
                                            <strong className="main-color">Type : </strong>{' '}
                                            {type[detail.personAge]}
                                        </p>

                                        {/* <div>
                                            <p className="main-color fw-bold">Services:</p>
                                            {detail.addtionalServiceResponses &&
                                            detail.addtionalServiceResponses.length > 0 ? (
                                                detail.addtionalServiceResponses.map(
                                                    (service, serviceIndex) => (
                                                        <div key={serviceIndex}>
                                                            <p>
                                                                <strong className="main-color">
                                                                    Service Name:
                                                                </strong>{' '}
                                                                {service.name}
                                                            </p>
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <p>No additional services</p>
                                            )}
                                        </div> */}

                                        <div>
                                            <p className="main-color fw-bold">Services:</p>
                                            {detail.addtionalServiceResponses &&
                                            detail.addtionalServiceResponses.length > 0 ? (
                                                detail.addtionalServiceResponses.map(
                                                    (service, serviceIndex) => (
                                                        <div key={serviceIndex}>
                                                            <p>
                                                                <strong className="main-color">
                                                                    Service Name:
                                                                </strong>{' '}
                                                                {service.name}
                                                            </p>
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <p>No additional services</p>
                                            )}
                                        </div>

                                        <p>
                                            <strong className="main-color">Price:</strong>{' '}
                                            {detail.price} $
                                        </p>

                                        <button
                                            onClick={() => handleOpenDialogDetails(detail)}
                                            className="btn btn-main btn-sm"
                                        >
                                            details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p key={bookingIndex}>No Data Found.</p>
                    );
                })}

                <div className="row">
                    <div className="col-md-6 m-auto mt-3 d-flex justify-content-between">
                        <button onClick={handleHome} className="btn btn-primary m-1">
                            Back Home
                        </button>
                        <button onClick={handlePrintQR} className="btn btn-primary m-1">
                            Print QR Code
                        </button>
                    </div>
                </div>

                {/* Dialog for full details */}
                <Dialog
                    open={openDialogDetails}
                    onClose={handleCloseDialogDetails}
                    fullWidth
                    className="text-center"
                >
                    <DialogTitle>Full Booking Details</DialogTitle>
                    <DialogContent>
                        {selectedBooking && (
                            <>
                                <p>
                                    <strong className="main-color">Serial Number:</strong>{' '}
                                    {selectedBooking.serialNumber}
                                </p>
                                <p>
                                    <strong className="main-color">Ticket Title:</strong>{' '}
                                    {selectedBooking.ticketTitle}
                                </p>
                                <p>
                                    <strong className="main-color">User Name:</strong>{' '}
                                    {selectedBooking.userName}
                                </p>
                                <p>
                                    <strong className="main-color">Type:</strong>{' '}
                                    {type[selectedBooking.personAge]}
                                </p>
                                <p>
                                    <strong className="main-color">Created At:</strong>{' '}
                                    {new Date(selectedBooking.createdAt).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong className="main-color">Booking Date:</strong>{' '}
                                    {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong className="main-color">Harbour Name:</strong>{' '}
                                    {selectedBooking.harbourName}
                                </p>
                                <p>
                                    <strong className="main-color">Cruise Name:</strong>{' '}
                                    {selectedBooking.cruiseName}
                                </p>
                                <p>
                                    <strong className="main-color">Tour Guide:</strong>{' '}
                                    {selectedBooking.tourGuide}
                                </p>
                                <p>
                                    <strong className="main-color">Nationality:</strong>{' '}
                                    {selectedBooking.nationality}
                                </p>

                                <div>
                                    <hr />
                                    <p className="main-color fw-bold">Services:</p>
                                    <hr />
                                    {selectedBooking.addtionalServiceResponses &&
                                    selectedBooking.addtionalServiceResponses.length > 0 ? (
                                        selectedBooking.addtionalServiceResponses.map(
                                            (service, serviceIndex) => (
                                                <div key={serviceIndex}>
                                                    <p>
                                                        <strong className="main-color">
                                                            Service Name:
                                                        </strong>{' '}
                                                        {service.name}
                                                    </p>
                                                    <p>
                                                        <strong className="main-color">
                                                            Service Price:
                                                        </strong>{' '}
                                                        {service.price} $
                                                    </p>
                                                    <hr />
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p>No additional services</p>
                                    )}
                                </div>

                                <h5>
                                    <strong className="main-color">Total Price:</strong>{' '}
                                    {selectedBooking.price} $
                                </h5>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialogDetails} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* qr code dialog  */}
                <Dialog open={showModal} onClose={closeModal} fullWidth>
                    <DialogContent style={{ textAlign: 'center' }}>
                        {bookDetails.map((booking, bookingIndex) => {
                            return (
                                <div key={bookingIndex}>
                                    {booking.serialNumbers.map((item, index) => {
                                        const {
                                            ticketTitle,
                                            personAge,
                                            serialNumber,
                                            userName,
                                            createdAt,
                                            bookingDate,
                                            harbourName,
                                            cruiseName,
                                            tourGuide,
                                            nationality,
                                            addtionalServiceResponses,
                                            price,
                                        } = item;

                                        const qrData = [
                                            `Booking Id: ${bookingId}`,
                                            `ticket Title: ${ticketTitle}`,
                                            `Serial Number: ${serialNumber}`,
                                            `User Name: ${userName}`,
                                            `Booking on: ${formatDate(createdAt)}`,
                                            `Booking Date: ${formatDate(bookingDate)}`,
                                            `Type: ${type[personAge]}`,
                                            `Harbour Name: ${harbourName}`,
                                            `Cruise Name: ${cruiseName}`,
                                            `Tour Guide Name: ${tourGuide}`,
                                            `Nationality: ${nationality}`,

                                            addtionalServiceResponses &&
                                            addtionalServiceResponses.length > 0
                                                ? `Services: ${addtionalServiceResponses
                                                      .map(service => service.name)
                                                      .join(', ')}`
                                                : 'Services: No services',

                                            // price > 0 ? `Total Price: ${price} $` : '',
                                        ]
                                            .filter(line => line.trim() !== '')
                                            .join('\n');

                                        return (
                                            <div
                                                key={index}
                                                className="qr-box"
                                                style={{
                                                    marginBottom: '10px',
                                                    padding: '10px',
                                                    border: '1px solid gray',
                                                }}
                                            >
                                                <QRCode
                                                    value={qrData}
                                                    className="qr-size"
                                                    size={200}
                                                />
                                                <p>
                                                    <strong className="main-color">
                                                        Booking Id :{' '}
                                                    </strong>{' '}
                                                    {bookingId}
                                                </p>
                                                <p>
                                                    <strong className="main-color">
                                                        Serial Number:
                                                    </strong>{' '}
                                                    {serialNumber}
                                                </p>
                                                <p>
                                                    <strong className="main-color">
                                                        Ticket Title:
                                                    </strong>{' '}
                                                    {ticketTitle}
                                                </p>
                                                <p>
                                                    <strong className="main-color">
                                                        User Name:
                                                    </strong>{' '}
                                                    {userName}
                                                </p>
                                                <p>
                                                    <strong className="main-color">
                                                        Booking on:
                                                    </strong>{' '}
                                                    {formatDate(createdAt)}
                                                </p>
                                                <p>
                                                    <strong className="main-color">
                                                        Booking Date:
                                                    </strong>{' '}
                                                    {formatDate(bookingDate)}
                                                </p>
                                                <p>
                                                    <strong className="main-color">Type:</strong>{' '}
                                                    {type[personAge]}
                                                </p>
                                                <p>
                                                    <strong className="main-color">
                                                        Cruise Name:
                                                    </strong>{' '}
                                                    {cruiseName}
                                                </p>
                                                <p>
                                                    <strong className="main-color">
                                                        Harbour Name:
                                                    </strong>{' '}
                                                    {harbourName}
                                                </p>
                                                <p>
                                                    <strong className="main-color">
                                                        Nationality:
                                                    </strong>{' '}
                                                    {nationality}
                                                </p>
                                                <p>
                                                    <strong className="main-color">
                                                        Tour Guide Name:
                                                    </strong>{' '}
                                                    {tourGuide}
                                                </p>

                                                <div>
                                                    <p className="main-color fw-bold">Services:</p>
                                                    {addtionalServiceResponses &&
                                                    addtionalServiceResponses.length > 0 ? (
                                                        addtionalServiceResponses.map(
                                                            (service, serviceIndex) => (
                                                                <div key={serviceIndex}>
                                                                    <p>
                                                                        <strong className="main-color">
                                                                            Service Name:
                                                                        </strong>{' '}
                                                                        {service.name}
                                                                    </p>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <p>No additional services</p>
                                                    )}
                                                </div>

                                                {/* {price > 0 && (
                                                    <p>
                                                        <strong className="main-color">
                                                            Total Price:
                                                        </strong>{' '}
                                                        {price} $
                                                    </p>
                                                )} */}
                                            </div>
                                        );
                                    })}
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
        </div>
    );
};

export default Success;
