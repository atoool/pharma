import { get } from "api/api";
import { Loader } from "component/loader/Loader";
import Tables from "component/table/Tables";
import { AppContext } from "../../context/AppContext";
import React from "react";
import { IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Modal } from "component/Modal/Modal";

const head1 = [
  "BillNo",
  "CustomerName",
  "DoctorName",
  "Scheme",
  "BillAmount",
  "DiscAmount",
  "Tax",
  "RoundAmount",
  "Status",
  "CreatedAt",
];
const keys1 = [
  "billNo",
  "customerName",
  "doctorName",
  "scheme",
  "billAmount",
  "discAmount",
  "tax",
  "roundAmount",
  "isSalesReturn",
  "createdAt",
];
const head2 = ["ItemCode", "Name", "Qty", "Price", "Expiry", "CreatedAt"];
const keys2 = [
  "itemCode",
  "name",
  "quantity",
  "unitPrice",
  "expiry",
  "createdAt",
];

export function SalesHistory() {
  const {
    userData: {
      token: { accessToken = "" },
    },
  } = React.useContext(AppContext);
  const token = accessToken;
  const [load, setLoad] = React.useState(false);
  const [saleIndex, setSaleIndex] = React.useState(false);
  const [open, setModal] = React.useState(false);
  const [data, setData] = React.useState([]);

  const getData = async () => {
    try {
      setLoad(true);
      const dat = await get("sales-history", token);
      setData(dat?.data?.response ?? []);
      console.warn(dat?.data?.response);
      setLoad(false);
    } catch {}
  };

  React.useEffect(() => {
    getData().catch(() => {});
  }, []);

  const onViewItem = (i) => {
    setSaleIndex(i);
    setModal(true);
  };

  const ExtraHead = () => <>{"Action"}</>;

  const ExtraBody = ({ index = 0 }) => (
    <IconButton color="primary" onClick={() => onViewItem(index)}>
      <Visibility />
    </IconButton>
  );

  const handleCloseModal = () => {
    setModal(false);
  };

  const renderModal = () => (
    <Loader>
      <Tables head={head2} keys={keys2} data={data[saleIndex]?.items} />
    </Loader>
  );

  return (
    <Loader load={load}>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        show={false}
        title={"Soled Items"}
        renderItem={renderModal}
      />
      <Tables
        head={head1}
        keys={keys1}
        data={data}
        ExtraBody={ExtraBody}
        ExtraHead={ExtraHead}
        extra
      />
    </Loader>
  );
}
