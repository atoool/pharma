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
  RadioGroup,
  Radio,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import { Loader } from "component/loader/Loader";
import { AppContext } from "context/AppContext";
import { Add, Delete, Directions } from "@mui/icons-material";
import { get, post } from "api/api";
import { useSnackbar } from "notistack";
import { generateBillNo } from "utils/generateBillNo";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "right",
    height: 60,
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 5,
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
  "Packing",
  "MRP",
  "Rate",
  "Amount",
  "Discount",
  "Tax",
  "Net Rate",
];

export function PurchaseEntry() {
  const data = {
    vendorId: "",
    vendor: "",
    department: "",
    deptName: "",
    invoiceDate: "",
    invoiceNumber: "",
    transactionDate: "",
    is_cash: "0",
    is_donate: "1",
    billAmount: "",
    discount: "",
    payableAmount: "",
    grnNumber: generateBillNo("GRN"),
    items: [
      {
        itemId: "",
        itemName: "",
        batch: "",
        packing: "",
        expiry: "",
        quantity: "",
        case: "",
        mrp: "",
        unitPrice: "",
        amount: "",
        discount: "",
        tax: "",
        netRate: "",
      },
    ],
  };
  const { userData, productData, vendors, dept } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [order, setOrder] = React.useState(data);
  const [isLoad, setLoad] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const onItemChange = async (e, i, itm) => {
    let temp = { ...order };
    if (i === -1 && (itm === "vendor" || itm === "department")) {
      temp[itm === "vendor" ? "vendor" : "deptName"] = e?.label;
      temp[itm === "vendor" ? "vendorId" : "department"] = e?.id;
      setOrder(temp);
    } else if (i === -1 && itm === "is_cash") {
      temp.is_cash = "1";
      temp.is_donate = "0";
      setOrder(temp);
    } else if (i === -1 && itm === "is_donate") {
      temp.is_donate = "1";
      temp.is_cash = "0";
      setOrder(temp);
    } else if (i === -1 && itm === "discount") {
      const disc = order?.billAmount * (e.target.value / 100);
      temp.payableAmount = order?.billAmount - disc;
      temp.discount = e.target.value;
      setOrder(temp);
    } else if (i === -1 && itm === "payableAmount") {
      temp.payableAmount = e.target.value - order?.payableAmount;
      setOrder(temp);
    } else if (i === -1) {
      temp[itm] = e.target.value;
      setOrder(temp);
    } else if (itm === "unitPrice" || itm === "quantity") {
      const taxAmt = parseFloat(temp.items[i].tax) / 100;
      const v = e.target.value;
      const itmAlt = itm === "unitPrice" ? "quantity" : "unitPrice";
      temp.items[i].amount = v * temp.items[i][itmAlt];
      temp.items[i].netRate =
        parseFloat(v * temp.items[i][itmAlt]) ??
        0 - parseFloat(temp.items[i].discount) ??
        0 + taxAmt ??
        0;
      let total = 0;
      temp.items?.map((f) => (total += f?.netRate));
      temp.billAmount = total;
      temp.payableAmount = total;
      temp.items[i][itm] = v > 0 ? v : "";
      setOrder(temp);
    } else if (itm === "discount") {
      const v = e.target.value;
      let netRat =
        (temp.items[i].tax !== "" ? parseFloat(temp.items[i].tax) : 0) -
        (v !== "" ? parseFloat(v) : 0) +
        (temp?.items[i].amount !== "" ? parseFloat(temp?.items[i].amount) : 0);
      temp.items[i].netRate = netRat;

      temp.items[i][itm] = v;
      let total = 0;
      temp.items?.map((f) => (total += f?.netRate));
      temp.billAmount = total;
      temp.payableAmount = total;
      setOrder(temp);
    } else if (itm === "tax") {
      const v = e.target.value;

      const disc =
        temp.items[i].discount !== "" ? parseFloat(temp.items[i].discount) : 0;
      const amt =
        temp?.items[i].amount !== "" ? parseFloat(temp?.items[i].amount) : 0;
      const tx = v !== "" ? amt * v * 0.01 : 0;
      let netRat = amt + tx - disc;
      temp.items[i].netRate = netRat;

      temp.items[i][itm] = v;

      let total = 0;
      temp.items?.map((f) => (total += f?.netRate));
      temp.billAmount = total;
      temp.payableAmount = total;
      setOrder(temp);
    } else if (itm === "productId") {
      temp.items[i].itemId = e?.id;
      temp.items[i].itemName = e?.label;
      setOrder(temp);
    } else {
      temp.items[i][itm] = e.target.value;
      setOrder(temp);
    }
  };

  const onAddRow = () => {
    let temp = { ...order };
    temp.items.push({
      itemId: "",
      batch: "",
      packing: "",
      expiry: "",
      quantity: "",
      unitPrice: "",
      amount: "",
      discount: "",
      tax: "",
      netRate: "",
    });
    setOrder(temp);
  };

  const onDeleteRow = (id) => {
    let temp = { ...order };
    temp.items = order?.items.filter((f, i) => i !== id);
    setOrder(temp);
  };

  const onPurchase = async () => {
    try {
      setLoad(true);
      const dat = order;
      await post("new-purchase", token, dat).then(() => {
        onAlert("success");
        onClear();
      });
      setLoad(false);
    } catch {
      onAlert("error");
      setLoad(false);
    }
  };

  const onClear = () => {
    setOrder({
      vendorId: "",
      vendor: "",
      department: "",
      deptName: "",
      invoiceDate: "",
      invoiceNumber: "",
      transactionDate: "",
      is_cash: "",
      is_donate: "",
      billAmount: "",
      discount: "",
      payableAmount: "",
      grnNumber: generateBillNo("GRN"),
      items: [
        {
          itemId: "",
          itemName: "",
          batch: "",
          packing: "",
          expiry: "",
          quantity: "",
          case: "",
          mrp: "",
          unitPrice: "",
          amount: "",
          discount: "",
          tax: "",
          netRate: "",
        },
      ],
    });
  };

  const onAlert = (v) => {
    const variant = { variant: v };
    v === "success" && enqueueSnackbar("Success", variant);
    v === "error" &&
      enqueueSnackbar("Failed! something went wrong, try again", variant);
  };

  React.useEffect(() => {
    onClear();
  }, []);

  return (
    <Loader load={isLoad}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          bgcolor: "#FBF7F0",
          justifyContent: "space-between",
          alignItems: "center",
          pl: 2,
          pr: 2,
          pt: 1,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            required
            label={"Invoice No."}
            type={"text"}
            sx={{ mb: 2 }}
            size="small"
            value={order?.invoiceNumber ?? ""}
            onChange={(txt) => onItemChange(txt, -1, "invoiceNumber")}
          />
          <TextField
            required
            label={"Invoice Date"}
            type={"date"}
            InputLabelProps={{ shrink: true }}
            size="small"
            value={order?.invoiceDate ?? ""}
            onChange={(txt) => onItemChange(txt, -1, "invoiceDate")}
          />
        </Box>
        <Box>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            onChange={(e, v) => v?.id && onItemChange(v, -1, "vendor")}
            value={order?.vendor}
            options={vendors?.map((option) => {
              return {
                label: option.name,
                id: option.id,
              };
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Vendor"
                size="small"
                sx={{ width: 230, mb: 2 }}
              />
            )}
          />
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            onChange={(e, v) => v?.id && onItemChange(v, -1, "department")}
            value={order?.deptName}
            options={dept?.map((option) => {
              return {
                label: option.name,
                id: option.id,
              };
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Department"
                size="small"
                sx={{ width: 230 }}
              />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            required
            label={"GRN Number"}
            sx={{ mb: 2 }}
            type={"text"}
            InputLabelProps={{ shrink: true }}
            size="small"
            disabled
            value={order?.grnNumber ?? ""}
          />
          <TextField
            required
            label={"Transaction Date"}
            type={"date"}
            size="small"
            InputLabelProps={{ shrink: true }}
            value={order?.transactionDate ?? ""}
            onChange={(txt) => onItemChange(txt, -1, "transactionDate")}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <RadioGroup name="radio-buttons-group">
            <FormControlLabel
              value={order?.is_cash}
              checked={order?.is_cash === "1"}
              onChange={(e) => onItemChange(e, -1, "is_cash")}
              control={<Radio />}
              label="Cash Purchase"
            />
            <FormControlLabel
              value={order?.is_donate}
              checked={order?.is_donate === "1"}
              control={<Radio />}
              onChange={(e) => onItemChange(e, -1, "is_donate")}
              label="Donation Purchase"
            />
          </RadioGroup>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Table sx={{ mt: 1, width: "50%" }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ pt: 0.5, pb: 0.5 }}>Bill Amount</TableCell>
                <TableCell align="right" colSpan={2} sx={{ pt: 0.5, pb: 0.5 }}>
                  {order?.billAmount}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ pt: 0.5, pb: 0.5 }}>Discount</TableCell>
                <TableCell align="right" sx={{ pt: 0.5, pb: 0.5 }}>
                  <TextField
                    label="IN %"
                    size="small"
                    value={order?.discount}
                    sx={{ width: "70px" }}
                    onChange={(e) => onItemChange(e, -1, "discount")}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ pt: 0.5, pb: 0.5 }}>Payable amount</TableCell>
                <TableCell align="right" colSpan={2} sx={{ pt: 0.5, pb: 0.5 }}>
                  {order?.payableAmount}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ pt: 0.5, pb: 0.5 }}>Remark</TableCell>
                <TableCell align="right" colSpan={2} sx={{ pt: 0.5, pb: 0.5 }}>
                  <TextField
                    required
                    label={"Remarks"}
                    size="small"
                    value={order?.remark ?? ""}
                    onChange={(txt) => onItemChange(txt, -1, "remark")}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box
            sx={{
              p: 1,
              display: "flex",
              height: "10%",
              width: "50%",
              alignSelf: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="contained" sx={{ mr: 1 }} onClick={onClear}>
              CLEAR
            </Button>
            <Button variant="contained" sx={{ mr: 1 }} onClick={onPurchase}>
              SAVE
            </Button>
          </Box>
        </Box>
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
            {order?.items?.map((row, ind) => (
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
                      v?.id && onItemChange(v, ind, "productId")
                    }
                    value={row?.itemName}
                    options={productData?.master?.map((option) => {
                      return {
                        label: option.name,
                        id: option.id,
                      };
                    })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Item"
                        size="small"
                        sx={{ minWidth: 180 }}
                      />
                    )}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    size="small"
                    value={row?.batch}
                    sx={{ width: "70px" }}
                    onChange={(e) => onItemChange(e, ind, "batch")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    size="small"
                    type="date"
                    value={row?.expiry}
                    sx={{ minWidth: "150px" }}
                    onChange={(e) => onItemChange(e, ind, "expiry")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    label=""
                    size="small"
                    sx={{ width: "70px" }}
                    value={order?.items[ind].quantity}
                    onChange={(e) => onItemChange(e, ind, "quantity")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    label=""
                    size="small"
                    sx={{ width: "70px" }}
                    value={order?.items[ind].packing}
                    onChange={(e) => onItemChange(e, ind, "packing")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    label=""
                    size="small"
                    sx={{ width: "70px" }}
                    value={order?.items[ind].mrp}
                    onChange={(e) => onItemChange(e, ind, "mrp")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    size="small"
                    value={row?.unitPrice}
                    sx={{ width: "70px" }}
                    onChange={(e) => onItemChange(e, ind, "unitPrice")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{row?.amount}</StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    size="small"
                    value={row?.discount}
                    sx={{ width: "70px" }}
                    onChange={(e) => onItemChange(e, ind, "discount")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <FormControl size="small" sx={{ width: "90px" }}>
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
                <StyledTableCell align="right">{row?.netRate}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Loader>
  );
}
