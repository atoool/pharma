import React from "react";
import { Box } from "@mui/system";
import { TextField, IconButton } from "@mui/material";
import { Loader } from "component/loader/Loader";
import { AppContext } from "context/AppContext";
import { Visibility } from "@mui/icons-material";
import { get } from "api/api";
import { Modal } from "component/Modal/Modal";
import Tables from "../../component/table/Tables";

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

export function PurchaseOrder() {
  const { userData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [orders, setOrders] = React.useState(data);
  const [open, setOpen] = React.useState(false);
  const [isLoad, setLoad] = React.useState(true);
  const [orderNum, setOrderNum] = React.useState(0);

  const getOrders = async () => {
    try {
      setLoad(true);
      const dat = await get("purchase-order", token);
      const temp = dat?.data?.response ?? [];
      setOrders([...temp]);
      setLoad(false);
    } catch {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    getOrders().catch(() => {});
  }, []);

  const renderModalItem = () => (
    <Tables head={head2} keys={keys2} data={orders[orderNum]?.items} />
  );

  const onViewItem = (i) => {
    setOrderNum(i);
    setOpen(true);
  };

  const ExtraHead = () => <>{"Action"}</>;

  const ExtraBody = ({ index = 0 }) => (
    <IconButton color="primary" onClick={() => onViewItem(index)}>
      <Visibility />
    </IconButton>
  );

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
      <Tables
        keys={keys}
        data={orders}
        head={head}
        ExtraHead={ExtraHead}
        ExtraBody={ExtraBody}
        extra
      />
    </Loader>
  );
}
