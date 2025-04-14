import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function AddItem() {
  const navigate = useNavigate();
  const [registers, setRegisters] = useState([]);
  const [selectedRegisterId, setSelectedRegisterId] = useState("");
  const [item, setItem] = useState({ itemname: "", pageno: "", registerId: "" });
  const [message, setMessage] = useState("");

  // Edit Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState({ id: "", itemname: "", pageno: "" });

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/allregister")
      .then((res) => res.json())
      .then((data) => setRegisters(data))
      .catch(() => setMessage("Error fetching registers"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pageno" && !/^\d*$/.test(value)) return;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (item.itemname.trim().length < 3) {
      setMessage("Item name must be at least 3 characters long.");
      return;
    }
    if (!item.pageno.trim()) {
      setMessage("Page number is required.");
      return;
    }
    if (!item.registerId) {
      setMessage("Please select a register.");
      return;
    }

    const newItem = {
      itemname: item.itemname.trim(),
      pageno: item.pageno.trim(),
      register: { id: item.registerId },
    };

    try {
      const response = await fetch("http://localhost:8080/enteritems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        setMessage("Item created successfully!");
        setItem({ itemname: "", pageno: "", registerId: "" });
        setTimeout(() => navigate(0), 1000);
      } else {
        setMessage("Failed to create item!");
      }
    } catch (error) {
      setMessage("Server error!",error);
    }
  };

  const handleClear = () => {
    setItem({ itemname: "", pageno: "", registerId: "" });
    setMessage("");
  };

  const selectedRegister = registers.find((r) => r.id === parseInt(selectedRegisterId));

  const openEditDialog = (itm) => {
    setEditItem({ id: itm.id, itemname: itm.itemname, pageno: itm.pageno });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    const updatedItem = {
      id: editItem.id,
      itemname: editItem.itemname.trim(),
      pageno: editItem.pageno.trim(),
    };

    try {
      const response = await fetch(`http://localhost:8080/updateitem/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        setEditDialogOpen(false);
        setMessage("Item updated successfully!");
        setTimeout(() => navigate(0), 1000);
      } else {
        setMessage("Failed to update item.");
      }
    } catch (error) {
      setMessage("Server error!",error);
    }
  };

  const openDeleteDialog = (itemId) => {
    setDeleteItemId(itemId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/deleteitem/${deleteItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteDialogOpen(false);
        setMessage("Item deleted successfully!");
        setTimeout(() => navigate(0), 1000);
      } else {
        setMessage("Failed to delete item.");
      }
    } catch (error) {
      setMessage("Server error!",error);
    }
  };

  return (
    <Box className="flex flex-col items-center min-h-screen bg-gray-100 py-1">
      <Paper className="p-6 w-[500px] shadow-lg mb-10">
        <Typography variant="h5" className="text-center mb-4 text-blue-600 font-bold">
          Create New Item
        </Typography>

        {message && (
          <Typography
            className={`text-center mb-2 ${
              message.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Item Name"
            name="itemname"
            value={item.itemname}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            className="bg-white rounded-lg"
            inputProps={{ minLength: 3 }}
          />
          <TextField
            label="Page No"
            name="pageno"
            value={item.pageno}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            className="bg-white rounded-lg"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <TextField
            select
            label="Select Register"
            name="registerId"
            value={item.registerId}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            className="bg-white rounded-lg"
          >
            {registers.map((reg) => (
              <MenuItem key={reg.id} value={reg.id}>
                {reg.rname}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: "flex", gap: 2, marginTop: "1rem" }}>
            <Button type="submit" variant="contained" sx={{ flex: 1 }}>➕ Create</Button>
            <Button type="button" variant="outlined" onClick={handleClear} sx={{ flex: 1 }}>🧹 Clear</Button>
          </Box>
        </form>
      </Paper>

      <Divider className="w-full max-w-[800px] mb-6 bg-amber-300 h-1" />

      <Box className="w-full max-w-[800px] px-4 mt-6">
        <TextField
          select
          label="View Items of Register"
          value={selectedRegisterId}
          onChange={(e) => setSelectedRegisterId(e.target.value)}
          fullWidth
          className="bg-white rounded-lg mb-4"
        >
          {registers.map((reg) => (
            <MenuItem key={reg.id} value={reg.id}>
              {reg.rname}
            </MenuItem>
          ))}
        </TextField>

        {selectedRegister && selectedRegister.item.length > 0 ? (
          <Paper elevation={3} className="rounded-xl overflow-hidden">
          <Table className="min-w-full">
            <TableHead className="bg-blue-100">
              <TableRow>
                <TableCell className="font-bold text-blue-700">Item Name</TableCell>
                <TableCell className="font-bold text-blue-700">Page No</TableCell>
                <TableCell className="font-bold text-blue-700" align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedRegister.item.map((itm, index) => (
                <TableRow
                  key={itm.id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} transition duration-200 hover:bg-blue-50`}
                >
                  <TableCell className="text-gray-800">{itm.itemname}</TableCell>
                  <TableCell className="text-gray-800">{itm.pageno}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => openEditDialog(itm)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => openDeleteDialog(itm.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        
        ) : selectedRegisterId ? (
          <Typography className="text-center text-gray-500 mt-4">
            No items found in selected register.
          </Typography>
        ) : null}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Item Name"
            value={editItem.itemname}
            onChange={(e) => setEditItem({ ...editItem, itemname: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Page No"
            value={editItem.pageno}
            onChange={(e) => setEditItem({ ...editItem, pageno: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddItem;
