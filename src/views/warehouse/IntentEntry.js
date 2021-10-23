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
import { Autocomplete, Button, IconButton, TextField } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { get, post } from "api/api";
import { AppContext } from "context/AppContext";
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

const iData = ["Item name", "Stock", "Request qty", "Unit price", "Amount"];
const iData2 = {
  requests: [
    {
      productId: "",
      stock: "0",
      quantity: "0",
      unitPrice: "0",
      amount: "0",
    },
  ],
  outletUserId: "",
  total: "",
};

export function IntentEntry() {
  const { userData, productData } = React.useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const token = userData?.token?.accessToken ?? "";

  const [intents, setIntents] = React.useState(iData2);
  const [userList, setUserList] = React.useState([]);

  const onUserFetch = async () => {
    try {
      const datas = await get("outlet-users", token);
      datas?.data && setUserList(datas?.data);
    } catch {}
  };

  React.useEffect(() => {
    onUserFetch();
  }, []);

  const onIssue = async () => {
    try {
      const dat = intents;
      if (dat?.outletUserId === "" || dat?.total === "") {
        onAlert("error");
      } else {
        await post("add-product-to-outlet", token, dat)
          .then(() => {
            onAlert("success");
            setIntents({
              requests: [],
              outletUserId: intents.outletUserId,
              total: "",
            });
          })
          .catch(() => {
            onAlert("error");
          });
      }
    } catch {}
  };

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

  const onAddRow = () => {
    let temp = { ...intents };
    temp.requests.push({
      productId: "",
      stock: "0",
      quantity: "0",
      unitPrice: "0",
      amount: "0",
    });
    setIntents(temp);
  };

  const onDeleteRow = (id) => {
    let temp = { ...intents };
    temp.requests = intents?.requests?.filter((f, i) => i !== id);
    setIntents({ ...temp });
  };

  const handleChange = async (e, i, itm) => {
    let temp = { ...intents };
    console.warn(itm);
    if (i === -1) {
      temp.outletUserId = e;
      setIntents(temp);
    } else if (itm === "quantity") {
      console.warn(e.target.value);
      const v = isNaN(e.target.value) ? 0 : JSON.parse(e.target.value);
      temp.requests[i].amount = v * temp.requests[i].unitPrice;
      let total = 0;
      temp.requests?.map((f) => (total += f?.amount));
      temp.total = total;
      temp.requests[i].quantity = v;
      setIntents(temp);
    } else if (itm === "productId") {
      temp.requests[i].productId = e;
      let val = await getProductPrice(e);
      console.warn(val);
      temp.requests[i].unitPrice = val?.unitPrice;
      temp.requests[i].stock = val?.inStockCount;
      setIntents(temp);
    } else {
      temp.requests[i][itm] = e.target.value;
      setIntents(temp);
    }
  };

  const onPrint = () => {
    window.print();
  };

  const onAlert = (v) => {
    const variant = { variant: v };
    v === "success" && enqueueSnackbar("Success", variant);
    v === "error" &&
      enqueueSnackbar("Failed! something went wrong, try again", variant);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          bgcolor: "#FBF7F0",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Autocomplete
          sx={{ width: "15%" }}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          onChange={(event, value) =>
            value?.id && handleChange(value?.id, -1, "outletUserId")
          }
          options={userList?.map((option) => {
            return { label: option.name, id: option.id };
          })}
          renderInput={(params) => (
            <TextField {...params} label="Outlet User" size="small" />
          )}
        />
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Action</StyledTableCell>
              {iData.map((itm, i) => (
                <StyledTableCell key={i} align="right">
                  {itm}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {intents?.requests.map((row, ind) => (
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
                      v?.id && handleChange(v?.id, ind, "productId")
                    }
                    options={productData?.map((option) => {
                      return {
                        label: option.name,
                        id: option.id,
                      };
                    })}
                    renderInput={(params) => (
                      <TextField {...params} label="Product" size="small" />
                    )}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{row?.stock}</StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    label=""
                    size="small"
                    sx={{ width: "70px" }}
                    onChange={(e) => handleChange(e, ind, "quantity")}
                  />
                </StyledTableCell>

                <StyledTableCell align="right">
                  {row?.unitPrice}
                </StyledTableCell>
                <StyledTableCell align="right">{row?.amount}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextField label="First Authorization" size="small" />
        <TextField label="Second Authorization" size="small" />
        <TextField
          label="Total Amount"
          disabled
          value={intents?.total ?? ""}
          size="small"
        />
      </Box>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="contained" sx={{ mr: 1 }} onClick={onAddRow}>
          Add row
        </Button>
        <Button variant="contained" sx={{ mr: 1 }} onClick={onIssue}>
          Create
        </Button>
        <Button variant="contained" sx={{ mr: 1 }} onClick={onPrint}>
          Print
        </Button>
      </Box>
    </Box>
  );
}
