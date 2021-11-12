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
import { Add, Delete } from "@mui/icons-material";
import { AppContext } from "context/AppContext";
import { get } from "api/api";

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
const head = ["Quotation Date", "Valid Date", "Vendor", "Subject", "Status"];
const head2 = ["Item", "Rate"];
const keys = ["quotationDate", "validDate", "vendor", "subject", "status"];
const data = [
  {
    quotationDate: "",
    validDate: "",
    vendor: "",
    subject: "",
    status: "",
  },
];
const data2 = {
  quotationDate: "",
  quotationNumber: "",
  validDate: "",
  vendor: "",
  subject: "",
  status: "",
  department: "",
  deliveryDate: "",
  items: [{ itemName: "", itemId: "", rate: "" }],
};

export const Quotation = () => {
  const { userData, productData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [open, setModal] = React.useState(false);
  const [quotes, setQuotes] = React.useState(data2);
  const [quotations, setQuatations] = React.useState(data);

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

  const handleCloseModal = (action) => {
    setModal(false);
  };

  const onAddRow = () => {
    let temp = { ...quotes };
    temp.items.push({ itemName: "", itemId: "", rate: "" });
    setQuotes(temp);
  };

  const onDeleteRow = (id) => {
    let temp = { ...quotes };
    temp.items = quotes?.items.filter((f, i) => i !== id);
    setQuotes(temp);
  };

  const onOpenModal = () => setModal(true);

  const renderModal = () => {
    const onItemChange = async (e, i, itm) => {
      let temp = { ...quotes };
      if (itm === "productId") {
        temp.items[i].itemId = e;
        let val = await getProductPrice(e);
        temp.items[i].itemName = val?.name;
        setQuotes(temp);
      } else if (i === -1) {
        temp[itm] = e.target.value;
        setQuotes(temp);
      }
    };
    return (
      <Loader>
        <Box
          sx={{
            bgcolor: "#FBF7F0",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            flex: "wrap",
          }}
        >
          <TextField
            label="Vendor"
            size="small"
            value={quotes?.vendor}
            onChange={(e) => onItemChange(e, -1, "vendor")}
          />
          <TextField
            label="Quotation Date"
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={quotes?.quotationDate}
            onChange={(e) => onItemChange(e, -1, "quotationDate")}
          />
          <TextField
            label="Valid Date"
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={quotes?.validDate}
            onChange={(e) => onItemChange(e, -1, "validDate")}
          />
          <TextField
            label="Quotation Number"
            size="small"
            value={quotes?.quotationNumber}
            onChange={(e) => onItemChange(e, -1, "vendor")}
          />

          <TextField
            label="Department"
            size="small"
            value={quotes?.department}
            onChange={(e) => onItemChange(e, -1, "department")}
          />

          <TextField
            label="Subject"
            size="small"
            value={quotes?.subject}
            onChange={(e) => onItemChange(e, -1, "subject")}
          />

          <TextField
            label="Delivery Date"
            size="small"
            value={quotes?.deliveryDate}
            onChange={(e) => onItemChange(e, -1, "deliveryDate")}
          />
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
              {quotes?.items?.map((row, ind) => (
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
                          sx={{ width: 130 }}
                        />
                      )}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TextField
                      label=""
                      size="small"
                      sx={{ width: "70px" }}
                      value={row?.rate}
                      onChange={(e) => onItemChange(e, ind, "rate")}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Loader>
    );
  };
  return (
    <Loader>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        page={"product"}
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
        <Button variant="contained" color="primary" onClick={onOpenModal}>
          New Quotation
        </Button>
        <Button variant="contained" color="primary">
          Valid Quotation/Canceled
        </Button>
        <Button variant="contained" color="primary">
          Status
        </Button>
      </Box>
      <Tables keys={keys} head={head} data={quotations} />
    </Loader>
  );
};
