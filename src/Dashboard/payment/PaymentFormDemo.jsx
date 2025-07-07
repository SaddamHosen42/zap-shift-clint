import React, { useState } from 'react';
import PaymentForm from './PaymentForm';

const PaymentFormDemo = () => {
    const [selectedDemo, setSelectedDemo] = useState('default');

    // Different order configurations
    const orderConfigs = {
        default: null, // Uses default configuration
        express: {
            services: [
                { id: 'delivery', name: 'Express Parcel Delivery', price: 350, isRequired: true },
                { id: 'tracking', name: 'Real-time Tracking', price: 30, isOptional: true },
                { id: 'insurance', name: 'Premium Insurance', price: 50, isOptional: true },
                { id: 'priority', name: 'Priority Handling', price: 75, isOptional: true }
            ],
            vatRate: 0.08, // 8% VAT
            currency: '৳',
            discountAmount: 25 // Pre-applied discount
        },
        international: {
            services: [
                { id: 'delivery', name: 'International Shipping', price: 1200, isRequired: true },
                { id: 'customs', name: 'Customs Clearance', price: 150, isRequired: true },
                { id: 'express', name: 'Express Processing', price: 300, isOptional: true },
                { id: 'insurance', name: 'International Insurance', price: 100, isOptional: true },
                { id: 'tracking', name: 'Global Tracking', price: 50, isOptional: true }
            ],
            vatRate: 0.10, // 10% VAT
            currency: '$',
            discountAmount: 0
        },
        local: {
            services: [
                { id: 'delivery', name: 'Same Day Delivery', price: 180, isRequired: true },
                { id: 'sms', name: 'SMS Notifications', price: 10, isOptional: true },
                { id: 'fragile', name: 'Fragile Item Handling', price: 40, isOptional: true }
            ],
            vatRate: 0.05, // 5% VAT
            currency: '৳',
            discountAmount: 0
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Demo Selector */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">PaymentForm Demo</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setSelectedDemo('default')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                selectedDemo === 'default'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Default Order
                        </button>
                        <button
                            onClick={() => setSelectedDemo('express')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                selectedDemo === 'express'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Express Delivery
                        </button>
                        <button
                            onClick={() => setSelectedDemo('international')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                selectedDemo === 'international'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            International
                        </button>
                        <button
                            onClick={() => setSelectedDemo('local')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                selectedDemo === 'local'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Local Delivery
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Form */}
            <PaymentForm orderData={orderConfigs[selectedDemo]} />
        </div>
    );
};

export default PaymentFormDemo;
