import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';

const CreateRegister = () => {
  const [rname, setRname] = useState('');
  const [rdisc, setRdisc] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError('');

    const newRegister = {
      rname,
      rdisc,
    };

    try {
       await axios.post('http://localhost:8080/createregister', newRegister);
      setSuccess('Register created successfully!');
      setRname('');
      setRdisc('');
    } catch (err) {
      setError('Error creating register.',err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center rounded-2xl min-h-screen bg-gradient-to-r from-indigo-300 to-indigo-500 px-4">
      <Card className="w-full max-w-lg rounded-2xl shadow-2xl p-6 bg-white">
        <CardContent>
          <Typography
            variant="h5"
            className="text-center mb-6 text-indigo-700 font-bold tracking-wide"
          >
            Create a New Register
          </Typography>

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField
              label="Register Name"
              variant="outlined"
              fullWidth
              value={rname}
              onChange={(e) => setRname(e.target.value)}
              required
              InputProps={{
                style: {
                  padding: '12px',
                  fontSize: '16px',
                  margin:'10px',
                },
              }}
              InputLabelProps={{
                style: { fontSize: '16px' },
              }}
            />

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={rdisc}
              onChange={(e) => setRdisc(e.target.value)}
              required
              InputProps={{
                style: {
                  padding: '12px',
                  fontSize: '16px',
                  margin:'10px',
                },
              }}
              InputLabelProps={{
                style: { fontSize: '16px' },
              }}
            />

            <div className="pt-3">
              {loading ? (
                <div className="flex justify-center">
                  <CircularProgress size={28} />
                </div>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: '#4F46E5',
                    fontSize: '16px',
                    paddingY: '12px',
                    textTransform: 'none',
                    borderRadius: '10px',
                    '&:hover': {
                      backgroundColor: '#4338CA',
                      transform: 'scale(1.03)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Create Register
                </Button>
              )}
            </div>

            {success && <div className="text-green-600 font-medium text-center">{success}</div>}
            {error && <div className="text-red-600 font-medium text-center">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRegister;
