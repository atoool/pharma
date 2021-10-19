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
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Modal } from "component/Modal/Modal";
import { AppContext } from "context/AppContext";
import { get } from "api/api";
import { post } from "api/api";

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

const iData = [
  {
    prodName: "",
    intendNo: "",
    userName: "",
    createdAt: "",
  },
];

const iData2 = {
  outletUserId: "",
  requests: [
    {
      productId: "",
      quantity: "",
    },
  ],
};
const iData3 = [
  {
    Product: "",
    IntendNo: "",
    Outlet: "",
    CreatedAt: "",
  },
];

export function IssueGoods() {
  const { userData, productData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";

  const [issueGoods, setIssueGoods] = React.useState(iData2);
  const [data, setData] = React.useState(iData);
  const [userList, setUserList] = React.useState([]);

  const [open, setOpen] = React.useState(false);

  const onIssueFetch = async () => {
    try {
      const datas = await get("list-stocks-requests", token);
      datas?.data && setData(datas?.data);
    } catch {}
  };

  const onUserFetch = async () => {
    try {
      const datas = await get("outlet-users", token);
      datas?.data && setUserList(datas?.data);
    } catch {}
  };

  React.useEffect(() => {
    onIssueFetch();
    onUserFetch();
  }, []);

  const handleClickOpenModal = () => {
    setOpen(true);
  };

  const onIssue = async () => {
    try {
      const dat = issueGoods;
      await post("add-product-to-outlet", token, dat);
      await onIssueFetch();
    } catch {}
  };

  const onRequestAccept = async (id) => {
    try {
      await get("issue-request-product/" + id, token);
      await onIssueFetch();
    } catch {}
  };

  const handleCloseModal = async (val = "") => {
    if (val === "submit") {
      await onIssue().catch(() => {});
    }
    setIssueGoods(iData2);
    setOpen(false);
  };

  const renderModalItem = () => {
    const handleChange = (e, i, itm) => {
      itm === "productId" && console.warn(e);
      let temp = { ...issueGoods };
      i === -1
        ? (temp.outletUserId = e)
        : itm === "productId"
        ? (temp.requests[i].productId = e)
        : (temp.requests[i][itm] = e.target.value);
      setIssueGoods(temp);
    };
    const handleDelete = (i) => {
      let temp = { ...issueGoods };
      temp.requests.splice(i, 1);
      setIssueGoods(temp);
    };
    return (
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 2 },
        }}
        validate
        autoComplete="off"
      >
        <Autocomplete
          sx={{ width: "15%" }}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          onChange={(event, value) =>
            value?.id && handleChange(value?.id, -1, "outletUserId")
          }
          options={userList?.map((option) => {
            return { label: option.name, id: option.id };
          })}
          renderInput={(params) => (
            <TextField {...params} label="Outlet User" size="small" />
          )}
        />
        {issueGoods?.requests?.map((item, index) => (
          <div key={index}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Autocomplete
                sx={{ width: "15%", mr: 2 }}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
                onChange={(e, v) =>
                  v?.id && handleChange(v?.id, index, "productId")
                }
                options={productData?.map((option, i) => {
                  return {
                    label: option.name + " " + option.id,
                    id: option.id,
                  };
                })}
                renderInput={(params) => (
                  <TextField {...params} label="Product" size="small" />
                )}
              />
              <TextField
                required
                label="Quantity"
                type="search"
                size="small"
                value={item.quantity ?? ""}
                onChange={(txt) => handleChange(txt, index, "quantity")}
              />
              <IconButton
                color="primary"
                onClick={() => handleDelete(index)}
                sx={{ position: "absolute", right: 5 }}
              >
                <Delete />
              </IconButton>
            </div>
            <Divider />
          </div>
        ))}
      </Box>
    );
  };

  const handleAddRowModal = () => {
    let temp = { ...issueGoods };
    temp.requests.push({
      productId: "",
      quantity: "",
    });
    setIssueGoods(temp);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Modal
        open={open}
        handleAddRow={handleAddRowModal}
        handleClose={handleCloseModal}
        renderItem={renderModalItem}
        title="Issue Goods"
        page="issue"
      />
      <Box
        sx={{
          bgcolor: "#DDDDDD",
          p: 2,
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button variant="outlined" onClick={handleClickOpenModal}>
          New issue
        </Button>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Status</StyledTableCell>
              {Object.keys(iData3[0]).map((itm, i) => (
                <StyledTableCell key={i} align="right">
                  {itm}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, ind) => (
              <StyledTableRow key={ind}>
                <StyledTableCell align="right">
                  {row?.requestStatus === "requested" ? (
                    <Button
                      variant="contained"
                      onClick={() => onRequestAccept(row?.id)}
                    >
                      Accept
                    </Button>
                  ) : (
                    row?.requestStatus
                  )}
                </StyledTableCell>
                {Object.keys(iData[0]).map((itm, i) => (
                  <StyledTableCell key={i} align="right">
                    {row[itm]}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Box>
  );
}
