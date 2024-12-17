import React, { useState } from "react";
import { TextField, Button, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (name.length < 3 || name.length > 12) {
      setError("Name must be between 3 and 12 characters.");
      return;
    }

    if (/\s/.test(name)) {
      setError("Name should only contain one word, no spaces.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least one uppercase letter, one number, one special character, and be between 8 to 12 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const emailCheckResponse = await axios.get(
        "https://rebel-fishy-airship.glitch.me/users",
        {
          params: { email },
        }
      );

      if (emailCheckResponse.data.length > 0) {
        setError("Email already exists.");
        return;
      }

      await axios.post("https://rebel-fishy-airship.glitch.me/users", {
        name,
        email,
        password,
        cart: [],
      });

      setError("");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error occurred. Please try again."
      );
    }

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
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
          Sign Up
        </Typography>

        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Button type="submit" variant="contained" color="error" fullWidth>
              Sign Up
            </Button>
          </Box>
        </form>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "#d32f2f", cursor: "pointer" }}
            >
              Login
            </span>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Signup;
