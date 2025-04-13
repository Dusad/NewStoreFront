import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

function EditRegister() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ id: 0, rname: "", rdisc: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/reg/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setForm({ id: data.id, rname: data.rname, rdisc: data.rdisc });
        setLoading(false);
      })
      .catch(() => {
        setMessage("Error loading register data.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:8080/reg/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        navigate("/register/details", {
          state: { successMessage: "Register updated successfully!" }
        });
      } else {
        setMessage("Update failed. Try again.");
      }
    } catch (err) {
      setMessage("Server error occurred.",err);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-[50vh]">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="max-w-xl mx-auto mt-10">
      <Paper elevation={4} className="p-6 rounded-xl shadow-lg bg-white">
        <Typography variant="h5" className="font-bold text-indigo-700 mb-4 text-center">
          ✏️ Edit Register
        </Typography>

        {message && <Alert severity="error" className="mb-4">{message}</Alert>}

        <TextField
          fullWidth
          label="Register Id"
          name="id"
          value={form.id}
          onChange={handleChange}
          margin="normal"
          disabled
        />
        <TextField
          fullWidth
          label="Register Name"
          name="rname"
          value={form.rname}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Description"
          name="rdisc"
          value={form.rdisc}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
        />

        <Box className="flex justify-between mt-6">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/register/details")}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default EditRegister;
