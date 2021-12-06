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
} from "@mui/material";
import { Loader } from "component/loader/Loader";
import { AppContext } from "../../context/AppContext";
import { Edit, Visibility } from "@mui/icons-material";
import { get, post } from "api/api";
import { Modal } from "component/Modal/Modal";
import Tables from "../../component/table/Tables";
import { useSnackbar } from "notistack";

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
  "MRP",
  "Rate",
  "Amount",
  "Tax",
  "TaxAmount",
  "Delivery Schedule",
  "Delivery Address",
];

const data2 = {
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
};

export function PurchaseOrder() {
  const { userData, vendors, dept } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [orders, setOrders] = React.useState(data);
  const [ordersTemp, setOrdersTemp] = React.useState(data);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [isLoad, setLoad] = React.useState(true);
  const [orderNum, setOrderNum] = React.useState(0);
  const [page, setPage] = React.useState("product");
  const [pIndex, setPIndex] = React.useState(0);
  const [purchase, setPurchase] = React.useState({});
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
      <IconButton color="primary" onClick={() => onEditItem(index)}>
        <Edit />
      </IconButton>
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

  const onEditPurchase = async () => {
    try {
      const dat = purchase;
      dat["purchaseRequisitionId"] = orders[pIndex]["purchaseRequisitionId"];
      await post("edit-purchase-order", token, dat);
      await getOrders();
    } catch {}
  };

  const handleCloseModal = async (val = "") => {
    if (val === "submit") {
      await onEditPurchase()
        .then(() => {
          enqueueSnackbar("Success", { variant: "success" });
        })
        .catch((e) => {
          enqueueSnackbar("Failed", { variant: "error" });
        });
    } else {
      onClear();
      setOpen1(false);
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
          type="search"
          sx={{ mr: 2 }}
          onChange={(e) => onSearch(e?.target?.value ?? "", "distributor")}
        />
        {/* <TextField
          label="PO Date"
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
          type="date"
          // onChange={(e) => onItemChange(e, -1, "ordersNo")}
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
