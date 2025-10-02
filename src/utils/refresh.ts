// utils/refresh.js
import axios from 'axios';

const RefreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export async function refreshToken() {
  const refresh_token = localStorage.getItem('refresh_token');
  console.log("refreshtoken:", refresh_token)
  if (!refresh_token) throw new Error('No refresh token available');

  const response = await RefreshApi.post('/refresh', null, {
    headers: {
      Authorization: `Bearer ${refresh_token}`,
    },
  });
  console.log("response:", response)

  const newAccessToken = response?.data?.access_token;
 
  localStorage.setItem('token', newAccessToken);
  return newAccessToken;
}
