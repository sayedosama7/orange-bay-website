import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import UserData from './UserData';
import Payment from './Payment';
import Success from './Success';
const stepsComponent = ['User data', 'Payment and confirm', 'Success'];

export default function BookingStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [bookDetail, setBookDetail] = useState({ adults: 0, children: 0, totalPrice: 0 });

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    useEffect(() => {
        const details = JSON.parse(localStorage.getItem('bookDetail'));
        if (details) setBookDetail(details);
    }, []);


    return (
        <>
            <div className='banner-img d-flex justify-content-center align-items-center text-white text-center'>
                <h2>{bookDetail.title}</h2>
            </div>
            <div className="container-fluid my-5">
                <div className="row">
                    <div className="col-md-12">
                        <Box sx={{ width: '100%' }}>

                            <Stepper activeStep={activeStep} alternativeLabel>
                                {stepsComponent.map(label => (
                                    <Step key={label}>
                                        <StepLabel>
                                            <Typography variant="subtitle1" className='fw-bold'>{label}</Typography>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <>
                                {activeStep === 0 ? (
                                    <UserData bookDetail={bookDetail} handleNext={handleNext} />
                                ) : activeStep === 1 ? (
                                    <Payment bookDetail={bookDetail} handleNext={handleNext} />
                                ) : (
                                    activeStep === 2 && <Success bookDetail={bookDetail} />
                                )}
                            </>
                        </Box>

                    </div>
                </div>
            </div>
        </>
    );
}
