import React from "react";
import { Box } from "@mui/system";
import {
  TextField,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Button,
  TableBody,
  Autocomplete,
  tableCellClasses,
} from "@mui/material";
import { Loader } from "component/loader/Loader";
import { AppContext } from "../../context/AppContext";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { get, post } from "api/api";
import { Modal } from "component/Modal/Modal";
import Tables from "../../component/table/Tables";
import { useSnackbar } from "notistack";
import { generateBillNo } from "utils/generateBillNo";
import styled from "@emotion/styled";

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
    padding: 0,
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
const keys = ["createdAt", "distributor", "createdUser"];
const keys2 = ["name", "itemCode", "quantity", "amount", "unitPrice"];
const data = [
  {
    createdAt: "",
    distributor: "",
    createdUser: "",
    items: [
      {
        productId: "",
        quantity: "",
        itemCode: "",
        name: "",
        batch: "",
        expiry: "",
        unitPrice: "",
        amount: "",
        tax: "",
      },
    ],
  },
];

const head3 = [
  "Vendor",
  "Department",
  "PODate",
  "Subject",
  "Packing",
  "Delivery Schedule",
  "Delivery Address",
];

const data2 = {
  vendorId: "",
  departmentId: "",
  poDate: "",
  subject: "",
  packing: "",
  deliverySchedule: "",
  deliveryAddress: "",
};

const data3 = {
  vendorId: "",
  departmentId: "",
  poDate: "",
  subject: "",
  packing: "",
  deliverySchedule: "",
  deliveryAddress: "",
  items: [
    {
      itemCode: "",
      itemName: "",
      quantity: "",
      mrp: "",
      rate: "",
      amt: "",
      tax: "",
      taxAmount: "",
    },
  ],
  prNumber: generateBillNo("PR"),
};

export function PurchaseOrder() {
  const { userData, vendors, dept, productData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [orders, setOrders] = React.useState(data);
  const [ordersTemp, setOrdersTemp] = React.useState(data);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [isLoad, setLoad] = React.useState(true);
  const [orderNum, setOrderNum] = React.useState(0);
  const [page, setPage] = React.useState("product");
  const [pIndex, setPIndex] = React.useState(0);
  const [purchase, setPurchase] = React.useState({});
  const [requests, setRequests] = React.useState(data3);
  const { enqueueSnackbar } = useSnackbar();

  const getOrders = async () => {
    try {
      setLoad(true);
      const dat = await get("purchase-order", token);
      const temp = dat?.data?.response ?? [];
      setOrders([...temp]);
      setOrdersTemp([...temp]);
      setLoad(false);
    } catch {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    getOrders().catch(() => {});
  }, []);

  const renderModalItem = () => (
    <Tables head={head2} keys={keys2} data={ordersTemp[orderNum]?.items} />
  );

  const onViewItem = (i) => {
    setOrderNum(i);
    setOpen(true);
  };

  const onEditItem = (index) => {
    setPIndex(index);
    setOpen1(true);
  };

  const ExtraHead = () => <>{"Action"}</>;

  const ExtraBody = ({ index = 0 }) => (
    <>
      <IconButton color="primary" onClick={() => onViewItem(index)}>
        <Visibility />
      </IconButton>
      {/* <IconButton color="primary" onClick={() => onEditItem(index)}>
        <Edit />
      </IconButton> */}
    </>
  );

  const onClear = () => {
    setPurchase({
      vendorId: "",
      departmentId: "",
      poDate: "",
      subject: "sub",
      packing: "ww",
      mrp: "",
      rate: "",
      amt: "",
      tax: "4",
      taxAmount: "",
      deliverySchedule: "",
      deliveryAddress: "",
    });
    setRequests({
      vendorId: "",
      departmentId: "",
      poDate: "",
      subject: "sub",
      packing: "ww",
      mrp: "",
      rate: "",
      amt: "",
      tax: "4",
      taxAmount: "",
      deliverySchedule: "",
      deliveryAddress: "",
      items: [
        {
          itemCode: "",
          itemName: "",
          quantity: "",
          mrp: "",
          rate: "",
          amt: "",
          tax: "",
          taxAmount: "",
        },
      ],
      prNumber: generateBillNo("PR"),
    });
  };

  const renderModalItem1 = () => {
    const handleChange = (e, i, itm) => {
      let temp = { ...purchase };
      temp[itm] = e.target.value;

      setPurchase(temp);
    };

    const getList = (itm) => {
      return itm === "tax"
        ? [9, 12, 16, 18]
        : itm === "vendorId"
        ? vendors
        : dept;
    };

    return (
      <Box
        sx={{
          "& .MuiTextField-root": { m: 2 },
        }}
        validate
        autoComplete="off"
      >
        {Object?.keys(data2)?.map((item, indx) =>
          item === "vendorId" || item === "departmentId" || item === "tax" ? (
            <FormControl
              size="small"
              sx={{
                width: item === "tax" ? "90px" : "195px",
                m: 2,
              }}
              required
            >
              <InputLabel>{head3[indx]}</InputLabel>
              <Select
                value={purchase[item]}
                label={head3[indx]}
                onChange={(e) => handleChange(e, indx, item)}
              >
                {getList(item)?.map((f, i) => (
                  <MenuItem key={i} value={item === "tax" ? f : f?.id}>
                    {item === "tax" ? f : f?.name}
                    {item === "tax" ? "%" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              key={indx}
              required
              label={head3[indx]}
              type={
                item === "poDate" || item === "deliverySchedule"
                  ? "date"
                  : "text"
              }
              InputLabelProps={
                item === "poDate" || item === "deliverySchedule"
                  ? {
                      shrink: true,
                    }
                  : {}
              }
              size="small"
              value={purchase[item] ?? ""}
              onChange={(txt) => handleChange(txt, indx, item)}
            />
          )
        )}
        <Divider />
      </Box>
    );
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

  const renderModalItem2 = () => {
    const handleChange = async (e, i, itm) => {
      let temp = { ...requests };
      if (i === -1) {
        temp[itm] = e.target.value;
        setPurchase(temp);
      } else if (itm === "itemCode" || itm === "itemName") {
        let val = await getProductPrice(e);
        temp.items[i].itemId = val?.itemId;
        temp.items[i].itemCode = val?.itemCode;
        temp.items[i].itemName = val?.itemName;
        setPurchase(temp);
      } else {
        temp.items[i][itm] = e.target.value;
        temp.items[i]["amt"] = temp.items[i].rate * temp.items[i].quantity;
        temp.items[i]["taxAmount"] =
          temp.items[i]["amt"] * temp.items[i]["tax"] * 0.01;
        setPurchase(temp);
      }
    };

    const getList = (itm) => {
      return itm === "tax"
        ? [9, 12, 16, 18]
        : itm === "vendorId"
        ? vendors
        : dept;
    };

    const onAddRow = () => {
      let temp = { ...requests };
      temp?.items.push({
        itemName: "",
        quantity: "",
        rate: "",
      });
      setRequests(temp);
    };

    const onDeleteRow = (id) => {
      let temp = { ...requests };
      temp.items = requests?.items?.filter((f, i) => i !== id);
      setRequests(temp);
    };
    return (
      <Box
        sx={{
          "& .MuiTextField-root": { m: 2 },
        }}
        validate
        autoComplete="off"
      >
        {Object?.keys(data2)?.map((item, indx) =>
          item === "vendorId" || item === "departmentId" ? (
            <FormControl
              size="small"
              sx={{
                width: "195px",
                m: 2,
              }}
              required
            >
              <InputLabel>{head3[indx]}</InputLabel>
              <Select
                value={requests[item]}
                label={head3[indx]}
                onChange={(e) => handleChange(e, -1, item)}
              >
                {getList(item)?.map((f, i) => (
                  <MenuItem key={i} value={f?.id}>
                    {f?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              key={indx}
              required
              label={head3[indx]}
              type={
                item === "poDate" || item === "deliverySchedule"
                  ? "date"
                  : "text"
              }
              InputLabelProps={
                item === "poDate" || item === "deliverySchedule"
                  ? {
                      shrink: true,
                    }
                  : {}
              }
              size="small"
              value={requests[item] ?? ""}
              onChange={(txt) => handleChange(txt, -1, item)}
            />
          )
        )}
        <TextField
          label="PRNumber"
          value={requests?.prNumber}
          disabled
          size="small"
        />
        <TableContainer>
          <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onAddRow}
                  >
                    <Add />
                  </Button>
                </StyledTableCell>
                {[
                  "Item Code",
                  "Item Name",
                  "MRP",
                  "Rate",
                  "Qty",
                  "Amount",
                  "Tax",
                  "Tax Amt",
                ].map((itm, i) => (
                  <StyledTableCell key={i} align="right">
                    {itm}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {requests?.items?.map((row, ind) => (
                <StyledTableRow key={ind}>
                  <StyledTableCell>
                    <IconButton
                      color="primary"
                      onClick={() => onDeleteRow(ind)}
                    >
                      <Delete />
                    </IconButton>
                  </StyledTableCell>
                  {[
                    "itemCode",
                    "itemName",
                    "quantity",
                    "mrp",
                    "rate",
                    "amt",
                    "tax",
                    "taxAmount",
                  ].map((itm, i) =>
                    itm === "itemCode" || itm === "itemName" ? (
                      <StyledTableCell key={i}>
                        <Autocomplete
                          isOptionEqualToValue={(option, value) =>
                            option.label === value.label
                          }
                          onChange={(e, v) =>
                            v?.id && handleChange(v?.id, ind, itm)
                          }
                          options={productData?.master?.map((option) => {
                            return {
                              label:
                                itm === "itemCode"
                                  ? option?.itemCode
                                  : option?.name,
                              id: option.id,
                            };
                          })}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              autoComplete=""
                              label={itm === "itemCode" ? "Code" : "Name"}
                              size="small"
                              sx={{ width: 200 }}
                            />
                          )}
                        />
                      </StyledTableCell>
                    ) : itm === "tax" ? (
                      <StyledTableCell key={i}>
                        <FormControl
                          size="small"
                          sx={{
                            width: "90px",
                          }}
                        >
                          <Select
                            value={row?.tax}
                            onChange={(e) => handleChange(e, ind, "tax")}
                          >
                            {getList(itm)?.map((f, j) => (
                              <MenuItem key={j} value={f}>
                                {f}%
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </StyledTableCell>
                    ) : itm === "amt" ? (
                      <StyledTableCell key={i}>{row?.amt}</StyledTableCell>
                    ) : (
                      <StyledTableCell key={i}>
                        <TextField
                          label=""
                          size="small"
                          sx={{ width: "70px" }}
                          value={row[itm]}
                          onChange={(e) => handleChange(e, ind, itm)}
                        />
                      </StyledTableCell>
                    )
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
      </Box>
    );
  };

  const onEditPurchase = async () => {
    try {
      const dat = purchase;
      dat["purchaseRequisitionId"] = orders[pIndex]["purchaseRequisitionId"];
      await post("edit-purchase-order", token, dat);
      await getOrders();
    } catch {}
  };

  const onAddPurchase = async () => {
    try {
      const dat = requests;
      await post("new-purchase-order", token, dat);
      await getOrders();
    } catch {}
  };

  const handleCloseModal = async (val = "") => {
    if (val === "submit") {
      await onEditPurchase()
        .then(() => {
          enqueueSnackbar("Success", { variant: "success" });
          setOpen1(false);
        })
        .catch((e) => {
          enqueueSnackbar("Failed", { variant: "error" });
        });
    } else {
      onClear();
      setOpen1(false);
    }
  };

  const handleCloseModal2 = async (val = "") => {
    if (val === "submit") {
      await onAddPurchase()
        .then(() => {
          enqueueSnackbar("Success", { variant: "success" });
          setOpen2(false);
        })
        .catch((e) => {
          enqueueSnackbar("Failed", { variant: "error" });
        });
    } else {
      onClear();
      setOpen2(false);
    }
  };

  const onSearch = (search, type) => {
    const temp = [...orders];
    if (!search || search === "") {
      setOrdersTemp(temp);
    } else if (temp?.length !== 0) {
      const temp1 =
        temp?.filter((f) => f[type]?.toLowerCase() === search?.toLowerCase()) ??
        [];
      setOrdersTemp(temp1);
    }
  };

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
      <Modal
        open={open1}
        handleClose={handleCloseModal}
        title={page === "product" ? "Edit Purchase" : "Add Purchase"}
        page={page}
        renderItem={renderModalItem1}
      />
      <Modal
        open={open2}
        handleClose={handleCloseModal2}
        title={"New Purchase"}
        page={page}
        renderItem={renderModalItem2}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          bgcolor: "#FBF7F0",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <TextField
          label="Vendor search"
          size="small"
          type="search"
          sx={{ mr: 2 }}
          onChange={(e) => onSearch(e?.target?.value ?? "", "distributor")}
        />
        <Button variant="contained" size="small" onClick={() => setOpen2(true)}>
          New Purchase
        </Button>
        {/* <TextField
          label="PO Date"
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
          type="date"
          // onChange={(e) => handleChange(e, -1, "ordersNo")}
        /> */}
      </Box>
      <Tables
        keys={keys}
        data={ordersTemp}
        head={head}
        ExtraHead={ExtraHead}
        ExtraBody={ExtraBody}
        extra
      />
    </Loader>
  );
}
