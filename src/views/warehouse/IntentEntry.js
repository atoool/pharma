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
  Autocomplete,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { get, post } from "api/api";
import { AppContext } from "context/AppContext";
import { useSnackbar } from "notistack";
import { Loader } from "component/loader/Loader";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "left",
    height: 60,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
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

const iData = [
  "Item name",
  "Item Code",
  "Stock",
  "Request qty",
  "Unit price",
  "Amount",
];

export function IntentEntry() {
  const iData2 = {
    requests: [
      {
        productId: "",
        itemCode: "",
        stock: "0",
        quantity: "0",
        unitPrice: "0",
        amount: "0",
        productName: "",
      },
    ],
    outletUserId: "",
    outletUser: "",
    total: "0",
  };
  const { userData, productData } = React.useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const token = userData?.token?.accessToken ?? "";

  const [intents, setIntents] = React.useState(iData2);
  const [userList, setUserList] = React.useState([]);
  const [load, setLoad] = React.useState(true);

  const onUserFetch = async () => {
    setLoad(true);
    try {
      const datas = await get("outlet-users", token);
      datas?.data && setUserList(datas?.data);
      setLoad(false);
    } catch {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    onUserFetch();
  }, []);

  const clear = () => {
    setIntents({
      requests: [
        {
          productId: "",
          itemCode: "",
          stock: "0",
          quantity: "0",
          unitPrice: "0",
          amount: "0",
          productName: "",
        },
      ],
      outletUserId: "",
      outletUser: "",
      total: "0",
    });
  };

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
              total: "0",
            });
            clear();
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
      temp.outletUserId = e?.id;
      temp.outletUser = e?.label;
      setIntents(temp);
    } else if (itm === "quantity") {
      const v =
        isNaN(e.target.value) || e.target.value?.length === 0
          ? 0
          : JSON.parse(e.target.value);
      if (temp.requests[i].stock >= v) {
        temp.requests[i].amount = v * temp.requests[i].unitPrice;
        let total = 0;
        temp.requests?.map((f) => (total += f?.amount));
        temp.total = total;
        temp.requests[i].quantity =
          e.target.value?.length === 0 ? e.target.value : v;
      } else {
        enqueueSnackbar("Quantity should not be greater than stock", {
          variant: "error",
        });
      }
      setIntents(temp);
    } else if (itm === "productId") {
      let val = await getProductPrice(e?.id);
      temp.requests[i].productId = e?.itemId;
      temp.requests[i].productName = e?.label;
      temp.requests[i].unitPrice = val?.unitPrice;
      temp.requests[i].stock = val?.inStockCount;
      temp.requests[i].itemCode = val?.itemCode;
      temp.requests[i].wareHouseStockId = e?.id;
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
  React.useEffect(() => {
    clear();
  }, []);
  return (
    <Loader load={load}>
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
          isOptionEqualToValue={(option, value) =>
            option?.label === value?.label
          }
          onChange={(event, value) =>
            value?.id && handleChange(value, -1, "outletUserId")
          }
          options={userList?.map((option) => {
            return { label: option?.name, id: option?.id };
          })}
          value={intents.outletUser}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Outlet User"
              size="small"
              sx={{ minWidth: 180 }}
            />
          )}
        />
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">
                <Button variant="contained" sx={{ mr: 1 }} onClick={onAddRow}>
                  <Add />
                </Button>
              </StyledTableCell>
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
                      option?.label === value?.label
                    }
                    onChange={(e, v) =>
                      v?.id && handleChange(v, ind, "productId")
                    }
                    value={row?.productName}
                    options={productData?.wStock?.map((option) => {
                      return {
                        itemId: option?.itemId,
                        label: option?.nameExpiry,
                        id: option?.id,
                        stock: option?.stock,
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
                <StyledTableCell align="right">{row?.itemCode}</StyledTableCell>
                <StyledTableCell align="right">{row?.stock}</StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    label=""
                    size="small"
                    sx={{ width: "70px" }}
                    value={row?.quantity}
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
          justifyContent: "flex-end",
        }}
      >
        {/* <TextField label="First Authorization" size="small" />
        <TextField label="Second Authorization" size="small" /> */}
        <Typography size="small">Total: {intents?.total ?? "0"}</Typography>
      </Box>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="contained" sx={{ mr: 1 }} onClick={clear}>
          Clear
        </Button>
        <Button variant="contained" sx={{ mr: 1 }} onClick={onIssue}>
          Create
        </Button>
        {/* <Button variant="contained" sx={{ mr: 1 }} onClick={onPrint}>
          Print
        </Button> */}
      </Box>
    </Loader>
  );
}
