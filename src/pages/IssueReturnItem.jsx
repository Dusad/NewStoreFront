import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Snackbar, Alert, Paper, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';

const IssueReturnItem = () => {
  const [items, setItems] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);
  const [issueHistory, setIssueHistory] = useState([]);

  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItemDetailId, setSelectedItemDetailId] = useState(null); // New state for itemdetailId

  const [tabValue, setTabValue] = useState(0);
  const [issueForm, setIssueForm] = useState({
    issuequan: '', // Changed from issueQuan
    issuedto: '',  // Changed from issueto
    issuedate: dayjs()
  });
  const [returnForm, setReturnForm] = useState({
    retrunquan: '', // Changed from returnQuan (note the typo to match API)
    returnfrom: '', // Changed from returnFrom
    returndate: dayjs()
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [currentItemForDialog, setCurrentItemForDialog] = useState(null);

  // Fetch all items on component mount
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await fetch("http://localhost:8080/allitems");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchAllItems();
  }, []);

  // Fetch item details and issue history when item is selected
  useEffect(() => {
    const fetchData = async () => {
      if (selectedItemId) {
        try {
          // Find the selected item from the items list
          const selectedItem = items.find(item => item.id === selectedItemId);
          if (selectedItem) {
            setItemDetails(selectedItem.itemdetail);
            setIssueHistory(
              selectedItem.itemdetail.flatMap(detail => 
                detail.itemissue.map(issue => ({
                  ...issue,
                  itemDetailId: detail.id
                }))
              )
            );
            setSelectedItemName(selectedItem.itemname);
            
            // Set the first item detail ID as default
            if (selectedItem.itemdetail.length > 0) {
              setSelectedItemDetailId(selectedItem.itemdetail[0].id);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [selectedItemId, items]);

  // const handleItemClick = (itemId) => {
  //   setSelectedItemId(itemId);
  // };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleIssueChange = (e) => {
    const { name, value } = e.target;
    setIssueForm(prev => ({ ...prev, [name]: value }));
  };

  const handleReturnChange = (e) => {
    const { name, value } = e.target;
    setReturnForm(prev => ({ ...prev, [name]: value }));
  };

  const handleIssueDateChange = (newValue) => {
    setIssueForm(prev => ({ ...prev, issuedate: newValue }));
  };

  const handleReturnDateChange = (newValue) => {
    setReturnForm(prev => ({ ...prev, returndate: newValue }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleIssueSubmit = async () => {
    if (!selectedItemDetailId) {
      showSnackbar("Please select an item detail first", 'error');
      return;
    }

    try {
      const issueDate = issueForm.issuedate.format('YYYY-MM-DDTHH:mm:ss');
      const response = await fetch("http://localhost:8080/issueitem", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issuequan: issueForm.issuequan,
          issuedto: issueForm.issuedto,
          issuedate: issueDate,
          itemdetailId: selectedItemDetailId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to issue item');
      }
      
      // Refresh data
      const refreshResponse = await fetch("http://localhost:8080/allitems");
      const refreshData = await refreshResponse.json();
      setItems(refreshData);
      
      showSnackbar("Item issued successfully!");
      setIssueForm({ 
        issuequan: '', 
        issuedto: '', 
        issuedate: dayjs() 
      });
    } catch (error) {
      console.error("Error issuing item:", error);
      showSnackbar("Failed to issue item", 'error');
    }
  };

  const handleReturnSubmit = async () => {
    if (!selectedItemDetailId) {
      showSnackbar("Please select an item detail first", 'error');
      return;
    }

    try {
      const returnDate = returnForm.returndate.format('YYYY-MM-DDTHH:mm:ss');
      const response = await fetch("http://localhost:8080/returnitem", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          retrunquan: returnForm.retrunquan,
          returnfrom: returnForm.returnfrom,
          returndate: returnDate,
          itemdetailId: selectedItemDetailId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to return item');
      }
      
      // Refresh data
      const refreshResponse = await fetch("http://localhost:8080/allitems");
      const refreshData = await refreshResponse.json();
      setItems(refreshData);
      
      showSnackbar("Item returned successfully!");
      setReturnForm({ 
        retrunquan: '', 
        returnfrom: '', 
        returndate: dayjs() 
      });
    } catch (error) {
      console.error("Error returning item:", error);
      showSnackbar("Failed to return item", 'error');
    }
  };

  // Open stock dialog for a specific item
  const openStockDialog = (item) => {
    setCurrentItemForDialog(item);
    setStockDialogOpen(true);
    // Set the item as selected
    setSelectedItemId(item.id);
    setSelectedItemName(item.itemname);
  };

  // Open history dialog for a specific item
  const openHistoryDialog = () => {
    setHistoryDialogOpen(true);
  };

  const filteredItems = items.filter(item => 
    item.itemname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.registername && item.registername.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="p-6 bg-gray-50 rounded-lg shadow-lg">
        <Typography variant="h5" gutterBottom className="text-center text-indigo-600">
          Item Issue/Return Management
        </Typography>

        {/* Search Bar */}
        <TextField
          label="Search Items"
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

        {/* Items Table */}
        <Paper elevation={3} className="mb-6 overflow-auto">
          <Table>
            <TableHead>
              <TableRow className="bg-indigo-100">
                <TableCell className="font-semibold">S.No.</TableCell>
                <TableCell className="font-semibold">Item Name</TableCell>
                <TableCell className="font-semibold">Register Name</TableCell>
                <TableCell className="font-semibold">Page No.</TableCell>
                <TableCell className="font-semibold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item, index) => (
                <TableRow 
                  key={item.id} 
                  hover
                  className={`${selectedItemId === item.id ? 'bg-indigo-50' : ''}`}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.itemname}</TableCell>
                  <TableCell>{item.registername || 'N/A'}</TableCell>
                  <TableCell>{item.pageno?.join(', ') || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<InventoryIcon />}
                      onClick={() => openStockDialog(item)}
                    >
                      Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {selectedItemName && (
          <Typography variant="h6" className="mb-4 text-center text-gray-800">
            <strong>Selected Item:</strong> {selectedItemName}
          </Typography>
        )}

        {selectedItemId && (
          <Box className="mb-6">
            <Tabs value={tabValue} onChange={handleTabChange} className="mb-4">
              <Tab label="Issue Item" />
              <Tab label="Return Item" />
            </Tabs>

            {/* Item Detail Selection Dropdown */}
            {itemDetails.length > 0 && (
              <Box className="mb-4">
                <TextField
                  select
                  label="Select Item Detail"
                  value={selectedItemDetailId || ''}
                  onChange={(e) => setSelectedItemDetailId(e.target.value)}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  {itemDetails.map((detail) => (
                    <option key={detail.id} value={detail.id}>
                      ID: {detail.id} | Total: {detail.itemquantity} | Available: {detail.itemquantity - detail.issuedquantity} | Rate: {detail.rateperunit}
                    </option>
                  ))}
                </TextField>
              </Box>
            )}

            {tabValue === 0 ? (
              <Paper elevation={3} className="p-4 mb-6">
                <Typography variant="subtitle1" className="mb-4 text-indigo-600">
                  Issue New Item
                </Typography>
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Quantity to Issue"
                    name="issuequan"
                    type="number"
                    value={issueForm.issuequan}
                    onChange={handleIssueChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Issue To (Person/Department)"
                    name="issuedto"
                    value={issueForm.issuedto}
                    onChange={handleIssueChange}
                    fullWidth
                    required
                  />
                  <DatePicker
                    label="Issue Date"
                    value={issueForm.issuedate}
                    onChange={handleIssueDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true
                      }
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  className="mt-4"
                  onClick={handleIssueSubmit}
                  disabled={!issueForm.issuequan || !issueForm.issuedto || !selectedItemDetailId}
                >
                  Issue Item
                </Button>
              </Paper>
            ) : (
              <Paper elevation={3} className="p-4 mb-6">
                <Typography variant="subtitle1" className="mb-4 text-indigo-600">
                  Return Item
                </Typography>
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Quantity to Return"
                    name="retrunquan"
                    type="number"
                    value={returnForm.retrunquan}
                    onChange={handleReturnChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Return From (Person/Department)"
                    name="returnfrom"
                    value={returnForm.returnfrom}
                    onChange={handleReturnChange}
                    fullWidth
                    required
                  />
                  <DatePicker
                    label="Return Date"
                    value={returnForm.returndate}
                    onChange={handleReturnDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true
                      }
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  className="mt-4"
                  onClick={handleReturnSubmit}
                  disabled={!returnForm.retrunquan || !returnForm.returnfrom || !selectedItemDetailId}
                >
                  Return Item
                </Button>
              </Paper>
            )}
          </Box>
        )}

        {/* Stock Dialog */}
        <Dialog
          open={stockDialogOpen}
          onClose={() => setStockDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Stock Details - {currentItemForDialog?.itemname}
              </Typography>
              <IconButton onClick={() => setStockDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {itemDetails.length > 0 && (
              <Table className="mb-4">
                <TableHead>
                  <TableRow className="bg-indigo-100">
                    <TableCell className="font-semibold">ID</TableCell>
                    <TableCell className="font-semibold">Total Quantity</TableCell>
                    <TableCell className="font-semibold">Issued Quantity</TableCell>
                    <TableCell className="font-semibold">Available</TableCell>
                    <TableCell className="font-semibold">Purchase Date</TableCell>
                    <TableCell className="font-semibold">Rate/Unit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell>{detail.id}</TableCell>
                      <TableCell>{detail.itemquantity}</TableCell>
                      <TableCell>{detail.issuedquantity}</TableCell>
                      <TableCell>{detail.itemquantity - detail.issuedquantity}</TableCell>
                      <TableCell>{dayjs(detail.itempurchasedate).format('DD/MM/YYYY')}</TableCell>
                      <TableCell>{detail.rateperunit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HistoryIcon />}
                onClick={openHistoryDialog}
              >
                View Transaction History
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStockDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* History Dialog */}
        <Dialog
          open={historyDialogOpen}
          onClose={() => setHistoryDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Transaction History - {currentItemForDialog?.itemname}
              </Typography>
              <IconButton onClick={() => setHistoryDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {issueHistory.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow className="bg-indigo-100">
                    <TableCell className="font-semibold">Type</TableCell>
                    <TableCell className="font-semibold">Quantity</TableCell>
                    <TableCell className="font-semibold">Person/Dept</TableCell>
                    <TableCell className="font-semibold">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {issueHistory.map((item, index) => (
                    <TableRow key={`${item.id}-${index}`}>
                      <TableCell>
                        {item.issuedto ? 'Issue' : 'Return'}
                      </TableCell>
                      <TableCell>{item.issuequan || item.retrunquan}</TableCell>
                      <TableCell>
                        {item.issuedto || item.returnfrom}
                      </TableCell>
                      <TableCell>
                        {dayjs(item.issuedate || item.returndate).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body1" className="text-center py-4">
                No transaction history available for this item.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHistoryDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={() => setSnackbar({ open: false, message: '' })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ open: false, message: '' })} 
            severity={snackbar.severity}
            className="shadow-lg"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default IssueReturnItem;