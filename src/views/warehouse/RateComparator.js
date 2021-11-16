import Tables from "../../component/table/Tables";
import React from "react";
import { Loader } from "component/loader/Loader";
import { Box, styled } from "@mui/system";
import {
  Autocomplete,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Modal } from "component/Modal/Modal";
import { Add, Delete, Visibility } from "@mui/icons-material";
import { AppContext } from "context/AppContext";
import { get } from "api/api";
import { generateBillNo } from "utils/generateBillNo";

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
const head = ["Start Date", "Exp Date", "Vendor", "Subject", "Status"];
const head2 = [
  "Item",
  "Min qty",
  "Max qty",
  "Duration",
  "MRP",
  "Disc Amount",
  "Tax",
  "Rate",
];
const keys2 = [
  "name",
  "minQty",
  "maxQty",
  "duration",
  "MRP",
  "discountAmount",
  "tax",
  "rate",
];
const keys = ["startDate", "expDate", "department", "subject", "status"];
const data1 = {
  startDate: "",
  expDate: "",
  items: [
    {
      startDate: "",
      expDate: "",
      department: "",
      subject: "",
      status: "",
    },
  ],
};
const data2 = {
  vendor: "",
  subject: "",
  remarks: "",
  startDate: "",
  expDate: "",
  createDate: "",
  items: [
    {
      name: "",
      minQty: "",
      maxQty: "",
      duration: "",
      MRP: "",
      discountAmount: "",
      tax: "",
      rate: "",
    },
  ],
};

export const RateComparator = () => {
  const { userData, productData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [open, setModal] = React.useState(false);
  const [open2, setModal2] = React.useState(false);
  const [data, setData] = React.useState(data1);
  const [submitData, setSubmitData] = React.useState(data2);
  const [quoteNum, setQuoteNum] = React.useState(0);
  const [load, setLoad] = React.useState(false);

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

  const getQuotations = async (id) => {
    try {
      // setLoad(true);
      const dat = await get("list-quotations", token);
      // setQuatations(dat?.data?.response ?? []);

      setLoad(false);
    } catch {}
  };

  React.useEffect(() => {
    getQuotations();
  }, []);

  const handleCloseModal = async (action) => {
    if (action === "submit") {
      try {
        await get("new-quotation", token, submitData);
        await getQuotations();
      } catch {}
    }
    setModal(false);
  };

  const onAddRow = () => {
    let temp = { ...submitData };
    temp.items.push({
      name: "",
      minQty: "",
      maxQty: "",
      duration: "",
      MRP: "",
      discountAmount: "",
      tax: "",
      rate: "",
    });
    setSubmitData(temp);
  };

  const onDeleteRow = (id) => {
    let temp = { ...submitData };
    temp.items = submitData?.items.filter((f, i) => i !== id);
    setSubmitData(temp);
  };

  const onOpenModal = () => setModal(true);

  const onItemChange = async (e, i, itm) => {
    let temp = { ...submitData };
    if (itm === "productId") {
      temp.items[i].itemId = e;
      let val = await getProductPrice(e);
      temp.items[i].itemName = val?.name;
      setSubmitData(temp);
    } else if (i === -1) {
      temp[itm] = e.target.value;
      setSubmitData(temp);
    } else if (itm === "rate") {
      temp.items[i]["rate"] = e.currentTarget.value;
      setSubmitData(temp);
    }
  };

  const renderModal = () => {
    return (
      <Loader>
        <Box
          sx={{
            bgcolor: "#FBF7F0",
            p: 2,
            display: "flex",
            justifyContent: "space-around",
            flex: "wrap",
            width: window.innerWidth,
          }}
        >
          <Box>
            <TextField
              label="Vendor"
              size="small"
              value={submitData?.vendor}
              sx={{ mr: 2, width: "250px", mb: 2 }}
              onChange={(e) => onItemChange(e, -1, "vendor")}
            />
            <TextField
              label="Start Date"
              size="small"
              type="date"
              sx={{ mr: 2, width: "250px", mb: 2 }}
              InputLabelProps={{ shrink: true }}
              value={submitData?.quotationDate}
              onChange={(e) => onItemChange(e, -1, "startDate")}
            />
            <TextField
              label="Exp Date"
              size="small"
              type="date"
              sx={{ mr: 2, width: "250px" }}
              InputLabelProps={{ shrink: true }}
              value={submitData?.expDate}
              onChange={(e) => onItemChange(e, -1, "expDate")}
            />
          </Box>
          <Box>
            <TextField
              label="Subject"
              size="small"
              sx={{ mr: 2, width: "250px", mb: 2 }}
              value={submitData?.subject}
              onChange={(e) => onItemChange(e, -1, "subject")}
            />
            <TextField
              label="Remarks"
              size="small"
              value={submitData?.remarks}
              sx={{ width: "250px" }}
              onChange={(e) => onItemChange(e, -1, "remarks")}
            />
          </Box>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onAddRow}
                  >
                    <Add />
                  </Button>
                </StyledTableCell>
                {head2.map((itm, i) => (
                  <StyledTableCell key={i} align="right">
                    {itm}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {submitData?.items?.map((row, ind) => (
                <StyledTableRow key={ind}>
                  <StyledTableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => onDeleteRow(ind)}
                    >
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
                          label="Product"
                          size="small"
                          sx={{ width: 230 }}
                        />
                      )}
                    />
                  </StyledTableCell>
                  {keys2?.map(
                    (f, i) =>
                      f !== "name" && (
                        <StyledTableCell align="right" key={i}>
                          <TextField
                            label=""
                            size="small"
                            sx={{ width: "70px" }}
                            value={row[f]}
                            onChange={(e) => onItemChange(e, ind, f)}
                          />
                        </StyledTableCell>
                      )
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Loader>
    );
  };

  const renderModalItem2 = () => (
    <Tables head={head2} keys={keys2} data={data[quoteNum]?.items} />
  );

  const onViewItem = (i) => {
    setQuoteNum(i);
    setModal2(true);
  };

  const onRespond = async (status = "created", id = "") => {
    try {
      if (status === "created") {
        await get("approve-quotation/" + id, token);
      }
      await getQuotations();
    } catch {}
  };

  const ExtraHead = () => <>{"Action"}</>;

  const ExtraBody = ({ index = 0 }) => (
    <>
      <IconButton color="primary" onClick={() => onViewItem(index)}>
        <Visibility />
      </IconButton>
      {/* <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() =>
          onRespond(data[index]?.status, data[index]?.id)
        }
        disabled={data[index]?.status === "accepted"}
        sx={{ ml: 2 }}
      >
        {data[index]?.status === "created" ? "Accept" : "disabled"}
      </Button> */}
    </>
  );

  return (
    <Loader load={load}>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        page={"product"}
        renderItem={renderModal}
      />
      <Modal
        open={open2}
        title={"Quotation items"}
        show={false}
        handleClose={() => {
          setModal2(false);
        }}
        renderItem={renderModalItem2}
      />
      <Box
        sx={{
          bgcolor: "#FBF7F0",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={onOpenModal}
        >
          New Contract
        </Button>
        <TextField
          label="Start Date"
          size="small"
          type="date"
          sx={{ mr: 2, width: "250px", mb: 2 }}
          InputLabelProps={{ shrink: true }}
          value={data?.startDate}
          onChange={(e) => onItemChange(e, -1, "startDate")}
        />
        <TextField
          label="Exp Date"
          size="small"
          type="date"
          sx={{ mr: 2, width: "250px", mb: 2 }}
          InputLabelProps={{ shrink: true }}
          value={data?.expDate}
          onChange={(e) => onItemChange(e, -1, "expDate")}
        />
        <Autocomplete
          isOptionEqualToValue={(option, value) => option.label === value.label}
          onChange={(e, v) => v?.id && onItemChange(v?.id, -1, "productId")}
          options={productData?.map((option) => {
            return {
              label: option.name,
              id: option.id,
            };
          })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Product"
              size="small"
              sx={{ width: 230 }}
            />
          )}
        />
      </Box>
      <Tables
        keys={keys}
        head={head}
        data={data?.items}
        ExtraBody={ExtraBody}
        ExtraHead={ExtraHead}
        extra
      />
    </Loader>
  );
};
