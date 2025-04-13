import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Alert } from "@mui/material";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Button, IconButton, Collapse, Box
} from "@mui/material";
import { Delete, Edit, ExpandMore, ExpandLess } from "@mui/icons-material";
function RegisterDetails() {
  const [registers, setRegisters] = useState([]);
   const [expandedId, setExpandedId] = useState(null);
   const [message, setMessage] = useState("");
   const location = useLocation();
   const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || "");
   useEffect(() => {
     fetch("http://localhost:8080/allregister")
       .then((res) => res.json())
       .then((data) => setRegisters(data))
       .catch(() => setMessage("Error fetching registers"));
   }, []);
 
   const handleDelete = async (id) => {
     if (window.confirm("Are you sure you want to delete this register?")) {
       try {
         const response = await fetch(`http://localhost:8080/reg/del/${id}`, { method: "DELETE" });
         if (response.ok) {
           setRegisters(registers.filter((reg) => reg.id !== id));
           setMessage("Register deleted successfully!");
         } else {
           setMessage("Delete failed!");
         }
       } catch (error) {
         console.error("Error deleting register:", error);
         setMessage("Server error!");
       }
     }
   };
 
   return (
     <Box sx={{ p: 4 }}>
       <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", color: "primary.main" }}>
         Manage Registers
       </Typography>
 
       {message && <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>{message}</Typography>}
 
       <Button variant="contained" color="success" component={Link} to="/register/create" sx={{ mb: 2 }}>
         + Create Register
       </Button>
       {successMessage && (
  <Alert severity="success" onClose={() => setSuccessMessage("")} sx={{ mb: 2 }}>
    {successMessage}
  </Alert>
)}
       <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
         <Table>
           <TableHead>
             <TableRow sx={{ bgcolor: "#1976d2" }}>
               <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
               <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
               <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
               <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
               <TableCell sx={{ color: "white", fontWeight: "bold" }}>Details</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {registers.map((register) => (
               <React.Fragment key={register.id}>
                 <TableRow>
                   <TableCell>{register.id}</TableCell>
                   <TableCell>{register.rname}</TableCell>
                   <TableCell>{register.rdisc}</TableCell>
                   <TableCell>
                     <IconButton color="primary" component={Link} to={`/register/edit/${register.id}`}>
                       <Edit />
                     </IconButton>
                     <IconButton color="error" onClick={() => handleDelete(register.id)}>
                       <Delete />
                     </IconButton>
                   </TableCell>
                   <TableCell>
                     <IconButton onClick={() => setExpandedId(expandedId === register.id ? null : register.id)}>
                       {expandedId === register.id ? <ExpandLess /> : <ExpandMore />}
                     </IconButton>
                   </TableCell>
                 </TableRow>
 
                 {/* Expandable Row for Items, Item Details, and Item Issues */}
                 <TableRow>
                   <TableCell colSpan={5} sx={{ p: 0 }}>
                     <Collapse in={expandedId === register.id} timeout="auto" unmountOnExit>
                       <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
                         <Typography variant="h6">📦 Items:</Typography>
                         {register.item && register.item.length > 0 ? (
                           <TableContainer component={Paper} sx={{ mt: 2 }}>
                             <Table>
                               <TableHead>
                                 <TableRow sx={{ bgcolor: "#d1e0ff" }}>
                                   <TableCell><b>Item Name</b></TableCell>
                                   <TableCell><b>Page No.</b></TableCell>
                                 </TableRow>
                               </TableHead>
                               <TableBody>
                                 {register.item.map((item) => (
                                   <React.Fragment key={item.id}>
                                     <TableRow>
                                       <TableCell>{item.itemname}</TableCell>
                                       <TableCell>{item.pageno}</TableCell>
                                     </TableRow>
 
                                     {/* Item Details Table */}
                                     {item.itemdetail && item.itemdetail.length > 0 && (
                                       <TableRow>
                                         <TableCell colSpan={2}>
                                           <Typography variant="subtitle1" sx={{ mt: 1, ml: 2 }}>📝 Item Details:</Typography>
                                           <Table sx={{ ml: 2 }}>
                                             <TableHead>
                                               <TableRow sx={{ bgcolor: "#f0f0f0" }}>
                                                 <TableCell>Quantity</TableCell>
                                                 <TableCell>Issued Quantity</TableCell>
                                                 <TableCell>Remaning Quantity</TableCell>
                                                 <TableCell>Purchase Date</TableCell>
                                                 <TableCell>Rate per Unit</TableCell>
                                               </TableRow>
                                             </TableHead>
                                             <TableBody>
                                               {item.itemdetail.map((detail) => (
                                                 <TableRow key={detail.id}>
                                                   <TableCell>{detail.itemquantity}</TableCell>
                                                   <TableCell>{detail.issuedquantity}</TableCell>
                                                   <TableCell>{(detail.itemquantity || 0) - (detail.issuedquantity || 0)}</TableCell>
                                                   <TableCell>{new Date(detail.itempurchasedate).toLocaleDateString()}</TableCell>
                                                   <TableCell>₹{detail.rateperunit}</TableCell>
                                                 </TableRow>
                                               ))}
                                             </TableBody>
                                           </Table>
                                         </TableCell>
                                       </TableRow>
                                     )}
 
                                     {/* Item Issues Table */}
                                     {item.itemdetail && item.itemdetail.some(d => d.itemissue.length > 0) && (
                                       <TableRow>
                                         <TableCell colSpan={2}>
                                           <Typography variant="subtitle1" sx={{ mt: 1, ml: 2 }}>📤 Item Issues:</Typography>
                                           <Table sx={{ ml: 2 }}>
                                             <TableHead>
                                               <TableRow sx={{ bgcolor: "#f0f0f0" }}>
                                                 <TableCell>Issued To</TableCell>
                                                 <TableCell>Issue Date</TableCell>
                                                 <TableCell>Return From</TableCell>
                                                 <TableCell>Return Date</TableCell>
                                                 <TableCell>Quantity</TableCell>
                                               </TableRow>
                                             </TableHead>
                                             <TableBody>
                                               {item.itemdetail.flatMap(detail =>
                                                 detail.itemissue.map((issue) => (
                                                   <TableRow key={issue.id}>
                                                     <TableCell>{issue.issuedto || "N/A"}</TableCell>
                                                     <TableCell>{issue.issuedate ? new Date(issue.issuedate).toLocaleDateString() : "N/A"}</TableCell>
                                                     <TableCell>{issue.returnfrom || "N/A"}</TableCell>
                                                     <TableCell>{issue.returndate ? new Date(issue.returndate).toLocaleDateString() : "N/A"}</TableCell>
                                                     <TableCell>{issue.issuequan}</TableCell>
                                                   </TableRow>
                                                 ))
                                               )}
                                             </TableBody>
                                           </Table>
                                         </TableCell>
                                       </TableRow>
                                     )}
                                   </React.Fragment>
                                 ))}
                               </TableBody>
                             </Table>
                           </TableContainer>
                         ) : (
                           <Typography>No items available</Typography>
                         )}
                       </Box>
                     </Collapse>
                   </TableCell>
                 </TableRow>
               </React.Fragment>
             ))}
           </TableBody>
         </Table>
       </TableContainer>
     </Box>
   );
}

export default RegisterDetails