import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Payment from './Payment';
import Success from './Success';
import Cart from './Cart';

const stepsComponent = ['Cart', 'Details and Payment', 'Success'];

export default function BookingStepper() {
    const navigate = useNavigate();
    const { step } = useParams();

    const currentStep = step ? Number(step) : 0;
    const handleNext = () => {
        const nextStep = currentStep + 1;
        navigate(`/booking/${nextStep}`);
    };


    return (
        <>
            <div className='banner-img d-flex justify-content-center align-items-center text-white text-center'>
                <h2>My Cart</h2>
            </div>
            <div className="container-fluid my-5">
                <div className="row">
                    <div className="col-md-12">
                        <Box sx={{ width: '100%' }}>
                            <Stepper activeStep={currentStep} alternativeLabel>
                                {stepsComponent.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>
                                            <Typography variant="subtitle1" className='fw-bold'>{label}</Typography>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <>
                                {currentStep === 0 ? (
                                    <Cart handleNext={handleNext} />
                                ) : currentStep === 1 ? (
                                    <Payment handleNext={handleNext} />
                                ) : (
                                    currentStep === 2 && <Success />
                                )}
                            </>
                        </Box>
                    </div>
                </div>
            </div>
        </>
    );
}
