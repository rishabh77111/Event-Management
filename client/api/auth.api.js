// // import api from './axios';

// // export const loginApi = async (email, password) => {
// //   const { data } = await api.post('/auth/login', { email, password });
// //   return data;
// // };

// // export const registerApi = async (name, email, password) => {
// //   const { data } = await api.post('/auth/register', {
// //     name,
// //     email,
// //     password,
// //   });
// //   return data;
// // };

// // export const verifyOtpApi = async (email, otp) => {
// //   const { data } = await api.post('/auth/verify-otp', { email, otp });
// //   return data;
// // };




// 'use client';

// import React, { createContext, useState, useEffect } from 'react';
// import { loginApi, registerApi, verifyOtpApi } from '../api/auth.api';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // useEffect(() => {
//     //     const userInfo = localStorage.getItem('userInfo');

//     //     if (userInfo) {
//     //         setUser(JSON.parse(userInfo));
//     //     }

//     //     setLoading(false);
//     // }, []);

//     useEffect(() => {
//     const userInfo = localStorage.getItem('userInfo');

//     if (userInfo && userInfo !== 'undefined') {
//         try {
//             setUser(JSON.parse(userInfo));
//         } catch (error) {
//             console.log('Invalid userInfo in localStorage');
//             localStorage.removeItem('userInfo');
//         }
//     }

//     setLoading(false);
// }, []);

//     const login = async (email, password) => {
//         try {
//             const data = await loginApi(email, password);

//             setUser(data);

//             localStorage.setItem(
//                 'userInfo',
//                 JSON.stringify(data)
//             );

//             localStorage.setItem('token', data.token);

//             return data;

//         } catch (error) {
//             if (error.response?.data?.needsVerification) {
//                 throw error.response.data;
//             }

//             throw error.response?.data?.message || 'Login failed';
//         }
//     };

//     const register = async (name, email, password) => {
//         try {
//             const data = await registerApi(
//                 name,
//                 email,
//                 password
//             );

//             return data;

//         } catch (error) {
//             throw error.response?.data?.message ||
//                 'Registration failed';
//         }
//     };

//     const verifyOTP = async (email, otp) => {
//         try {
//             const data = await verifyOtpApi(email, otp);

//             setUser(data);

//             localStorage.setItem(
//                 'userInfo',
//                 JSON.stringify(data)
//             );

//             localStorage.setItem('token', data.token);

//             return data;

//         } catch (error) {
//             throw error.response?.data?.message ||
//                 'OTP verification failed';
//         }
//     };

//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('userInfo');
//         localStorage.removeItem('token');
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 login,
//                 register,
//                 verifyOTP,
//                 logout,
//                 loading
//             }}
//         >
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };



import api from './axios';

export const loginApi = async (email, password) => {
    const { data } = await api.post(
        '/auth/login',
        {
            email,
            password
        }
    );

    return data;
};

export const registerApi = async (name, email, password) => {
    const { data } = await api.post(
        '/auth/register',
        {
            name,
            email,
            password
        }
    );

    return data;
};

export const verifyOtpApi = async (email, otp) => {
    const { data } = await api.post(
        '/auth/verify-otp',
        {
            email,
            otp
        }
    );

    return data;
};
