import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate, useParams } from 'react-router';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { parcelId } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const { isPending, data: parcelInfo = {} } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    });

    if (isPending) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                    <div className="flex items-center justify-center space-x-3">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg font-medium text-gray-600">Loading payment details...</span>
                    </div>
                </div>
            </div>
        );
    }

    const amount = parcelInfo.cost;
    const amountInCents = amount * 100;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');

        if (!stripe || !elements) {
            setError('Stripe has not loaded yet. Please try again.');
            setIsProcessing(false);
            return;
        }

        const card = elements.getElement(CardElement);

        if (!card) {
            setError('Card element not found.');
            setIsProcessing(false);
            return;
        }

        try {
            // Step 1: Validate the card
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card,
                billing_details: {
                    name: user.displayName,
                    email: user.email
                }
            });

            if (error) {
                setError(error.message);
                setIsProcessing(false);
                return;
            }

            console.log('Payment method created:', paymentMethod);

            // Step 2: Create payment intent
            const res = await axiosSecure.post('/create-payment-intent', {
                amountInCents,
                parcelId
            });

            const clientSecret = res.data.clientSecret;

            //Step 3: Confirm payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    const transactionId = result.paymentIntent.id;
                    console.log('Payment successful:', transactionId);
                    
                    // Step 4: Save payment data
                    const paymentData = {
                        parcelId,
                        email: user.email,
                        amount,
                        transactionId: transactionId,
                        paymentMethod: result.paymentIntent.payment_method_types
                    };

                    const paymentRes = await axiosSecure.post('/payments', paymentData);
                    console.log('Payment saved:', paymentRes.data);
                    
                    if (paymentRes.data.paymentId) {
                        // Show success message
                        await Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful!',
                            html: `
                                <div class="text-center">
                                    <p class="text-lg mb-4">Your payment has been processed successfully!</p>
                                    <div class="bg-gray-100 p-4 rounded-lg">
                                        <p class="text-sm text-gray-600 mb-2">Transaction ID:</p>
                                        <code class="text-sm font-mono bg-white px-3 py-2 rounded border">${transactionId}</code>
                                    </div>
                                </div>
                            `,
                            confirmButtonText: 'Go to My Parcels',
                            confirmButtonColor: '#10B981'
                        });

                        // Redirect to My Parcels
                        navigate('/dashboard/myParcels');
                    }
                }
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Stripe Card Element styling
    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSmoothing: 'antialiased',
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: true,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-secondary mb-4">Secure Payment</h1>
                    <p className="text-lg text-gray-600">Complete your parcel delivery payment safely with Stripe</p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {/* Payment Form */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center">
                            <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 text-black">
                                💳
                            </span>
                            Payment Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer Information */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Customer Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Name
                                        </label>
                                        <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 font-medium">
                                            {user.displayName || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Email
                                        </label>
                                        <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 font-medium">
                                            {user.email || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Details */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Card Information
                                </label>
                                <div className="p-4 border-2 border-gray-200 rounded-xl focus-within:border-primary transition-all duration-300 bg-white">
                                    <CardElement options={cardElementOptions} />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    Your payment information is encrypted and secure
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-red-700 text-sm font-medium">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!stripe || isProcessing}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                    !stripe || isProcessing
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary/90 hover:scale-105'
                                } text-black shadow-lg`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Processing Payment...
                                    </span>
                                ) : (
                                    `Pay $${amount}`
                                )}
                            </button>

                            {/* Payment Methods Accepted */}
                            <div className="flex items-center justify-center space-x-4 pt-4">
                                <span className="text-sm text-gray-500">We accept:</span>
                                <div className="flex space-x-2">
                                    <div className="bg-blue-100 px-2 py-1 rounded text-xs font-medium text-blue-700">VISA</div>
                                    <div className="bg-red-100 px-2 py-1 rounded text-xs font-medium text-red-700">Mastercard</div>
                                    <div className="bg-green-100 px-2 py-1 rounded text-xs font-medium text-green-700">American Express</div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
