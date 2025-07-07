import React, { useState } from 'react';

import { useForm, Controller } from 'react-hook-form';

const PaymentForm = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardHolderName: '',
            billingAddress: '',
            city: '',
            zipCode: '',
            paymentMethod: 'card',
            mobileNumber: ''
        },
        mode: 'onChange'
    });
    
    const paymentMethod = watch('paymentMethod');

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const cleanValue = value.replace(/\s/g, '');
        const formattedValue = cleanValue.replace(/(.{4})/g, '$1 ').trim();
        return formattedValue.length > 19 ? formattedValue.substring(0, 19) : formattedValue;
    };

    // Format expiry date MM/YY
    const formatExpiryDate = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        const formattedValue = cleanValue.replace(/(\d{2})(\d)/, '$1/$2');
        return formattedValue.length > 5 ? formattedValue.substring(0, 5) : formattedValue;
    };

    // Format CVV (numbers only, max 3 digits)
    const formatCVV = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        return cleanValue.length > 3 ? cleanValue.substring(0, 3) : cleanValue;
    };

    // Format mobile number
    const formatMobileNumber = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        return cleanValue.length > 11 ? cleanValue.substring(0, 11) : cleanValue;
    };

    const onSubmit = async (data) => {
        setIsProcessing(true);
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Here you would integrate with actual payment gateway
            console.log('Payment data:', {
                ...data,
                timestamp: new Date().toISOString()
            });
            
            // Show success message
            alert('Payment processed successfully!');
            
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const getCardType = (number) => {
        const num = number.replace(/\s/g, '');
        if (num.startsWith('4')) return 'visa';
        if (num.startsWith('5')) return 'mastercard';
        if (num.startsWith('3')) return 'amex';
        return 'card';
    };

    // Validation rules
    const validationRules = {
        cardHolderName: {
            required: 'Card holder name is required',
            minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
            }
        },
        cardNumber: {
            required: 'Card number is required',
            validate: (value) => {
                const cleanNumber = value.replace(/\s/g, '');
                if (cleanNumber.length < 16) {
                    return 'Card number must be 16 digits';
                }
                return true;
            }
        },
        expiryDate: {
            required: 'Expiry date is required',
            validate: (value) => {
                if (value.length < 5) {
                    return 'Please enter a valid expiry date';
                }
                const [month, year] = value.split('/');
                const currentYear = new Date().getFullYear() % 100;
                const currentMonth = new Date().getMonth() + 1;
                
                if (parseInt(month) < 1 || parseInt(month) > 12) {
                    return 'Invalid month';
                }
                
                if (parseInt(year) < currentYear || 
                    (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                    return 'Card has expired';
                }
                
                return true;
            }
        },
        cvv: {
            required: 'CVV is required',
            minLength: {
                value: 3,
                message: 'CVV must be 3 digits'
            }
        },
        billingAddress: {
            required: 'Billing address is required',
            minLength: {
                value: 5,
                message: 'Address must be at least 5 characters'
            }
        },
        city: {
            required: 'City is required',
            minLength: {
                value: 2,
                message: 'City must be at least 2 characters'
            }
        },
        zipCode: {
            required: 'ZIP code is required',
            pattern: {
                value: /^\d{4,6}$/,
                message: 'ZIP code must be 4-6 digits'
            }
        },
        mobileNumber: {
            validate: (value) => {
                if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
                    if (!value) return 'Mobile number is required';
                    if (value.length < 11) return 'Mobile number must be 11 digits';
                    if (!value.startsWith('01')) return 'Mobile number must start with 01';
                }
                return true;
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-secondary mb-4">Payment Information</h1>
                    <p className="text-lg text-gray-600">Secure payment processing for your parcel delivery</p>
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

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Payment Method Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Payment Method
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <Controller
                                        name="paymentMethod"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <label className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-300 ${
                                                    field.value === 'card' 
                                                    ? 'border-primary bg-primary/10' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                    <input
                                                        type="radio"
                                                        value="card"
                                                        checked={field.value === 'card'}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        className="hidden"
                                                    />
                                                    <div className="text-2xl mb-2">💳</div>
                                                    <div className="text-sm font-medium">Card</div>
                                                </label>
                                                
                                                <label className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-300 ${
                                                    field.value === 'bkash' 
                                                    ? 'border-primary bg-primary/10' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                    <input
                                                        type="radio"
                                                        value="bkash"
                                                        checked={field.value === 'bkash'}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        className="hidden"
                                                    />
                                                    <div className="text-2xl mb-2">📱</div>
                                                    <div className="text-sm font-medium">bKash</div>
                                                </label>

                                                <label className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-300 ${
                                                    field.value === 'nagad' 
                                                    ? 'border-primary bg-primary/10' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                    <input
                                                        type="radio"
                                                        value="nagad"
                                                        checked={field.value === 'nagad'}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        className="hidden"
                                                    />
                                                    <div className="text-2xl mb-2">💰</div>
                                                    <div className="text-sm font-medium">Nagad</div>
                                                </label>
                                            </>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Card Details - Only show if card is selected */}
                            {paymentMethod === 'card' && (
                                <>
                                    {/* Card Holder Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Card Holder Name
                                        </label>
                                        <Controller
                                            name="cardHolderName"
                                            control={control}
                                            rules={validationRules.cardHolderName}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                                                        errors.cardHolderName 
                                                        ? 'border-red-300 focus:border-red-500' 
                                                        : 'border-gray-200 focus:border-primary'
                                                    }`}
                                                    placeholder="John Doe"
                                                />
                                            )}
                                        />
                                        {errors.cardHolderName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.cardHolderName.message}</p>
                                        )}
                                    </div>

                                    {/* Card Number */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Card Number
                                        </label>
                                        <div className="relative">
                                            <Controller
                                                name="cardNumber"
                                                control={control}
                                                rules={validationRules.cardNumber}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        onChange={(e) => {
                                                            const formatted = formatCardNumber(e.target.value);
                                                            field.onChange(formatted);
                                                        }}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                                                            errors.cardNumber 
                                                            ? 'border-red-300 focus:border-red-500' 
                                                            : 'border-gray-200 focus:border-primary'
                                                        }`}
                                                        placeholder="1234 5678 9012 3456"
                                                    />
                                                )}
                                            />
                                            <div className="absolute right-3 top-3 text-2xl">
                                                {getCardType(watch('cardNumber')) === 'visa' && '💙'}
                                                {getCardType(watch('cardNumber')) === 'mastercard' && '🔴'}
                                                {getCardType(watch('cardNumber')) === 'amex' && '💚'}
                                                {getCardType(watch('cardNumber')) === 'card' && '💳'}
                                            </div>
                                        </div>
                                        {errors.cardNumber && (
                                            <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
                                        )}
                                    </div>

                                    {/* Expiry Date and CVV */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Expiry Date
                                            </label>
                                            <Controller
                                                name="expiryDate"
                                                control={control}
                                                rules={validationRules.expiryDate}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        onChange={(e) => {
                                                            const formatted = formatExpiryDate(e.target.value);
                                                            field.onChange(formatted);
                                                        }}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                                                            errors.expiryDate 
                                                            ? 'border-red-300 focus:border-red-500' 
                                                            : 'border-gray-200 focus:border-primary'
                                                        }`}
                                                        placeholder="MM/YY"
                                                    />
                                                )}
                                            />
                                            {errors.expiryDate && (
                                                <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                CVV
                                            </label>
                                            <Controller
                                                name="cvv"
                                                control={control}
                                                rules={validationRules.cvv}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        onChange={(e) => {
                                                            const formatted = formatCVV(e.target.value);
                                                            field.onChange(formatted);
                                                        }}
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                                                            errors.cvv 
                                                            ? 'border-red-300 focus:border-red-500' 
                                                            : 'border-gray-200 focus:border-primary'
                                                        }`}
                                                        placeholder="123"
                                                    />
                                                )}
                                            />
                                            {errors.cvv && (
                                                <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Mobile Banking Details */}
                            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <Controller
                                        name="mobileNumber"
                                        control={control}
                                        rules={validationRules.mobileNumber}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="tel"
                                                onChange={(e) => {
                                                    const formatted = formatMobileNumber(e.target.value);
                                                    field.onChange(formatted);
                                                }}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                                                    errors.mobileNumber 
                                                    ? 'border-red-300 focus:border-red-500' 
                                                    : 'border-gray-200 focus:border-primary'
                                                }`}
                                                placeholder="01XXXXXXXXX"
                                            />
                                        )}
                                    />
                                    {errors.mobileNumber && (
                                        <p className="text-red-500 text-sm mt-1">{errors.mobileNumber.message}</p>
                                    )}
                                </div>
                            )}

                            {/* Billing Address */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Billing Address</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <Controller
                                            name="billingAddress"
                                            control={control}
                                            rules={validationRules.billingAddress}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                                                        errors.billingAddress 
                                                        ? 'border-red-300 focus:border-red-500' 
                                                        : 'border-gray-200 focus:border-primary'
                                                    }`}
                                                    placeholder="Street Address"
                                                />
                                            )}
                                        />
                                        {errors.billingAddress && (
                                            <p className="text-red-500 text-sm mt-1">{errors.billingAddress.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Controller
                                                name="city"
                                                control={control}
                                                rules={validationRules.city}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                                                            errors.city 
                                                            ? 'border-red-300 focus:border-red-500' 
                                                            : 'border-gray-200 focus:border-primary'
                                                        }`}
                                                        placeholder="City"
                                                    />
                                                )}
                                            />
                                            {errors.city && (
                                                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Controller
                                                name="zipCode"
                                                control={control}
                                                rules={validationRules.zipCode}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                                                            errors.zipCode 
                                                            ? 'border-red-300 focus:border-red-500' 
                                                            : 'border-gray-200 focus:border-primary'
                                                        }`}
                                                        placeholder="ZIP Code"
                                                    />
                                                )}
                                            />
                                            {errors.zipCode && (
                                                <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                    isProcessing
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary/90 hover:scale-105'
                                } text-black shadow-lg`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    'Complete Payment'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
