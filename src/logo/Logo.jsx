import React from 'react';
import logo from '../assets/logo.png'; 
const Logo = () => {
    return (
        <div className='flex'>
            <img src={logo}  className='h-13'/>
            <h1 className='text-2xl font-extrabold mt-6 -ms-5'>Profast</h1>
        </div>
    );
};

export default Logo;