import React from 'react'
import ReservationTabs from './ReservationTabs'

const MyReservation = () => {
    return (
        <div>
            <div className='banner-img d-flex justify-content-center align-items-center text-white text-center text-capitalize'>
                <h2>my reservation</h2>
            </div>

            <div className="container mt-4 ">
                <div className="row">
                    <div className="col-md-12">
                        <ReservationTabs />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyReservation