import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
const PastReservations = () => {
    const [pastRservations, setPastRservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingItems, setSelectedBookingItems] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    // Fetch reservation
    const fetchData = async () => {
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

            const pastRservations = response.data.value?.pastRservations || [];
            setPastRservations(pastRservations);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenDialog = (reservation) => {
        setSelectedBookingItems(reservation.bookingItems || []);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedBookingItems([]);
    };

    const type = {
        "1": "adult",
        "2": "child",
    }
    return (
        <div>
            <div className="container text-center">
                <div className="row">
                    <div className="col-md-12">
                        <h2>Past Reservations</h2>
                        {loading ? (
                            <Loading />
                        ) : (
                            <Grid container spacing={3} justifyContent="center">
                                {pastRservations.length > 0 ? (
                                    pastRservations.map((reservation) => (
                                        <Grid item xs={12} sm={6} md={6} key={reservation.orderId}>
                                            <Card className='mb-3 p-2' sx={{
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                            }}>
                                                <div className="row" >
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

export default PastReservations;
