import React from 'react';
import { useLoaderData } from 'react-router';
import BangladeshMap from './BangladeshMap';

const Coverage = () => {
    const coverageData = useLoaderData();
    console.log("Coverage Data:", coverageData);
    
    return (
         <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-6">We are available in 64 districts</h1>
            <p className="text-center mb-6">
                We are available in 64 districts of Bangladesh. You can search for your district to see if we are available in your area.

            </p>
            <BangladeshMap  coverageData={coverageData} />
        </div>
    );
};

export default Coverage;