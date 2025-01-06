import axios from 'axios';

// Function to get a cookie by name
function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Function to remove a cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to Add Token to Headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken'); // Get token from cookies
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Access token added to headers:', token);
    } else {
      console.log('No access token found in cookies');
    }
    return config;
  },
  (error) => Promise.reject(error)
);    

// Response Interceptor to Handle Token Expiry and Unauthorized Access
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return response if successful
  async (error) => {
    const originalRequest = error.config;

    // Check if the error response status is 401 or 403
    if ((error.response && error.response.status === 401) || (error.response && error.response.status === 403)) {
      console.log('Access token might be expired, attempting to refresh it...');
      
      const refreshToken = getCookie('refreshToken');
      if (refreshToken) {
        console.log('Found refresh token in cookies:', refreshToken);

        try {
          // Call backend to refresh the token
          const response = await axios.post(import.meta.env.VITE_REFRESH_TOKEN, { token: refreshToken });
          const { accessToken } = response.data;

          if (accessToken) {
            // Save new access token in cookies and retry the original request
            document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 15}`;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            console.log('New access token received and saved. Retrying the original request...');

            return axiosInstance(originalRequest); // Retry the original request with the new token
          } else {
            console.log('No access token received in response. Redirecting to login...');
            // If no new token is returned, delete old tokens and redirect
            deleteCookie('accessToken');
            deleteCookie('refreshToken');
            window.location.href = '/login';   
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          // If error occurs while refreshing, delete tokens and redirect to login
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
          window.location.href = '/login';
        }
      } else {
        console.log('No refresh token available. Redirecting to login...');
        // If no refresh token available, redirect to login
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        window.location.href = '/login';
      }
    }

    // For other errors, simply reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
