import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import image from './image.png'; 

const Home = () => {
  const navigate = useNavigate();

  const styles = {
    home: {
      width: '100%',  
      height: '100vh',  
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: `url(${image})`,  
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat',  
      position: 'absolute', 
      top: '0',
      left: '0',
      zIndex: '-1',  
    },
    overlay: {
      padding: '40px',
      textAlign: 'center',
      borderRadius: '10px',
      color: 'white',
      position: 'relative',  
    },
    title: {
      fontSize: '2.5rem',
      marginBottom: '30px',
      fontFamily: 'Arial, sans-serif',
    },
    buttonContainer: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
    },
    button: {
      padding: '20px 50px',
      fontSize: '24px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'Arial, sans-serif',
    },
    loginButton: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    loginButtonHover: {
      backgroundColor: '#0056b3',
    },
    registerButton: {
      backgroundColor: '#28a745',
      color: 'white',
    },
    registerButtonHover: {
      backgroundColor: '#1e7e34',
    },
    bookManagementLink: {
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      padding: '10px 20px',
      backgroundColor: '#f0ad4e',
      color: 'white',
      fontSize: '18px',
      borderRadius: '5px',
      textDecoration: 'none',
      transition: 'background-color 0.3s ease',
    },
    bookManagementLinkHover: {
      backgroundColor: '#ec971f',
    },
  };

  return (
    <div style={styles.home}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>Open a Book, Open a World - Welcome to the Magic Book World</h1>
        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.loginButton }}
            onClick={() => navigate('/login')}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.loginButtonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.loginButton.backgroundColor)}
          >
            Login
          </button>
          <button
            style={{ ...styles.button, ...styles.registerButton }}
            onClick={() => navigate('/register')}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.registerButtonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.registerButton.backgroundColor)}
          >
            Register
          </button>
        </div>
      </div>

      <Link
        to="/Admin"  
        style={styles.bookManagementLink}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.bookManagementLinkHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.bookManagementLink.backgroundColor)}
      >
        Book Management
      </Link>
    </div>
  );
};

export default Home;