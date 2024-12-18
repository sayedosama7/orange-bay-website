import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { baseURL, ORDER } from '../Api/Api';
import { Loading } from '../Loading/Loading';
import CardActions from '@mui/material/CardActions';
import Swal from 'sweetalert2';
const UpcomingReservations = () => {
    const [upcomingReservations, setUpcomingReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingItems, setSelectedBookingItems] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    // Fetch reservation
    const fetchData = useCallback(async (id) => {
        if (upcomingReservations.length > 0) {
            return;
        }
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/${ORDER}/GetByUserId`, {
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${token}`
                },
            });

            const upcomingReservations = response.data.value?.upcommingRservations || [];
            const bookId = response.data.value?.upcommingRservations[0].orderId;
            console.log("orderId", bookId);

            setUpcomingReservations(upcomingReservations);

        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, [upcomingReservations.length]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const sendCancelRequest = async (bookId) => {
        Swal.fire({
            title: 'Are you sure you want to cancel?',
            text: 'You won’t be able to undo this action!',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, I’m sure',
            customClass: {
                popup: 'small-swal',
                title: 'swal-orange-title',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("token");

                    const response = await fetch(`${baseURL}/orders/CancelOrder`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ bookId }),
                    });

                    const result = await response.json();

                    if (result.isSuccess) {
                        console.log("Cancel request successful");
                        Swal.fire({
                            icon: 'success',
                            title: 'Cancellation Successful!',
                            text: 'The ticket has been successfully canceled.',
                        });
                        setUpcomingReservations((prevReservations) =>
                            prevReservations.filter((reservation) => reservation.orderId !== bookId)
                        );
                    } else {
                        console.error("Error in cancel request:", result.message);
                        Swal.fire({
                            icon: 'error',
                            title: 'Cancellation Failed',
                            text: result.message || 'An error occurred while canceling the ticket.',
                        });
                    }
                } catch (error) {
                    console.error("Error sending cancel request:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'A problem occurred while communicating with the server.',
                    });
                }
            } else {
                console.log("Cancel action was aborted by the user.");
            }
        });
    };

    const handleCancelBtn = async (bookId) => {
        try {
            await sendCancelRequest(bookId);
            setUpcomingReservations(prev => prev.filter(reservation => reservation.id !== bookId));
        } catch (error) {
            console.error("Error handling cancel button:", error);
        }
    };

    const handleOpenDialog = (reservation) => {
        setSelectedBookingItems(reservation.bookingItems || []);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedBookingItems([]);
    };

    const payment = {
        "1": "unpaid",
        "0": "paid",
    }

    const type = {
        "1": "adult",
        "2": "child",
    }

    return (
        <div>
            <div className="container text-center">
                <div className="row">
                    <div className="col-md-12">
                        <h2>Upcoming Reservations</h2>
                        {loading ? (
                            <Loading />
                        ) : (
                            <Grid container spacing={3} justifyContent="center">
                                {upcomingReservations.length > 0 ? (
                                    upcomingReservations.map((reservation) => (
                                        <Grid item xs={12} sm={6} md={6} key={reservation.orderId}>
                                            <Card className='mb-3 p-2' sx={{
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                            }}>
                                                <div className="row">
                                                    <div className="col-md-6 pt-lg-0 pt-3">
                                                        <div
                                                            className="d-flex justify-content-center align-items-center"
                                                            style={{ height: "100%" }}
                                                        >
                                                            <img className="img-fluid" src="logo.png" alt="" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <CardContent>
                                                            <Typography component="div">
                                                                <span className='main-color'> booking Id: </span> {reservation.orderId}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <span className="main-color">Ticket Name:</span> {reservation.ticketName}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <span className="main-color">Number Of Adults:</span> {reservation.numberOfAdults}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <span className="main-color">Number Of Childs:</span> {reservation.numberOfChilds}
                                                            </Typography>
                                                            <Typography variant="body1">
                                                                <span className="main-color">payment:</span>{" "} <span className='text-danger fw-bold'>{payment[reservation.payment]}</span>
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <span className="main-color">total Services Price:</span> {reservation.totalAddtionalPrice} $
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <span className="main-color">Total Price:</span> {reservation.totalPrice} $
                                                            </Typography>
                                                        </CardContent>
                                                    </div>
                                                    <CardActions className='d-flex justify-content-between px-4'>
                                                        <button onClick={() => handleOpenDialog(reservation)} className='btn btn-main p-2 text-capitalize'>details</button>
                                                        <button className='btn btn-danger p-2 text-capitalize' onClick={() => handleCancelBtn(reservation.orderId)}>Cancel</button>
                                                    </CardActions>
                                                </div>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : (
                                    <Typography className='pt-5 main-color'>No Reservation Found.</Typography>
                                )}
                            </Grid>
                        )}
                    </div>
                </div>
            </div>

            {/* Dialog to show bookingItems */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle className="text-center main-color">Booking Items</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} justifyContent="center">
                        {selectedBookingItems.length > 0 ? (
                            selectedBookingItems.map((item, index) => (
                                <Grid item xs={12} sm={4} md={4} key={index}>
                                    <Card style={{ marginTop: '20px', padding: '20px 10px 0px 20px', height: '100%' }}>
                                        <Typography variant="body1">
                                            <strong className="main-color">Book Date:</strong> {new Date(item.bookDate).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong className="main-color">Book On:</strong> {new Date(item.createdOn).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong className="main-color">Serial Number:</strong> {item.seriamNumber}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong className="main-color">Name:</strong> {item.name}
                                        </Typography>
                                        {item.phoneNumber && (
                                            <Typography variant="body1">
                                                <strong className="main-color">Phone:</strong> {item.phoneNumber}
                                            </Typography>
                                        )}
                                        {item.email && (
                                            <Typography variant="body1">
                                                <strong className="main-color">Email:</strong> {item.email}
                                            </Typography>
                                        )}
                                        <Typography variant="body1">
                                            <strong className="main-color">Type:</strong> {type[item.personAge]}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong className="main-color">Services:</strong>
                                        </Typography>
                                        {item.services.length > 0 ? (
                                            item.services.map((service, idx) => (
                                                <Typography key={idx} variant="body2">
                                                    {service.name} - {service.price} $
                                                </Typography>
                                            ))
                                        ) : (
                                            <Typography variant="body2">No services available.</Typography>
                                        )}
                                        <Typography variant="body1">
                                            <strong className="main-color">Price:</strong> {item.price} $
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography>No booking items found.</Typography>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default UpcomingReservations;
