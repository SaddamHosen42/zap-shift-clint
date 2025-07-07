import React from 'react';

const AboutUs = () => {
    const teamMembers = [
        {
            name: "MD. Rahman Khan",
            position: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            description: "Leading the company with 10+ years of logistics experience"
        },
        {
            name: "Fatima Ahmed",
            position: "Head of Operations",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
            description: "Ensuring smooth delivery operations across Bangladesh"
        },
        {
            name: "Karim Hassan",
            position: "Technology Lead",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            description: "Building innovative solutions for better user experience"
        }
    ];

    const stats = [
        { number: "50,000+", label: "Successful Deliveries" },
        { number: "1,000+", label: "Happy Customers" },
        { number: "8", label: "Cities Covered" },
        { number: "99.5%", label: "On-Time Delivery" }
    ];

    const values = [
        {
            icon: "🚀",
            title: "Fast & Reliable",
            description: "We ensure your parcels reach their destination quickly and safely with our efficient delivery network."
        },
        {
            icon: "🔒",
            title: "Secure Handling",
            description: "Your packages are handled with utmost care and security throughout the entire delivery process."
        },
        {
            icon: "📱",
            title: "Real-time Tracking",
            description: "Track your parcels in real-time with our advanced tracking system and get instant updates."
        },
        {
            icon: "💰",
            title: "Affordable Pricing",
            description: "Get the best delivery services at competitive prices that fit your budget perfectly."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
            {/* Hero Section */}
            <div className="hero min-h-[60vh] bg-gradient-to-r from-primary/20 to-secondary/20">
                <div className="hero-content text-center">
                    <div className="max-w-4xl">
                        <h1 className="text-5xl font-bold text-secondary mb-6">
                            About <span className="text-primary">ZapShift</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            We are Bangladesh's fastest-growing parcel delivery service, dedicated to connecting people 
                            and businesses across the country. With our innovative technology and committed team, 
                            we make shipping simple, fast, and reliable.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="btn btn-primary btn-lg text-black">Our Services</button>
                            <button className="btn btn-outline btn-secondary btn-lg text-black hover:text-white">Contact Us</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-secondary text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                                <div className="text-lg opacity-90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="py-20 bg-base-100">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-secondary mb-6">Our Story</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Founded in 2020, ZapShift began with a simple mission: to revolutionize parcel delivery 
                                in Bangladesh. What started as a small team with big dreams has grown into a trusted 
                                delivery partner for thousands of customers across the country.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                We understand the importance of every package, whether it's a business document, 
                                a gift for a loved one, or essential supplies. That's why we've built our service 
                                around speed, security, and customer satisfaction.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-secondary text-xl font-bold">✓</span>
                                </div>
                                <span className="text-lg font-semibold text-secondary">Trusted by 1000+ customers</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 h-96 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">📦</div>
                                    <h3 className="text-2xl font-bold text-secondary mb-2">Delivery Excellence</h3>
                                    <p className="text-gray-600">Making every delivery count</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-20 bg-base-200">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-secondary mb-4">Why Choose ZapShift?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We're committed to providing exceptional service that exceeds your expectations
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="card-body text-center">
                                    <div className="text-4xl mb-4">{value.icon}</div>
                                    <h3 className="card-title justify-center text-secondary mb-3">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-20 bg-base-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-secondary mb-4">Meet Our Team</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            The passionate people behind ZapShift who make it all possible
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <figure className="px-6 pt-6">
                                    <img 
                                        src={member.image} 
                                        alt={member.name}
                                        className="rounded-full w-32 h-32 object-cover"
                                    />
                                </figure>
                                <div className="card-body text-center">
                                    <h3 className="card-title justify-center text-secondary">{member.name}</h3>
                                    <p className="text-primary font-semibold">{member.position}</p>
                                    <p className="text-gray-600 text-sm">{member.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-secondary mb-6">Our Mission</h2>
                        <p className="text-xl text-gray-700 leading-relaxed mb-8">
                            To become Bangladesh's most trusted and efficient parcel delivery service, 
                            connecting communities and enabling businesses to thrive through reliable, 
                            fast, and affordable shipping solutions.
                        </p>
                        <div className="grid md:grid-cols-3 gap-8 mt-12">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-2">Vision</h3>
                                <p className="text-gray-600">Leading delivery innovation in Bangladesh</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">💝</span>
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-2">Values</h3>
                                <p className="text-gray-600">Trust, Speed, and Customer Satisfaction</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🌟</span>
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-2">Goal</h3>
                                <p className="text-gray-600">100% customer satisfaction always</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact CTA Section */}
            <div className="py-20 bg-secondary text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Ship with ZapShift?</h2>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who trust us with their deliveries. 
                        Experience the difference today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="btn btn-primary btn-lg text-black">Send a Parcel</button>
                        <button className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-black">
                            Track Your Package
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;