import axios from 'axios';

// Create an instance of Axios with custom configuration
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',  // The base URL for the API
  timeout: 10000,  // Timeout set to 10 seconds
});

// Request interceptor to include Authorization token if available in localStorage
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Add token to headers
    }
    return config;  // Proceed with the request
  },
  (error) => {
    return Promise.reject(error);  // Reject the promise if an error occurs in the request
  }
);

// Response interceptor to handle response and errors
instance.interceptors.response.use(
  (response) => {
    return response;  // Return the response data if the request was successful
  },
  (error) => {
    // Handle errors, for example, redirect to login if unauthorized (401)
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';  // Redirect to login page if unauthorized
    }
    // Handle other potential errors
    return Promise.reject(error);  // Reject the promise with the error
  }
);

export default instance;  // Export the Axios instance for use in other parts of the app
