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
const head = [
  "Item",
  "Qty",
  "Rate",
  "Date",
  "Status",
  "Approve Status",
  "Receive Status",
];
const keys = [
  "itemName",
  "requiredQty",
  "rate",
  "date",
  "status",
  "approveStatus",
  "receiveStatus",
];
const data = [
  {
    itemName: "",
    requiredQty: "",
    rate: "",
    date: "",
    status: "",
    approveStatus: "",
    receiveStatus: "",
  },
];
export const PurchaseRequisition = () => {
  const { userData, productData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [open, setModal] = React.useState(false);
  const [reqs, setReqs] = React.useState(data);
  const [requests, setRequests] = React.useState(data);

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
    let temp = [...requests];
    temp.push({
      itemName: "",
      requiredQty: "",
      rate: "",
      date: "",
      status: "",
      approveStatus: "",
      receiveStatus: "",
    });
    setRequests(temp);
  };

  const onDeleteRow = (id) => {
    let temp = [...requests];
    temp = requests?.filter((f, i) => i !== id);
    setRequests(temp);
  };

  const onOpenModal = () => setModal(true);
  const renderModal = () => {
    const onItemChange = async (e, i, itm) => {
      let temp = [...requests];
      if (itm === "productId") {
        temp[i].productId = e;
        let val = await getProductPrice(e);
        temp[i].rate = val?.unitPrice;
        temp[i].date = val?.expDate;
        temp[i].itemName = val?.name;
        setRequests(temp);
      } else if (
        itm === "approveStatus" ||
        itm === "receiveStatus" ||
        itm === "status"
      ) {
        temp[itm] = e;
        setRequests(temp);
      } else {
        temp[itm] = e.target.value;
        setRequests(temp);
      }
    };
    return (
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
            {requests?.map((row, ind) => (
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
                    value={requests?.requiredQty}
                    onChange={(e) => onItemChange(e, ind, "quantity")}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{row?.rate}</StyledTableCell>
                <StyledTableCell align="right">{row?.date}</StyledTableCell>
                <StyledTableCell align="right">
                  <Autocomplete
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, v) => v && onItemChange(v, ind, "status")}
                    options={["Pending", "Completed"]?.map((option) => {
                      return option;
                    })}
                    renderInput={(params) => (
                      <TextField {...params} size="small" sx={{ width: 130 }} />
                    )}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Autocomplete
                    isOptionEqualToValue={(option, value) =>
                      option.label === value.label
                    }
                    onChange={(e, v) =>
                      v && onItemChange(v, ind, "approveStatus")
                    }
                    options={["Approved", "Not Approved"]?.map((option) => {
                      return option;
                    })}
                    renderInput={(params) => (
                      <TextField {...params} size="small" sx={{ width: 130 }} />
                    )}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Autocomplete
                    isOptionEqualToValue={(option, value) => option === value}
                    onChange={(e, v) =>
                      v && onItemChange(v, ind, "receiveStatus")
                    }
                    options={["Received", "Not Received"]?.map((option) => {
                      return option;
                    })}
                    renderInput={(params) => (
                      <TextField {...params} size="small" sx={{ width: 130 }} />
                    )}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
          New requisition
        </Button>
      </Box>
      <Tables keys={keys} head={head} data={reqs} />
    </Loader>
  );
};
