import React, { useState } from "react";
import { TextField, Button, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must contain at least one uppercase letter, one number, one special character, and be between 8 to 12 characters."
      );
      return;
    }

    try {
      const response = await axios.get(
        "https://rebel-fishy-airship.glitch.me/users",
        {
          params: { email },
        }
      );

      if (response.data.length === 0) {
        setError("User with this email not found.");
        return;
      }

      const user = response.data[0];
      const updatedUser = { ...user, password: newPassword };

      await axios.put(
        `https://rebel-fishy-airship.glitch.me/users/${user.id}`,
        updatedUser
      );

      setMessage("Password updated successfully.");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
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
          Reset Password
        </Typography>

        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}

        {message && (
          <Typography
            variant="body2"
            color="success"
            align="center"
            gutterBottom
          >
            {message}
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
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="error" fullWidth>
              Reset Password
            </Button>
          </Box>
        </form>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "#d32f2f", cursor: "pointer" }}
            >
              Login
            </span>
          </Typography>

          <Typography variant="body2">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "#d32f2f", cursor: "pointer" }}
            >
              Sign up
            </span>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
