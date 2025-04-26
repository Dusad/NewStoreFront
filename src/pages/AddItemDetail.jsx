import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, MenuItem, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, IconButton, Divider
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AddItemDetail = () => {
  const [registers, setRegisters] = useState([]);
  const [items, setItems] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);

  const [selectedRegisterId, setSelectedRegisterId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemName, setSelectedItemName] = useState('');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemquantity: '',
    issuedquantity: '',
    itempurchasedate: null,
    rateperunit: ''
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch all registers
  useEffect(() => {
    const fetchRegisters = async () => {
      try {
        const response = await fetch("http://localhost:8080/allregister");
        const data = await response.json();
        setRegisters(data);
      } catch (error) {
        console.error("Error fetching registers:", error);
      }
    };
    fetchRegisters();
  }, []);

  // Fetch items by register id
  useEffect(() => {
    if (selectedRegisterId) {
      const fetchItems = async () => {
        try {
          const response = await fetch(`http://localhost:8080/reg/item/${selectedRegisterId}`);
          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };
      fetchItems();
    }
    setSelectedItemId('');
    setItemDetails([]);
  }, [selectedRegisterId]);

  // Fetch item details by item id
  useEffect(() => {
    if (selectedItemId) {
      const fetchItemDetails = async () => {
        try {
          const response = await fetch(`http://localhost:8080/itemdetailbyitemid/${selectedItemId}`);
          const data = await response.json();
          setItemDetails(data);
          const foundItem = items.find((item) => item.id === selectedItemId);
          setSelectedItemName(foundItem?.itemname || '');
        } catch (error) {
          console.error("Error fetching item details:", error);
        }
      };
      fetchItemDetails();
    }
  }, [selectedItemId, items]);

  const handleRegisterChange = (e) => {
    setSelectedRegisterId(e.target.value);
  };

  const handleItemChange = (e) => {
    setSelectedItemId(e.target.value);
  };

  const handleOpenEditDialog = (detail) => {
    setFormData({
      itemquantity: detail.itemquantity,
      issuedquantity: detail.issuedquantity,
      itempurchasedate: dayjs(detail.itempurchasedate),
      rateperunit: detail.rateperunit
    });
    setEditDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setFormData({
      itemquantity: '',
      issuedquantity: '',
      itempurchasedate: null,
      rateperunit: ''
    });
    setAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setAddDialogOpen(false);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, itempurchasedate: newValue }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmitEdit = async (id) => {
    try {
      await fetch(`http://localhost:8080/itemdetail/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          itempurchasedate: formData.itempurchasedate?.toISOString(),
          item: { id: selectedItemId }
        })
      });
      setEditDialogOpen(false);
      setSelectedItemId(selectedItemId); // Refresh
      showSnackbar("ItemDetail updated successfully!");
    } catch (error) {
      console.error("Error updating itemdetail:", error);
    }
  };

  const handleSubmitAdd = async () => {
    try {
      const response = await fetch(`http://localhost:8080/enteritemdetail/${selectedItemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          itempurchasedate: formData.itempurchasedate?.toISOString()
        })
      });
      const newItemDetail = await response.json();
      setItemDetails((prevDetails) => [...prevDetails, newItemDetail]); // Add to state directly
      setAddDialogOpen(false);
      showSnackbar("ItemDetail added successfully!");
    } catch (error) {
      console.error("Error adding itemdetail:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/itemdetail/${id}`, {
        method: "DELETE"
      });
      setSelectedItemId(selectedItemId); // Refresh
      showSnackbar("ItemDetail deleted successfully!", 'info');
    } catch (error) {
      console.error("Error deleting itemdetail:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="p-6 bg-gray-50 rounded-lg shadow-lg">
        <Typography variant="h5" gutterBottom className="text-center text-indigo-600">
          Select Register and Item
        </Typography>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TextField
            select fullWidth label="Select Register" value={selectedRegisterId}
            onChange={handleRegisterChange} variant="outlined" size="small"
            className="border-2 border-indigo-500">
            {registers.map((reg) => (
              <MenuItem key={reg.id} value={reg.id}>
                {reg.rname}
              </MenuItem>
            ))}
          </TextField>

          {items.length > 0 && (
            <TextField
              select fullWidth label="Select Item" value={selectedItemId}
              onChange={handleItemChange} variant="outlined" size="small"
              className="border-2 border-indigo-500">
              {items.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.itemname}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Box>

        {/* Display the selected item name */}
        {selectedItemName && (
          <Typography variant="h6" className="mb-4 text-center text-gray-800">
            <strong>Selected Item:</strong> {selectedItemName}
          </Typography>
        )}

        {selectedItemId && (
          <Button
            variant="contained"
            color="primary"
            className="mb-6 w-auto py-2 text-white rounded-lg shadow-md hover:bg-indigo-700"
            onClick={handleOpenAddDialog}>
            Add New ItemDetail
          </Button>
        )}

        {itemDetails.length > 0 && (
          <Table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <TableHead>
              <TableRow className="bg-indigo-500 text-white">
                <TableCell className="p-3 text-center">ID</TableCell>
                <TableCell className="p-3 text-center">Quantity</TableCell>
                <TableCell className="p-3 text-center">Issued</TableCell>
                <TableCell className="p-3 text-center">Purchase Date</TableCell>
                <TableCell className="p-3 text-center">Rate/Unit</TableCell>
                <TableCell className="p-3 text-center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemDetails.map((detail) => (
                <TableRow key={detail.id} className="hover:bg-gray-100">
                  <TableCell className="p-3 text-center">{detail.id}</TableCell>
                  <TableCell className="p-3 text-center">{detail.itemquantity}</TableCell>
                  <TableCell className="p-3 text-center">{detail.issuedquantity}</TableCell>
                  <TableCell className="p-3 text-center">{dayjs(detail.itempurchasedate).format('DD/MM/YYYY')}</TableCell>
                  <TableCell className="p-3 text-center">{detail.rateperunit}</TableCell>
                  <TableCell className="p-3 text-center">
                    <IconButton color="primary" onClick={() => handleOpenEditDialog(detail)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(detail.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle className="bg-indigo-500 text-white text-center py-4">
            Edit ItemDetail
          </DialogTitle>
          <DialogContent className="bg-gray-100 p-6">
            <TextField label="Quantity" name="itemquantity" fullWidth margin="dense"
              value={formData.itemquantity} onChange={handleChangeForm} variant="outlined" size="small" />
            <TextField label="Issued Quantity" name="issuedquantity" fullWidth margin="dense"
              value={formData.issuedquantity} onChange={handleChangeForm} variant="outlined" size="small" />
            <DatePicker
              label="Purchase Date"
              value={formData.itempurchasedate}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true, margin: "dense", variant: "outlined" } }}
            />
            <TextField label="Rate/Unit" name="rateperunit" fullWidth margin="dense"
              value={formData.rateperunit} onChange={handleChangeForm} variant="outlined" size="small" />
          </DialogContent>
          <DialogActions className="p-4">
            <Button variant="contained" color="primary" onClick={() => handleSubmitEdit(formData.id)}>
              Save Changes
            </Button>
            <Button variant="outlined" onClick={handleCloseDialog}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={addDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle className="bg-indigo-500 text-white text-center py-4">
            Add New ItemDetail
          </DialogTitle>
          <DialogContent className="bg-gray-100 p-6">
            <TextField label="Quantity" name="itemquantity" fullWidth margin="dense"
              value={formData.itemquantity} onChange={handleChangeForm} variant="outlined" size="small" />
            <TextField label="Issued Quantity" name="issuedquantity" fullWidth margin="dense"
              value={formData.issuedquantity} onChange={handleChangeForm} variant="outlined" size="small" />
            <DatePicker
              label="Purchase Date"
              value={formData.itempurchasedate}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true, margin: "dense", variant: "outlined" } }}
            />
            <TextField label="Rate/Unit" name="rateperunit" fullWidth margin="dense"
              value={formData.rateperunit} onChange={handleChangeForm} variant="outlined" size="small" />
          </DialogContent>
          <DialogActions className="p-4">
            <Button variant="contained" color="primary" onClick={handleSubmitAdd}>
              Add Item
            </Button>
            <Button variant="outlined" onClick={handleCloseDialog}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default AddItemDetail;
