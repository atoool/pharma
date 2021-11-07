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
import { Add, Delete, Directions } from "@mui/icons-material";
import { get, post } from "api/api";
import { useSnackbar } from "notistack";

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

const head = [
  "Item",
  "Batch",
  "Expiry",
  "Qty",
  "Rate",
  "Amount",
  "Discount",
  "Tax",
  "Net Rate",
];

const billNo = "";

const data = {
  customerName: "",
  doctorName: "",
  outletUserId: "",
  billNo,
  scheme: "",
  products: [
    {
      productId: "",
      quantity: "",
      hsnCode: "",
      name: "",
      batch: "",
      expiry: "",
      unitPrice: "",
      qty: "",
      amount: "",
      tax: "",
    },
  ],
  billAmount: "",
  discAmount: "",
  tax: "",
  roundAmount: "",
  remarks: "",
  balance: "",
  payment: "",
  inPercent: "",
  inAmount: "",
};

export function PurchaseEntry() {
  const { userList, userData, productData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [bill, setBill] = React.useState(data);
  const { enqueueSnackbar } = useSnackbar();

  const onUserChange = () => {};

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

  const onItemChange = async (e, i, itm) => {
    let temp = { ...bill };
    if (i === -1 && (itm === "outletUserId" || itm === "scheme")) {
      temp[itm] = e;
      setBill(temp);
    } else if (i === -1 && (itm === "in%" || itm === "inAmount")) {
      temp.roundAmount =
        itm === "in%"
          ? bill?.billAmount - bill?.billAmount * (e.target.value / 100)
          : bill?.billAmount - e.target.value;
      itm === "in%"
        ? (temp.inPercent = e.target.value)
        : (temp.inAmount = e.target.value);
      setBill(temp);
    } else if (i === -1 && itm === "payment") {
      temp.balance = e.target.value - bill?.roundAmount;
      temp.payment = e.target.value;
      setBill(temp);
    } else if (i === -1) {
      temp[itm] = e.target.value;
      setBill(temp);
    } else if (itm === "quantity") {
      const v = isNaN(e.target.value) ? 0 : JSON.parse(e.target.value);
      temp.products[i].amount = v * temp.products[i].unitPrice;
      let total = 0;
      temp.products?.map((f) => (total += f?.amount));
      temp.billAmount = total;
      temp.products[i].quantity = v;
      setBill(temp);
    } else if (itm === "productId") {
      temp.products[i].productId = e;
      let val = await getProductPrice(e);
      temp.products[i].unitPrice = val?.unitPrice === "0" ? 10 : val?.unitPrice;
      temp.products[i].batch = val?.batch;
      temp.products[i].hsnCode = val?.hsnCode;
      temp.products[i].expiry = val?.expiry;
      temp.products[i].tax = 0;
      setBill(temp);
    } else {
      temp.products[i][itm] = e.target.value;
      setBill(temp);
    }
  };

  const onAddRow = () => {
    let temp = { ...bill };
    temp.products.push({
      productId: "",
      quantity: "",
      hsnCode: "",
      name: "",
      batch: "",
      expiry: "",
      unitPrice: "",
      qty: "",
      amount: "",
      tax: "",
    });
    setBill(temp);
  };

  const onDeleteRow = (id) => {
    let temp = { ...bill };
    temp.products = bill?.products.filter((f, i) => i !== id);
    setBill(temp);
  };

  const onSubmit = async () => {
    try {
      bill.salesId = bill?.id;
      const dat = bill;
      console.warn(dat);
      await post("sales-return", token, dat).then(() => {
        onAlert("success");
        setBill({
          customerName: "",
          doctorName: "",
          outletUserId: "",
          billNo,
          scheme: "",
          products: [
            {
              productId: "",
              quantity: "",
              hsnCode: "",
              name: "",
              batch: "",
              expiry: "",
              unitPrice: "",
              qty: "",
              amount: "",
              tax: "",
            },
          ],
          billAmount: "",
          discAmount: "",
          tax: "",
          roundAmount: "",
          remarks: "",
          balance: "",
          payment: "",
          inPercent: "",
          inAmount: "",
        });
      });
    } catch {
      onAlert("error");
    }
  };

  const onClear = () => {
    setBill({
      customerName: "",
      doctorName: "",
      outletUserId: "",
      billNo,
      scheme: "",
      products: [
        {
          productId: "",
          quantity: "",
          hsnCode: "",
          name: "",
          batch: "",
          expiry: "",
          unitPrice: "",
          qty: "",
          amount: "",
          tax: "",
        },
      ],
      billAmount: "",
      discAmount: "",
      tax: "",
      roundAmount: "",
      remarks: "",
      balance: "",
      payment: "",
      inPercent: "",
      inAmount: "",
    });
  };

  const onAlert = (v) => {
    const variant = { variant: v };
    v === "success" && enqueueSnackbar("Success", variant);
    v === "error" &&
      enqueueSnackbar("Failed! something went wrong, try again", variant);
  };

  const getSaleDetail = async () => {
    try {
      await get("sales-details/" + bill?.billNo, token).then((res) => {
        onAlert("success");
        let dat = res?.data?.response;
        console.warn(dat);
        if (dat) {
          dat?.products?.map((f, i) => {
            return (dat.products[i].amount = f?.unitPrice * f?.quantity);
          });
          setBill({ ...dat });
        }
      });
    } catch {
      onAlert("error");
    }
  };

  const isLoad = false;
  return (
    <Loader load={isLoad}>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">
                <Button variant="contained" color="primary" onClick={onAddRow}>
                  <Add />
                </Button>
              </StyledTableCell>
              {head.map((itm, i) => (
                <StyledTableCell key={i} align="right">
                  {itm}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bill?.products?.map((row, ind) => (
              <StyledTableRow key={ind}>
                <StyledTableCell align="right">
                  <IconButton color="primary" onClick={() => onDeleteRow(ind)}>
                    <Delete />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Autocomplete
                    isOptionEqualToValue={(option, value) =>
                      option.label === value.label
                    }
                    onChange={(e, v) =>
                      v?.id && onItemChange(v?.id, ind, "productId")
                    }
                    options={productData?.map((option) => {
                      return {
                        label: option.name,
                        id: option.id,
                      };
                    })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Product"
                        size="small"
                        sx={{ width: 130 }}
                      />
                    )}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{row?.batch}</StyledTableCell>
                <StyledTableCell align="right">{row?.expiry}</StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    label=""
                    size="small"
                    sx={{ width: "70px" }}
                    value={bill?.products[ind].quantity}
                    onChange={(e) => onItemChange(e, ind, "quantity")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row?.unitPrice}
                </StyledTableCell>
                <StyledTableCell align="right">{row?.amount}</StyledTableCell>
                <StyledTableCell align="right">{row?.discount}</StyledTableCell>
                <StyledTableCell align="right">{row?.tax}</StyledTableCell>
                <StyledTableCell align="right">{row?.amount}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell rowSpan={9} />
            <TableCell rowSpan={9} />
            <TableCell rowSpan={9} />
            <TableCell rowSpan={9} />
            <TableCell rowSpan={9} />
            <TableCell rowSpan={9} />
            <TableCell rowSpan={9} />
            <TableCell rowSpan={9} />
          </TableRow>
          <TableRow>
            <TableCell>Bill Amount</TableCell>
            <TableCell align="right" colSpan={2}>
              {bill?.billAmount}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Discount</TableCell>
            <TableCell align="right">
              <TextField
                label="IN %"
                size="small"
                value={bill?.inPercent}
                sx={{ width: "70px" }}
                onChange={(e) => onItemChange(e, -1, "in%")}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Payable amount</TableCell>
            <TableCell align="right" colSpan={2}>
              {bill?.roundAmount}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="contained" sx={{ mr: 1 }}>
          SAVE
        </Button>
      </Box>
    </Loader>
  );
}
