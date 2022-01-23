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
import { post, get } from "api/api";
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
const head = ["Item", "Qty"];
const head1 = ["PRNumber", "Date", "Status"];
const keys = ["prNumber", "createdAt", "status"];

export const PurchaseRequisition = () => {
  const data = {
    items: [
      {
        itemName: "",
        quantity: "",
        rate: "",
      },
    ],
    remarks: "",
    prNumber: generateBillNo("PR"),
  };

  const data1 = [
    {
      itemName: "",
      quantity: "",
      rate: "",
      date: "",
      status: "",
      approveStatus: "",
      receiveStatus: "",
    },
  ];
  const { userData, productData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [open, setModal] = React.useState(false);
  const [open2, setModal2] = React.useState(false);
  const [reqs, setReqs] = React.useState(data1);
  const [tempReqs, setTempReqs] = React.useState(data1);
  const [reqNum, setReqNum] = React.useState(0);
  const [requests, setRequests] = React.useState(data);
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

  const getRequests = async (id) => {
    try {
      setLoad(true);
      const dat = await get("purchase-requisitions", token);
      setReqs(dat?.data?.response ?? []);
      setTempReqs(dat?.data?.response ?? []);
      setLoad(false);
    } catch {}
  };

  React.useEffect(() => {
    getRequests();
  }, []);
  const onClear = () => {
    setRequests({
      items: [
        {
          itemName: "",
          quantity: "",
          rate: "",
        },
      ],
      prNumber: generateBillNo("PR"),
      remarks: "",
    });
  };

  const handleCloseModal = async (action) => {
    try {
      if (action === "submit") {
        await onPurchaseRequest().catch(() => {});
        await getRequests();
      }
    } catch {}
    setModal(false);
    onClear();
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

  const onOpenModal = () => setModal(true);

  const onItemChange = async (e, i, itm) => {
    let temp = { ...requests };
    if (itm === "productId") {
      temp.items[i].itemId = e;
      let val = await getProductPrice(e);
      temp.items[i].rate = val?.unitPrice;
      temp.items[i].itemName = val?.itemName;
      setRequests(temp);
    } else if (i === -1) {
      temp[itm] = e.target.value;
      setRequests(temp);
    } else if (itm === "quantity") {
      temp.items[i]["quantity"] = e.target.value;
      setRequests(temp);
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
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="PRNumber"
            value={requests?.prNumber}
            disabled
            size="small"
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
                {head.map((itm, i) => (
                  <StyledTableCell key={i} align="right">
                    {itm}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {requests?.items?.map((row, ind) => (
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
                      options={productData?.master?.map((option) => {
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
                      value={requests?.quantity}
                      onChange={(e) => onItemChange(e, ind, "quantity")}
                    />
                  </StyledTableCell>
                  {/* <StyledTableCell align="right">{row?.rate}</StyledTableCell> */}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box>
          <TextField
            label="Remarks"
            value={requests?.remarks}
            sx={{ height: 100, m: 2 }}
            onChange={(e) => onItemChange(e, -1, "remarks")}
          />
        </Box>
      </Loader>
    );
  };

  const onPurchaseRequest = async () => {
    try {
      await post("new-purchase-requisition", token, requests);
    } catch {}
  };

  const onViewItem = (i) => {
    setReqNum(i);
    setModal2(true);
  };

  const onRespond = async (status = "delivered", id = "") => {
    try {
      if (status === "requested") {
        await get("accept-purchase-requisition/" + id, token);
      }
      // else if (status === "accepted") {
      //   await get("delivered-purchase-requisition/" + id, token);
      // }
      await getRequests();
    } catch {}
  };

  const ExtraHead = () => <>{"Action"}</>;

  const ExtraBody = ({ index = 0 }) => (
    <>
      <IconButton color="primary" onClick={() => onViewItem(index)}>
        <Visibility />
      </IconButton>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => onRespond(reqs[index]?.status, reqs[index]?.id)}
        disabled={reqs[index]?.status !== "requested" || !reqs[index]?.status}
        sx={{ ml: 2 }}
      >
        {reqs[index]?.status === "requested" ? "Accept" : "NA"}
      </Button>
    </>
  );

  const renderModalItem2 = () => (
    <Tables
      head={["Item", "Qty"]}
      keys={["name", "quantity"]}
      data={tempReqs[reqNum]?.items}
    />
  );

  const onSearch = (e, type) => {
    const search = e.target.value?.toLowerCase();
    const temp = [...reqs];
    const tmpData = temp?.filter(
      (f) => f[type]?.toLowerCase()?.indexOf(search) > -1
    );
    tmpData && setTempReqs(tmpData);
    (search === "" || !search) && setTempReqs(reqs);
  };

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
        title={"Requested items"}
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
        <TextField
          required
          label={"PRNumber"}
          type={"search"}
          size="small"
          onChange={(txt) => onSearch(txt, "prNumber")}
        />
        <Button variant="contained" color="primary" onClick={onOpenModal}>
          New requisition
        </Button>
      </Box>
      <Tables
        keys={keys}
        head={head1}
        data={tempReqs}
        ExtraHead={ExtraHead}
        ExtraBody={ExtraBody}
        extra
      />
    </Loader>
  );
};
