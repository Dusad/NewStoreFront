import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, IconButton, List, ListItem, ListItemText, MenuItem, Paper
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const AddItemDetail = () => {
  const [registers, setRegisters] = useState([]);
  const [items, setItems] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);

  const [selectedRegisterId, setSelectedRegisterId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemName, setSelectedItemName] = useState('');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [deleteItemDetailId, setDeleteItemDetailId] = useState(null);

  const [formData, setFormData] = useState({
    itemquantity: '',
    issuedquantity: '',
    itempurchasedate: null,
    rateperunit: ''
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    if (selectedRegisterId) {
      const fetchItems = async () => {
        try {
          const response = await fetch(`http://localhost:8080/reg/item/${selectedRegisterId}`);
          const data = await response.json();
          setItems(data);
          setSelectedItemName('');
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };
      fetchItems();
    }
    setSelectedItemId('');
    setItemDetails([]);
  }, [selectedRegisterId]);

  useEffect(() => {
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

    if (selectedItemId) {
      fetchItemDetails();
    }
  }, [selectedItemId, items]);

  const handleRegisterChange = (e) => {
    setSelectedRegisterId(e.target.value);
  };

  const handleItemChange = (itemId) => {
    setSelectedItemId(itemId);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenEditDialog = (detail) => {
    setFormData({
      id: detail.id,
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
    setConfirmDeleteDialogOpen(false);
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
      await fetch(`http://localhost:8080/updateitemdetail/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          itempurchasedate: formData.itempurchasedate?.toISOString(),
          item: { id: selectedItemId }
        })
      });
      setEditDialogOpen(false);
      const response = await fetch(`http://localhost:8080/itemdetailbyitemid/${selectedItemId}`);
      const data = await response.json();
      setItemDetails(data);
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
      await response.json();
      setAddDialogOpen(false);
      const newResponse = await fetch(`http://localhost:8080/itemdetailbyitemid/${selectedItemId}`);
      const newData = await newResponse.json();
      setItemDetails(newData);
      showSnackbar("ItemDetail added successfully!");
    } catch (error) {
      console.error("Error adding itemdetail:", error);
    }
  };

  const handleDelete = (id) => {
    setDeleteItemDetailId(id);
    setConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:8080/deleteitemdetail/${deleteItemDetailId}`, {
        method: "DELETE"
      });
      setConfirmDeleteDialogOpen(false);
      const response = await fetch(`http://localhost:8080/itemdetailbyitemid/${selectedItemId}`);
      const data = await response.json();
      setItemDetails(data);
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
            select 
            fullWidth 
            label="Select Register" 
            value={selectedRegisterId}
            onChange={handleRegisterChange} 
            variant="outlined" 
            size="small"
            className="border-2 border-indigo-500"
          >
            {registers.map((reg, index) => (
              <MenuItem key={reg.id} value={reg.id}>
                {index + 1}. {reg.rname}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {items.length > 0 && (
          <Box className="mb-6">
            <TextField
              label="Search Item"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              fullWidth
              className="mb-4 flex items-center p-2 rounded-md border-2 border-indigo-500 shadow-sm"
              InputProps={{
                startAdornment: (
                  <SearchIcon className="text-indigo-500 mr-2" />
                )
              }}
            />
            <List className="max-h-80 overflow-auto border-2 border-gray-300 rounded-lg shadow-lg">
              {items
                .filter(item => item.itemname.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((item, index) => (
                  <ListItem 
                    key={item.id} 
                    onClick={() => handleItemChange(item.id)} 
                    className="hover:bg-indigo-100"
                  >
                    <ListItemText 
                      primary={`${index + 1}. ${item.itemname}`} 
                      secondary={`Page: ${item.pageno || 'N/A'}`} 
                    />
                  </ListItem>
                ))}
            </List>
          </Box>
        )}

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
            onClick={handleOpenAddDialog}
          >
            Add New ItemDetail
          </Button>
        )}

        {itemDetails.length > 0 && (
          <Paper elevation={3} className="overflow-x-auto rounded-lg shadow-lg">
            <Table className="min-w-full bg-white">
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
          </Paper>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Edit ItemDetail</DialogTitle>
          <DialogContent>
            <TextField label="Quantity" name="itemquantity" fullWidth margin="dense"
              value={formData.itemquantity} onChange={handleChangeForm} variant="outlined" size="small" />
            <TextField label="Issued Quantity" name="issuedquantity" fullWidth margin="dense"
              value={formData.issuedquantity} onChange={handleChangeForm} variant="outlined" size="small" />
            <DatePicker
              label="Purchase Date"
              value={formData.itempurchasedate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "dense",
                  variant: "outlined"
                }
              }}
            />
            <TextField label="Rate per Unit" name="rateperunit" fullWidth margin="dense"
              value={formData.rateperunit} onChange={handleChangeForm} variant="outlined" size="small" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
            <Button onClick={() => handleSubmitEdit(formData.id)} color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={addDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Add ItemDetail</DialogTitle>
          <DialogContent>
            <TextField label="Quantity" name="itemquantity" fullWidth margin="dense"
              value={formData.itemquantity} onChange={handleChangeForm} variant="outlined" size="small" />
            <TextField label="Issued Quantity" name="issuedquantity" fullWidth margin="dense"
              value={formData.issuedquantity} onChange={handleChangeForm} variant="outlined" size="small" />
            <DatePicker
              label="Purchase Date"
              value={formData.itempurchasedate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "dense",
                  variant: "outlined"
                }
              }}
            />
            <TextField label="Rate per Unit" name="rateperunit" fullWidth margin="dense"
              value={formData.rateperunit} onChange={handleChangeForm} variant="outlined" size="small" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
            <Button onClick={handleSubmitAdd} color="primary">Add</Button>
          </DialogActions>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <Dialog open={confirmDeleteDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this item detail?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
            <Button onClick={confirmDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ open: false, message: '' })}>
          <Alert onClose={() => setSnackbar({ open: false, message: '' })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default AddItemDetail;