'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../providers/auth.provider';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <nav className="bg-gray-900 ">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                    <Link href="/" className="text-white text-2xl font-bold flex items-center gap-2">
                        <FaTicketAlt /> Eventora
                    </Link>
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                        <Link href="/" className="text-gray-200 hover:text-white transition cursor-pointer">Events</Link>
                        {user ? (
                            <>
                                <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-gray-200 hover:text-white transition">Dashboard</Link>
                                <button onClick={handleLogout} className="bg-gray-700 hover:bg-black text-white px-4 py-2 rounded-md transition">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-200 hover:text-white transition">Login</Link>
                                <Link href="/register" className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md font-semibold transition">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
