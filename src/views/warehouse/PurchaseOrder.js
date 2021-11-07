import React from "react";
import { Box, styled } from "@mui/system";
import {
  Autocomplete,
  Button,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  TextField,
  TableContainer,
  IconButton,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Loader } from "component/loader/Loader";
import { AppContext } from "context/AppContext";
import { Add, Delete, Directions, Visibility } from "@mui/icons-material";
import { get, post } from "api/api";
import { useSnackbar } from "notistack";
import { Modal } from "component/Modal/Modal";
import Tables from "../../component/table/Tables";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "right",
    height: 60,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
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

const head = ["PO Date", "Vendor", "Created User"];
const head2 = ["Item", "Code", "Qty", "Amount", "Net Rate"];
const keys = ["poDate", "vendorName", "user"];
const keys2 = ["name", "hsnCode", "quantity", "amount", "unitPrice"];
const data = {
  poDate: "",
  vendorName: "",
  user: "",
  products: [
    {
      productId: "",
      quantity: "",
      hsnCode: "",
      name: "",
      batch: "",
      expiry: "",
      unitPrice: "",
      amount: "",
      tax: "",
    },
  ],
};

export function PurchaseOrder() {
  const { userData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [orders, setOrders] = React.useState(data);
  const [open, setOpen] = React.useState(false);

  const getProductPrice = async (id) => {
    try {
      const dat = await get("get-product-price/" + id, token);

      return (
        dat?.data?.response ?? {
          inStockCount: "0",
          unitPrice: "0",
        }
      );
    } catch {}
  };

  const renderModalItem = () => {
    return <Tables head={head2} keys={keys2} data={orders?.products} />;
  };

  const onViewItem = () => {
    setOpen(true);
  };

  const isLoad = false;
  return (
    <Loader load={isLoad}>
      <Modal
        open={open}
        title={"Order items"}
        show={false}
        handleClose={() => {
          setOpen(false);
        }}
        renderItem={renderModalItem}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          bgcolor: "#FBF7F0",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <TextField
          label="Vendor search"
          size="small"
          sx={{ mr: 2 }}
          // onChange={(e) => onItemChange(e, -1, "ordersNo")}
        />
        <TextField
          label="PO Date"
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
          type="date"
          // onChange={(e) => onItemChange(e, -1, "ordersNo")}
        />
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Action</StyledTableCell>
              {head.map((itm, i) => (
                <StyledTableCell key={i} align="right">
                  {itm}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.products?.map((row, ind) => (
              <StyledTableRow key={ind}>
                <StyledTableCell align="right">
                  <IconButton color="primary" onClick={onViewItem}>
                    <Visibility />
                  </IconButton>
                </StyledTableCell>
                {Object.keys(keys).map((f, i) => (
                  <StyledTableCell align="right" key={i}>
                    {row[f]}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Loader>
  );
}
