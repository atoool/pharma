/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import {
  IconButton,
  Button,
  TextField,
  Divider,
  TablePagination,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Modal } from "component/Modal/Modal";
import { get, post } from "api/api";
import { AppContext } from "context/AppContext";
import capitalizeFirstLetter from "utils/capitalizeFirstLetter";
import { Loader } from "component/loader/Loader";
import { useSnackbar } from "notistack";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 15,
    fontWeight: "bold",
    height: 60,
    padding: 2,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 2,
    textAlign: "left",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.secondary.main,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const data = {
  name: "",
  address: "",
  phone: "",
  email: "",
  gstno: "",
  pancard: "",
};
const values = ["Name", "Address", "Phone", "Email", "GST", "PanCard"];

export function Vendors() {
  const { userData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  let [vendor, setVendor] = React.useState(data);

  const onAddVendor = async () => {
    try {
      await post("new-vendor", token, vendor);
    } catch {}
  };

  const handleChange = (e, itm) => {
    const temp = { ...vendor };
    temp[itm] = e.target.value;
    setVendor(temp);
  };
  return (
    <Loader>
      {Object.keys(data)?.map((f, i) => (
        <TextField
          key={i}
          required
          label={values[i]}
          size="small"
          sx={{ m: 2 }}
          value={vendor[f] ?? ""}
          onChange={(txt) => handleChange(txt, f)}
        />
      ))}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mr: 10,
        }}
      >
        <Button variant="contained" color="primary" onClick={onAddVendor}>
          Add
        </Button>
      </Box>
    </Loader>
  );
}
