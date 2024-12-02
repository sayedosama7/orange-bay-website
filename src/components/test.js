
const handleBooking = async () => {
    if (adults === 0 && children === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Booking Error',
            text: 'Please select at least one adult or child.',
            confirmButtonColor: '#E07026',
        });
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'Please log in to continue.',
            confirmButtonColor: '#E07026',
        }).then(() => {
            navigate('/login');
        });
        return;
    }

    const totalPrice = calculateTotalPrice();

    // date format
    const formattedDate = selectedDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });

    // Display confirmation modal
    const confirmResult = await Swal.fire({
        title: '<span class="main-color">Confirm Your Booking</span>',
        html: `
                <div style="text-align: center;">
                <p><strong>Ticket Name :</strong> ${overviewData.title}</p>
                    <p><strong>Date : </strong> ${formattedDate}</p>
                    <p><strong>Number Of Adults :</strong> ${adults}</p>
                    <p><strong>Number Of Children :</strong> ${children}</p>
                    <p><strong>Total Price With Services :</strong> ${totalPrice} EGP</p>
                    <p><strong>Additional Services :</strong> ${formData.addtionalServices.length > 0
                ? formData.addtionalServices.map(s => s.name).join(', ')
                : 'None'
            }</p>
                </div>
            `,
        showCancelButton: true,
        confirmButtonText: 'Confirm Booking',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#E07026',
    });

    if (!confirmResult.isConfirmed) {
        return;
    }

    const bookingData = new FormData();
    bookingData.append('BookingDate', selectedDate.toISOString());
    bookingData.append('NumberOfAdults', adults.toString());
    bookingData.append('NumberOfChilds', children.toString());
    bookingData.append('Price', totalPrice);
    bookingData.append('TicketId', overviewData.id);
    bookingData.append('TicketTitle', overviewData.title);
    const TicketTitle = overviewData.title;
    try {
        setLoading(true);
        const response = await axios.post(
            'http://elgzeraapp.runasp.net/api/Booking/create',
            bookingData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        Swal.fire({
            icon: 'success',
            title: 'Booking Successful',
            text: 'Your booking has been confirmed!',
            confirmButtonColor: '#E07026',
        });

        navigate('/success', {
            state: {
                selectedDate,
                adults,
                TicketTitle,
                children,
                totalPrice,
                addtionalServices: formData.addtionalServices,
            },
        });
    } catch (error) {
        setLoading(false);
        console.error('Error creating booking:', error);
        Swal.fire({
            icon: 'error',
            title: 'Booking Failed',
            text: 'An error occurred while processing your booking. Please try again.',
            confirmButtonColor: '#E07026',
        });
    }
};