import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Axios from "../Utils/Axios";
import image from "./imagecopy.png";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await Axios.post("/users/register", {
        name,
        email,
        password,
        isAdmin,
        adminKey,
      });
      setSuccess(true);
      setTimeout(() => navigate("/AdminLogin"), 2000);
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.message === "User already exists"
      ) {
        setAlreadyRegistered(true);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <>
    <form action="">
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "-1",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            padding: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            marginLeft: "-900px",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              marginBottom: 3,
              textShadow: "1px 1px 1px black",
            }}
          >
            Admin Registration
          </Typography>
          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <Typography variant="body1">Admin User</Typography>
          </Box>
          {isAdmin && (
            <TextField
              label="Admin Key"
              type="password"
              fullWidth
              margin="normal"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleRegister}
            sx={{ marginTop: 2 }}
          >
            Register
          </Button>

          {alreadyRegistered && (
            <div
              className="mt-2 text-red-500"
              style={{
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              Already registered? Please{" "}
              <Link
                  component="button"
                  onClick={() => navigate("/login")}
                className="text-black border-b-2 border-transparent hover:border-black transition-colors duration-300"
                style={{ textDecoration: "none" }}
              >
                Login Here
             </Link>
            </div>
          )}
        </Box>
      </Box>
      </form>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Registration successful!
        </Alert>
      </Snackbar>

      <style jsx>{`
        .login-link {
          color: black;
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: border-bottom 0.3s ease;
        }
        .login-link:hover {
          border-bottom: 2px solid black;
        }
      `}</style>
    </>
  );
};

export default AdminRegister;
