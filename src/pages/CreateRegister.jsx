import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';

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
      const response = await axios.post('http://localhost:8080/createregister', newRegister);
      console.log('Register created:', response.data);
      setSuccess('Register created successfully!');
      setRname('');
      setRdisc('');
    } catch (err) {
      setError('Error creating register.');
      console.error('Error creating register:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-screen bg-gradient-to-r from-indigo-200 to-indigo-500">
      <Card className="w-full max-w-md rounded-2xl shadow-xl bg-white p-8 transition-all duration-500 transform hover:scale-105">
        <CardContent>
          <Typography variant="h5" className="mb-6 text-indigo-700 font-bold text-center tracking-wide">
            Create a New Register
          </Typography>

          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              label="Register Name"
              variant="outlined"
              fullWidth
              value={rname}
              onChange={(e) => setRname(e.target.value)}
              required
              className="transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              InputProps={{
                style: {
                  fontSize: '16px',
                  padding: '14px',
                },
              }}
              onFocus={(e) => e.target.parentElement.classList.add('bg-indigo-100')}
              onBlur={(e) => e.target.parentElement.classList.remove('bg-indigo-100')}
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
              className="transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              InputProps={{
                style: {
                  fontSize: '16px',
                  padding: '14px',
                },
              }}
              onFocus={(e) => e.target.parentElement.classList.add('bg-indigo-100')}
              onBlur={(e) => e.target.parentElement.classList.remove('bg-indigo-100')}
            />

            {loading ? (
              <div className="flex justify-center items-center mt-4">
                <CircularProgress />
              </div>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="mt-4 py-3 transition-all duration-300 transform hover:scale-110 hover:bg-indigo-700"
              >
                Create Register
              </Button>
            )}

            {/* Success or Error Message */}
            {success && <div className="mt-4 text-green-500 text-center font-semibold">{success}</div>}
            {error && <div className="mt-4 text-red-500 text-center font-semibold">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRegister;
