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
  "Rate",
  "Amount",
  "Discount",
  "Tax",
  "Net Rate",
];

const data = {
  distributor: "",
  is_cash: "0",
  is_donate: "1",
  billAmount: "",
  discount: "",
  payableAmount: "",
  items: [
    {
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
    },
  ],
};

export function PurchaseEntry() {
  const { userData, productData, vendors } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [order, setOrder] = React.useState(data);
  const [isLoad, setLoad] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const onItemChange = async (e, i, itm) => {
    let temp = { ...order };
    if (i === -1 && itm === "distributor") {
      temp.distributor = e?.label;
      temp.distributorId = e?.id;
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
      const v = e.target.value;
      const itmAlt = itm === "unitPrice" ? "quantity" : "unitPrice";
      temp.items[i].amount = v * temp.items[i][itmAlt];
      temp.items[i].netRate =
        parseFloat(v * temp.items[i][itmAlt]) ??
        0 - parseFloat(temp.items[i].discount) ??
        0 + parseFloat(temp.items[i].tax) ??
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
      let netRat =
        (v !== "" ? parseFloat(v) : 0) -
        (temp.items[i].discount !== ""
          ? parseFloat(temp.items[i].discount)
          : 0) +
        (temp?.items[i].amount !== "" ? parseFloat(temp?.items[i].amount) : 0);
      temp.items[i].netRate = netRat;

      temp.items[i][itm] = v;

      let total = 0;
      temp.items?.map((f) => (total += f?.netRate));
      temp.billAmount = total;
      temp.payableAmount = total;
      setOrder(temp);
    } else if (itm === "productId") {
      temp.items[i].itemId = e;
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
      distributor: "",
      is_cash: "",
      is_donate: "",
      billAmount: "",
      discount: "",
      payableAmount: "",
      items: [
        {
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
        }}
      >
        <Box>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            onChange={(e, v) => v?.id && onItemChange(v, -1, "distributor")}
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
                sx={{ width: 230 }}
              />
            )}
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
                  <TextField
                    size="small"
                    value={row?.tax}
                    sx={{ width: "70px" }}
                    onChange={(e) => onItemChange(e, ind, "tax")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{row?.netRate}</StyledTableCell>
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
              {order?.billAmount}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Discount</TableCell>
            <TableCell align="right">
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
            <TableCell>Payable amount</TableCell>
            <TableCell align="right" colSpan={2}>
              {order?.payableAmount}
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
        <Button variant="contained" sx={{ mr: 1 }} onClick={onClear}>
          CLEAR
        </Button>
        <Button variant="contained" sx={{ mr: 1 }} onClick={onPurchase}>
          SAVE
        </Button>
      </Box>
    </Loader>
  );
}
