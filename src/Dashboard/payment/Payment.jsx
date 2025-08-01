import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import PaymentForm from './PaymentForm';


const stripePromise = loadStripe('pk_test_51RiSR6RhNFvJ4QayTbcu4DHlZtwWGjLTvqiuMtpy4Q1jEwaGCKwA77nhjHAjkpznIdP8gZW3jN9DpHr9GYee0Mq50082ZtpTYA');

const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm></PaymentForm>
        </Elements>
    );
};

export default Payment;