import React, { useState } from "react";
import { TextField, Button, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/users", {
        params: { email, password },
      });

      if (response.data.length > 0) {
        const user = response.data[0];
        dispatch(login(user));
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: "gray.100",
        padding: 2,
      }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={4}
        sx={{ backgroundColor: "white", borderRadius: 2, boxShadow: 3, p: 3 }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Login
        </Typography>

        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="error" fullWidth>
              Login
            </Button>
          </Box>
        </form>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "#d32f2f", cursor: "pointer" }}
            >
              Sign up
            </span>
          </Typography>

          <Box mt={1}>
            <span
              onClick={() => navigate("/forgot-password")}
              style={{ color: "#d32f2f", cursor: "pointer" }}
            >
              Forgot Password?
            </span>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
