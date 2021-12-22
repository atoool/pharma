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
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Loader } from "component/loader/Loader";
import { AppContext } from "context/AppContext";
import { Add, Delete } from "@mui/icons-material";
import { get, post } from "api/api";
import { useSnackbar } from "notistack";
import { Modal } from "../../component/Modal/Modal";
import { Invoice } from "component/invoice/Invoice";
import { useReactToPrint } from "react-to-print";
import { generateBillNo } from "utils/generateBillNo";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "left",
    height: 60,
    paddingHorizontal: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    textAlign: "left",
    paddingHorizontal: 0,
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
  "Name",
  "Code",
  "Batch",
  "Exp Date",
  "Sale Price",
  "Qty",
  "Amount",
  "Tax",
  "Total",
];

const data = {
  customerName: "",
  doctorName: "",
  outletUserId: "",
  billNo: generateBillNo("SL"),
  scheme: "",
  products: [
    {
      productId: "",
      quantity: "",
      hsnCode: "",
      itemCode: "",
      itemName: "",
      batch: "",
      expDate: "",
      salePrice: "",
      qty: "",
      amount: "",
      tax: "",
      total: "",
    },
  ],
  billAmount: "",
  discAmount: "",
  tax: "",
  roundAmount: "",
  remarks: "",
  balance: "",
  payment: "",
  settlementMode: "",
  inPercent: "",
  inAmount: "",
};

export function Sales() {
  const { userList, userData, productData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [bill, setBill] = React.useState(data);
  const [open, setModal] = React.useState(false);
  const printRef = React.useRef();
  const { enqueueSnackbar } = useSnackbar();

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
    if (itm === "tax" && i !== -1) {
      temp.products[i].tax = e.target.value;
      let tax = (e.target.value ?? 0) / 100;
      tax = (temp.products[i].amount ?? 0) * tax;
      let totalTax = 0;
      temp.products?.map((f) => (totalTax += f?.amount * (f?.tax / 100)));
      temp.tax = totalTax?.toFixed(2) ?? 0;
      const total = tax + (temp.products[i].amount ?? 0);
      temp.products[i].total =
        total === "0" || !total ? total : total?.toFixed(2);
      let rAmount = 0;
      temp.products?.map((f) => (rAmount += parseFloat(f?.total)));
      temp.roundAmount = rAmount ? rAmount?.toFixed(2) : 0;
      setBill(temp);
    } else if (i === -1 && (itm === "outletUserId" || itm === "scheme")) {
      temp[itm] = e;
      setBill(temp);
    } else if (i === -1 && (itm === "in%" || itm === "inAmount")) {
      const t = parseFloat(bill?.billAmount) + parseFloat(bill?.tax);
      temp.roundAmount =
        itm === "in%"
          ? t - bill?.billAmount * (e.target.value / 100)
          : t - e.target.value;
      temp.roundAmount?.toFixed(2);
      itm === "in%"
        ? (temp.inPercent = e.target.value)
        : (temp.inAmount = e.target.value);
      temp.discAmount =
        itm === "in%"
          ? bill?.billAmount * (e.target.value / 100)
          : e.target.value;
      temp.balance =
        temp?.payment && temp?.payment !== ""
          ? temp?.payment - temp.roundAmount
          : t - temp?.discAmount;
      setBill(temp);
    } else if (i === -1 && itm === "payment") {
      temp.balance = e.target.value - bill?.roundAmount;
      temp.payment = e.target.value;
      setBill(temp);
    } else if (i === -1) {
      temp[itm] = e.target.value;
      setBill(temp);
    } else if (itm === "quantity") {
      const v =
        isNaN(e.target.value) || e.target.value?.length === 0
          ? 0
          : JSON.parse(e.target.value);
      if (temp.products[i].stock >= v) {
        temp.products[i].amount = v * temp.products[i].salePrice;
        let total = 0;
        temp.products?.map((f) => (total += f?.amount));
        temp.billAmount = total;
        temp.roundAmount = total - temp.discAmount;
        temp.products[i].quantity =
          e.target.value?.length === 0 ? e.target.value : v;
        let tax = (temp.products[i].tax ?? 0) * 0.01;
        tax = (temp.products[i].amount ?? 0) * tax;
        let totalTax = 0;
        temp.products?.map((f) => (totalTax += f?.amount * f?.tax * 0.01));
        temp.tax = totalTax?.toFixed(2) ?? 0;
        const tota = tax + (temp.products[i].amount ?? 0);
        temp.products[i].total =
          total === "0" || !tota ? tota : tota?.toFixed(2);
        let rAmount = 0;
        temp.products?.map((f) => (rAmount += parseFloat(f?.total)));
        temp.roundAmount = rAmount ? rAmount?.toFixed(2) : 0;
      } else {
        enqueueSnackbar("Quantity should be greater than stock", {
          variant: "error",
        });
      }
      setBill(temp);
    } else if (itm === "productId" || itm === "itemCode") {
      let val = await getProductPrice(e?.id);
      temp.products[i].productId = val?.itemId;
      temp.products[i].salePrice = val?.unitPrice;
      temp.products[i].batch = val?.batch;
      temp.products[i].hsnCode = val?.hsnCode;
      temp.products[i].itemCode = val?.itemCode;
      temp.products[i].expDate = val?.expiry;
      temp.products[i].tax = val?.tax;
      temp.products[i].itemName = val?.itemName;
      temp.products[i].stock = e?.stock;
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
      itemName: "",
      batch: "",
      expDate: "",
      salePrice: "",
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
      const dat = bill;
      await post("add-sales", token, dat).then(() => {
        onAlert("success");
      });
    } catch {
      onAlert("error");
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const handleCloseModal = (action) => {
    if (action === "submit") {
      handlePrint();
    } else {
      setModal(false);
    }
  };

  const onClear = () => {
    setBill({
      customerName: "",
      doctorName: "",
      outletUserId: "",
      billNo: generateBillNo("SL"),
      scheme: "",
      products: [
        {
          productId: "",
          quantity: "",
          hsnCode: "",
          itemCode: "",
          itemName: "",
          batch: "",
          expDate: "",
          salePrice: "",
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

  const keyPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey) {
      onAddRow();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  });

  // const isEmptyProd =
  //   bill?.products?.filter((f) => f?.total == null || f?.total === "")?.length >
  //   0;
  const isLoad = false;
  return (
    <Loader load={isLoad}>
      <Modal
        open={open}
        page="sale"
        handleClose={handleCloseModal}
        renderItem={() => <Invoice ref={printRef} bill={bill} />}
      />
      <Box
        sx={{
          bgcolor: "#FBF7F0",
          p: 2,
          pb: 0,
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
            value?.id && onItemChange(value?.id, -1, "outletUserId")
          }
          options={userList?.map((option) => {
            return { label: option.name, id: option.id };
          })}
          renderInput={(params) => (
            <TextField {...params} label="Outlet User" size="small" />
          )}
        />
        <FormControl size="small" sx={{ width: "15%" }}>
          <InputLabel>Payment Mode</InputLabel>
          <Select
            label="Payment Mode"
            value={bill?.settlementMode}
            onChange={(e) => onItemChange(e, -1, "settlementMode")}
          >
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
          </Select>
        </FormControl>
        <Autocomplete
          sx={{ width: "15%" }}
          isOptionEqualToValue={(option, value) => option === value}
          onChange={(event, value) =>
            value && onItemChange(value, -1, "scheme")
          }
          options={["Regular", "Insurance"]}
          value={bill?.scheme}
          renderInput={(params) => (
            <TextField {...params} label="Scheme" size="small" />
          )}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          bgcolor: "#FBF7F0",
          pl: 2,
        }}
      >
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ padding: 0, fontWeight: "bold" }}>
                Bill Amount
              </TableCell>
              <TableCell
                align="right"
                colSpan={2}
                sx={{ mr: 2, fontWeight: "bold" }}
              >
                {bill?.billAmount}
              </TableCell>
              <TableCell sx={{ padding: 0 }}>Discount Amount</TableCell>
              <TableCell align="right" sx={{ mt: 1, mb: 1 }}>
                <TextField
                  label="IN %"
                  size="small"
                  value={bill?.inPercent}
                  sx={{ width: "70px" }}
                  onChange={(e) => onItemChange(e, -1, "in%")}
                  // disabled={isEmptyProd}
                />
              </TableCell>
              <TableCell align="right" sx={{ mr: 2 }}>
                <TextField
                  label="IN Amount"
                  size="small"
                  value={bill?.inAmount}
                  onChange={(e) => onItemChange(e, -1, "inAmount")}
                  // disabled={isEmptyProd}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ padding: 0, paddingTop: 1, paddingBottom: 1 }}>
                Net. Rate
              </TableCell>
              <TableCell align="right" colSpan={2} sx={{ padding: 0, pr: 2 }}>
                {bill?.roundAmount}
              </TableCell>

              <TableCell sx={{ padding: 0, paddingTop: 1, paddingBottom: 1 }}>
                Payment
              </TableCell>
              <TableCell align="right" colSpan={2} sx={{ padding: 0 }}>
                <TextField
                  label=""
                  size="small"
                  sx={{ width: "120px", mt: 1, mb: 1, mr: 2 }}
                  value={bill?.payment}
                  onChange={(e) => onItemChange(e, -1, "payment")}
                  // disabled={isEmptyProd}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ padding: 0, paddingTop: 1, paddingBottom: 1 }}>
                Balance
              </TableCell>
              <TableCell align="right" colSpan={2} sx={{ padding: 0, pr: 2 }}>
                {bill?.balance}
              </TableCell>

              <TableCell sx={{ padding: 0, paddingTop: 1, paddingBottom: 1 }}>
                Tax
              </TableCell>
              <TableCell align="right" colSpan={2} sx={{ mr: 2 }}>
                {bill?.tax}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ padding: 0 }}>Remarks</TableCell>
              <TableCell sx={{ padding: 0 }} align="right" colSpan={2}>
                <TextField
                  size="small"
                  value={bill?.remarks}
                  sx={{ mt: 1, mb: 1, mr: 2 }}
                  onChange={(e) => onItemChange(e, -1, "remarks")}
                  // disabled={isEmptyProd}
                />
              </TableCell>
              <TableCell colSpan={5}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button variant="contained" onClick={onSubmit} sx={{ mr: 1 }}>
                    Submit
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setModal(true)}
                    sx={{ mr: 1 }}
                  >
                    Print
                  </Button>
                  <Button variant="contained" onClick={onClear}>
                    Clear
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
                <StyledTableCell align="right">
                  <Autocomplete
                    isOptionEqualToValue={(option, value) =>
                      option.label === value.label
                    }
                    value={row?.itemName}
                    onChange={(e, v) =>
                      v?.id && onItemChange(v, ind, "productId")
                    }
                    options={productData?.oStock?.map((option) => {
                      return {
                        label: option.prodName,
                        id: option.wareHouseStockId,
                        stock: option?.stockCount,
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
                <StyledTableCell align="right">
                  {/* <Autocomplete
                    isOptionEqualToValue={(option, value) =>
                      option.label === value.label
                    }
                    value={row?.itemCode}
                    onChange={(e, v) =>
                      v?.id && onItemChange(v?.id, ind, "itemCode")
                    }
                    options={productData?.oStock?.map((option) => {
                      return {
                        label: option.itemCode,
                        id: option.id,
                      };
                    })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ItemCode"
                        size="small"
                        sx={{ minWidth: 120 }}
                      />
                    )}
                  /> */}
                  {row?.itemCode}
                </StyledTableCell>
                <StyledTableCell align="right">{row?.batch}</StyledTableCell>
                <StyledTableCell align="right">{row?.expDate}</StyledTableCell>
                <StyledTableCell align="right">
                  {row?.salePrice}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    label=""
                    size="small"
                    sx={{ width: "70px" }}
                    value={bill?.products[ind].quantity}
                    placeholder={">" + bill?.products[ind].stock}
                    onChange={(e) => onItemChange(e, ind, "quantity")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{row?.amount}</StyledTableCell>
                <StyledTableCell align="right">
                  <FormControl size="small">
                    <Select
                      value={row?.tax}
                      onChange={(e) => onItemChange(e, ind, "tax")}
                    >
                      <MenuItem value="9">9%</MenuItem>
                      <MenuItem value="12">12%</MenuItem>
                      <MenuItem value="16">16%</MenuItem>
                      <MenuItem value="18">18%</MenuItem>
                    </Select>
                  </FormControl>
                </StyledTableCell>
                <StyledTableCell align="right">{row?.total}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Loader>
  );
}
