import { get } from "api/api";
import { Loader } from "component/loader/Loader";
import Tables from "component/table/Tables";
import { AppContext } from "../../context/AppContext";
import React from "react";
import { Button, IconButton, TextField } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Modal } from "component/Modal/Modal";
import { Box } from "@mui/system";
import { CSVLink } from "react-csv";

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
  "Payment Mode",
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
  "settlementMode",
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
  const [tempData, setTempData] = React.useState([]);

  const getData = async () => {
    try {
      setLoad(true);
      const dat = await get("sales-history", token);
      setData(dat?.data?.response ?? []);
      setTempData(dat?.data?.response ?? []);
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
      <Tables head={head2} keys={keys2} data={tempData[saleIndex]?.items} />
    </Loader>
  );

  const onSearch = (e, type) => {
    const search = e.target.value?.toLowerCase();
    const temp = [...data];
    const tmpData = temp?.filter(
      (f) => f[type]?.toLowerCase()?.indexOf(search) > -1
    );
    tmpData && setTempData(tmpData);
    (search === "" || !search) && setTempData(data);
  };

  return (
    <Loader load={load}>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        show={false}
        title={"Soled Items"}
        renderItem={renderModal}
      />
      <Box
        sx={{
          bgcolor: "#FBF7F0",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextField
          required
          label={"Bill No."}
          type={"search"}
          size="small"
          onChange={(txt) => onSearch(txt, "billNo")}
        />
        <TextField
          required
          label={"Customer Name"}
          type={"search"}
          size="small"
          onChange={(txt) => onSearch(txt, "customerName")}
        />
        <TextField
          required
          label={"Doctor Name"}
          type={"search"}
          size="small"
          onChange={(txt) => onSearch(txt, "dosctorName")}
        />

        <Button variant="contained">
          <CSVLink
            data={data}
            filename={"MVRSalesHistory.csv"}
            target="_blank"
            style={{ textDecorationLine: "none", color: "inherit" }}
          >
            EXPORT CSV
          </CSVLink>
        </Button>
      </Box>
      <Tables
        head={head1}
        keys={keys1}
        data={tempData}
        ExtraBody={ExtraBody}
        ExtraHead={ExtraHead}
        extra
      />
    </Loader>
  );
}
