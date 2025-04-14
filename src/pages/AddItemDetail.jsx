import React, { useState, useEffect } from 'react';
import {
  TextField, MenuItem, Box, Typography, Button, Table,
  TableBody, TableCell, TableHead, TableRow, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AddItemDetail = () => {
  const [registers, setRegisters] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedRegisterId, setSelectedRegisterId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");

  const [itemDetail, setItemDetail] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemquantity: '',
    issuedquantity: '',
    itempurchasedate: '',
    rateperunit: ''
  });

  useEffect(() => {
    fetch("http://localhost:8080/allregister")
      .then(res => res.json())
      .then(data => setRegisters(data))
      .catch(err => console.error("Error fetching registers:", err));
  }, []);

  useEffect(() => {
    if (selectedRegisterId) {
      fetch(`http://localhost:8080/reg/item/${selectedRegisterId}`)
        .then(res => res.json())
        .then(data => setItems(data))
        .catch(err => console.error("Error fetching items:", err));
    }
  }, [selectedRegisterId]);

  useEffect(() => {
    if (selectedItemId) {
      fetch(`http://localhost:8080/itemdetailbyitemid/${selectedItemId}`)
        .then(res => res.json())
        .then(data => {
          setItemDetail(data);
          const foundItem = items.find(item => item.id === selectedItemId);
          setSelectedItemName(foundItem?.itemname || '');
        })
        .catch(err => console.error("Error fetching item detail:", err));
    }
  }, [selectedItemId]);

  const handleRegisterChange = (e) => {
    setSelectedRegisterId(e.target.value);
    setSelectedItemId("");
    setItems([]);
    setItemDetail(null);
  };

  const handleItemChange = (e) => {
    setSelectedItemId(e.target.value);
  };

  const handleOpenEditDialog = () => {
    setFormData({
      itemquantity: itemDetail.itemquantity,
      issuedquantity: itemDetail.issuedquantity,
      itempurchasedate: itemDetail.itempurchasedate,
      rateperunit: itemDetail.rateperunit
    });
    setEditDialogOpen(true);
  };

  const handleOpenAddDialog = () => {
    setFormData({
      itemquantity: '',
      issuedquantity: '',
      itempurchasedate: '',
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = () => {
    fetch(`http://localhost:8080/itemdetail/${itemDetail.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        item: { id: selectedItemId }
      })
    })
      .then(() => {
        setEditDialogOpen(false);
        setSelectedItemId(selectedItemId); // refresh
      });
  };

  const handleSubmitAdd = () => {
    fetch("http://localhost:8080/itemdetail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        item: { id: selectedItemId }
      })
    })
      .then(() => {
        setAddDialogOpen(false);
        setSelectedItemId(selectedItemId); // refresh
      });
  };

  const handleDelete = () => {
    if (itemDetail?.id) {
      fetch(`http://localhost:8080/itemdetail/${itemDetail.id}`, {
        method: "DELETE"
      }).then(() => {
        setItemDetail(null);
      });
    }
  };

  return (
    <Box className="p-4">
      <Typography variant="h6">Select Register and Item</Typography>

      <TextField
        select label="Select Register" fullWidth margin="normal"
        value={selectedRegisterId} onChange={handleRegisterChange}
      >
        {registers.map(reg => (
          <MenuItem key={reg.id} value={reg.id}>{reg.rname}</MenuItem>
        ))}
      </TextField>

      {items.length > 0 && (
        <TextField
          select label="Select Item" fullWidth margin="normal"
          value={selectedItemId} onChange={handleItemChange}
        >
          {items.map(item => (
            <MenuItem key={item.id} value={item.id}>{item.itemname}</MenuItem>
          ))}
        </TextField>
      )}

      {itemDetail && (
        <Box className="mt-4">
          <Typography variant="h6">Item Details</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Issued</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Rate/Unit</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{itemDetail.id}</TableCell>
                <TableCell>{itemDetail.itemquantity}</TableCell>
                <TableCell>{itemDetail.issuedquantity}</TableCell>
                <TableCell>{itemDetail.itempurchasedate}</TableCell>
                <TableCell>{itemDetail.rateperunit}</TableCell>
                <TableCell>
                  <IconButton onClick={handleOpenEditDialog} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDelete} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      )}

      {selectedItemId && (
        <Button variant="contained" className="mt-4" onClick={handleOpenAddDialog}>
          Add New ItemDetail
        </Button>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Edit ItemDetail</DialogTitle>
        <DialogContent>
          <TextField label="Item ID" fullWidth margin="dense" value={selectedItemId} disabled />
          <TextField label="Item Name" fullWidth margin="dense" value={selectedItemName} disabled />
          <TextField label="Quantity" name="itemquantity" fullWidth margin="dense" value={formData.itemquantity} onChange={handleChangeForm} />
          <TextField label="Issued Quantity" name="issuedquantity" fullWidth margin="dense" value={formData.issuedquantity} onChange={handleChangeForm} />
          <TextField label="Purchase Date" name="itempurchasedate" fullWidth margin="dense" value={formData.itempurchasedate} onChange={handleChangeForm} />
          <TextField label="Rate/Unit" name="rateperunit" fullWidth margin="dense" value={formData.rateperunit} onChange={handleChangeForm} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitEdit}>Save</Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add New ItemDetail</DialogTitle>
        <DialogContent>
          <TextField label="Item ID" fullWidth margin="dense" value={selectedItemId} disabled />
          <TextField label="Item Name" fullWidth margin="dense" value={selectedItemName} disabled />
          <TextField label="Quantity" name="itemquantity" fullWidth margin="dense" value={formData.itemquantity} onChange={handleChangeForm} />
          <TextField label="Issued Quantity" name="issuedquantity" fullWidth margin="dense" value={formData.issuedquantity} onChange={handleChangeForm} />
          <TextField label="Purchase Date" name="itempurchasedate" fullWidth margin="dense" value={formData.itempurchasedate} onChange={handleChangeForm} />
          <TextField label="Rate/Unit" name="rateperunit" fullWidth margin="dense" value={formData.rateperunit} onChange={handleChangeForm} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitAdd}>Add</Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddItemDetail;