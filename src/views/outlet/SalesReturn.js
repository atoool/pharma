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
  "Code",
  "Name",
  "Batch",
  "Exp Date",
  "Sale Price",
  "Qty",
  "Amount",
  "Tax",
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
      itemCode: "",
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

export function SalesReturn() {
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
      temp.products[i].itemCode = val?.itemCode;
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
      itemCode: "",
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
              itemCode: "",
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
          itemCode: "",
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
      <Box
        sx={{
          bgcolor: "#FBF7F0",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextField
          label="Name"
          size="small"
          value={bill?.customerName}
          onChange={(e) => onItemChange(e, -1, "customerName")}
        />
        <TextField
          label="Doctor"
          size="small"
          value={bill?.doctorName}
          onChange={(e) => onItemChange(e, -1, "doctorName")}
        />
        <Autocomplete
          sx={{ width: "15%" }}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          onChange={(event, value) =>
            value?.id && onUserChange(value?.id, -1, "outletUserId")
          }
          options={userList?.map((option) => {
            return { label: option.name, id: option.id };
          })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Outlet User"
              size="small"
              sx={{ minWidth: 170 }}
            />
          )}
        />
        <TextField
          label="Bill No."
          size="small"
          value={bill?.billNo}
          onChange={(e) => onItemChange(e, -1, "billNo")}
        />
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          aria-label="directions"
          onClick={getSaleDetail}
        >
          <Directions />
        </IconButton>
        <Autocomplete
          sx={{ width: "15%" }}
          isOptionEqualToValue={(option, value) => option === value}
          onChange={(event, value) =>
            value && onUserChange(value, -1, "scheme")
          }
          options={["Regular", "Insurance"]}
          value={bill?.scheme}
          renderInput={(params) => (
            <TextField {...params} label="Scheme" size="small" />
          )}
        />
      </Box>
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
                <StyledTableCell align="right">{row?.itemCode}</StyledTableCell>
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
                        sx={{ minWidth: 180 }}
                      />
                    )}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{row?.batch}</StyledTableCell>
                <StyledTableCell align="right">{row?.expiry}</StyledTableCell>
                <StyledTableCell align="right">
                  {row?.unitPrice}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    label=""
                    size="small"
                    sx={{ width: "70px" }}
                    value={bill?.products[ind].quantity}
                    onChange={(e) => onItemChange(e, ind, "quantity")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{row?.amount}</StyledTableCell>
                <StyledTableCell align="right">{row?.tax}</StyledTableCell>
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
            <TableCell>Discount Amount</TableCell>
            <TableCell align="right">
              <TextField
                label="IN %"
                size="small"
                value={bill?.inPercent}
                sx={{ width: "70px" }}
                onChange={(e) => onItemChange(e, -1, "in%")}
              />
            </TableCell>
            <TableCell align="right">
              <TextField
                label="IN Amount"
                size="small"
                value={bill?.inAmount}
                sx={{ width: "120px" }}
                onChange={(e) => onItemChange(e, -1, "inAmount")}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Round Off</TableCell>
            <TableCell align="right" colSpan={2}>
              {bill?.roundAmount}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Payment</TableCell>
            <TableCell align="right" colSpan={2}>
              <TextField
                label=""
                size="small"
                sx={{ width: "120px" }}
                value={bill?.payment}
                onChange={(e) => onItemChange(e, -1, "payment")}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Balance</TableCell>
            <TableCell align="right" colSpan={2}>
              {bill?.balance}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="right" colSpan={2}>
              18%
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Remarks</TableCell>
            <TableCell align="right" colSpan={2}>
              <TextField
                size="small"
                value={bill?.remarks}
                onChange={(e) => onItemChange(e, -1, "remarks")}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Button size="small" onClick={onSubmit}>
                Submit
              </Button>
            </TableCell>
            <TableCell align="right" colSpan={2}>
              <Button size="small" onClick={onClear}>
                Clear
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Loader>
  );
}
