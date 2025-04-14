import { useEffect, useState } from "react";
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
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, Description, MenuBook, LibraryBooks } from "@mui/icons-material";

function AddItem() {
  const [registers, setRegisters] = useState([]);
  const [selectedRegisterId, setSelectedRegisterId] = useState("");
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({ itemname: "", pageno: "", registerId: "" });
  const [message, setMessage] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState({ id: "", itemname: "", pageno: "", register: { id: "" } });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/allregister")
      .then((res) => res.json())
      .then((data) => setRegisters(data))
      .catch(() => setMessage("Error fetching registers"));
  }, []);

  useEffect(() => {
    if (selectedRegisterId) {
      fetch(`http://localhost:8080/reg/${selectedRegisterId}`)
        .then((res) => res.json())
        .then((data) => setItems(data.item || []))
        .catch(() => setMessage("Error fetching items"));
    } else {
      setItems([]);
    }
  }, [selectedRegisterId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pageno" && !/^\d*$/.test(value)) return;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (item.itemname.trim().length < 3) return setMessage("Item name must be at least 3 characters long.");
    if (!item.pageno.trim()) return setMessage("Page number is required.");
    if (!item.registerId) return setMessage("Please select a register.");

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
        const createdItem = await response.json();
        setMessage("Item created successfully!");
        setItem({ itemname: "", pageno: "", registerId: "" });

        if (item.registerId === selectedRegisterId) {
          setItems(prevItems => [...prevItems, createdItem]);
        }
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

  const openEditDialog = (itm) => {
    setEditItem({ id: itm.id, itemname: itm.itemname, pageno: itm.pageno, register: { id: itm.register?.id || "" } });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    const updatedItem = {
      id: editItem.id,
      itemname: editItem.itemname.trim(),
      pageno: editItem.pageno.trim(),
      register: { id: editItem.register.id }
    };

    try {
      const response = await fetch(`http://localhost:8080/item/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        setEditDialogOpen(false);
        setMessage("Item updated successfully!");
        setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
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
      const response = await fetch(`http://localhost:8080/item/del/${deleteItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteDialogOpen(false);
        setMessage("Item deleted successfully!");
        setItems(prevItems => prevItems.filter(item => item.id !== deleteItemId));
      } else {
        setMessage("Failed to delete item.");
      }
    } catch (error) {
      setMessage("Server error!",error);
    }
  };

  return (
    <Box className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-white py-6 px-2">
      <Snackbar open={!!message} autoHideDuration={3000} onClose={() => setMessage("")}>
        <Alert onClose={() => setMessage("")} severity={message.toLowerCase().includes("success") ? "success" : "error"} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      <Paper elevation={6} className="p-6 w-[500px] shadow-xl rounded-2xl bg-gradient-to-tr from-white to-blue-50 mb-10">
        <Typography variant="h5" className="text-center mb-4 text-blue-700 font-bold">
          Create New Item
        </Typography>

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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description color="primary" />
                </InputAdornment>
              ),
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MenuBook color="primary" />
                </InputAdornment>
              ),
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LibraryBooks color="primary" />
                </InputAdornment>
              ),
            }}
          >
            {registers.map((reg) => (
              <MenuItem key={reg.id} value={reg.id}>
                {reg.rname}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: "flex", gap: 2, marginTop: "1rem" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                flex: 1,
                background: "linear-gradient(to right, #4facfe, #00f2fe)",
                color: "white",
                '&:hover': {
                  background: "linear-gradient(to right, #43e97b, #38f9d7)",
                },
              }}
            >
              ➕ Create
            </Button>
            <Button type="button" variant="outlined" onClick={handleClear} sx={{ flex: 1 }}>
              🧹 Clear
            </Button>
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

        {selectedRegisterId && (
          <Paper elevation={3} className="rounded-xl overflow-hidden">
            <Table className="min-w-full">
              <TableHead className="bg-blue-100">
                <TableRow>
                  <TableCell className="font-bold text-blue-700">Item Name</TableCell>
                  <TableCell className="font-bold text-blue-700">Page No</TableCell>
                  <TableCell className="font-bold text-blue-700" align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length > 0 ? (
                  items.map((itm, index) => (
                    <TableRow
                      key={itm.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } transition duration-300 ease-in-out hover:scale-[1.01] hover:bg-blue-50`}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                      No items found in selected register.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField label="Item Id" value={editItem.id} fullWidth margin="normal" disabled />
          <TextField label="Item Name" value={editItem.itemname} onChange={(e) => setEditItem({ ...editItem, itemname: e.target.value })} fullWidth margin="normal" />
          <TextField label="Page No" value={editItem.pageno} onChange={(e) => setEditItem({ ...editItem, pageno: e.target.value })} fullWidth margin="normal" />
          <TextField
            select
            label="Select Register"
            value={editItem.register.id || ""}
            onChange={(e) => setEditItem({ ...editItem, register: { id: e.target.value } })}
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
