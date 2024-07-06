import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);
            const response = await axios.post('http://127.0.0.1:8000/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            localStorage.setItem('token', response.data.access_token);
            console.log('Login successful:', response.data);
            navigate('/dashboard');
            window.location.reload();
            // window.replace("/dashboard");

        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="relative w-screen h-screen">
            <img src={require('../../assets/images/dashboard_background.jpg')} alt="background" className="absolute inset-0 w-full h-full object-cover" />
            <main className="relative flex items-center justify-center h-full p-6">
                <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold">Welcome!</h1>
                        <p className="text-sm text-gray-600">Sign in to continue.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Password</label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md mt-4 hover:bg-blue-700"
                        >
                            Log in
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;
