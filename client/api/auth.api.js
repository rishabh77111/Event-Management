import api from './axios';

export const loginApi = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const registerApi = async (name, email, password) => {
  const { data } = await api.post('/auth/register', {
    name,
    email,
    password,
  });
  return data;
};

export const verifyOtpApi = async (email, otp) => {
  const { data } = await api.post('/auth/verify-otp', { email, otp });
  return data;
};
