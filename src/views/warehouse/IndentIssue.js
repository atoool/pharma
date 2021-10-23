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
import { Delete, Edit } from "@mui/icons-material";
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
    intendNo: "",
    warehouseName: "",
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
    IntendNo: "",
    Warehouse: "",
    Outlet: "",
    Date: "",
  },
];

export function IntentIssue() {
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

  const onRequestAccept = async (id) => {
    try {
      await get("issue-request-product/" + id, token);
      await onIssueFetch();
    } catch {}
  };

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Action</StyledTableCell>
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
                  <IconButton
                    color="primary"
                    // onClick={() => handleClickOpenModal("product", i)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="primary"
                    // onClick={() => row?.id && onDeleteProduct(row?.id)}
                  >
                    <Delete />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row?.requestStatus === "requested" ? (
                    <Button
                      variant="contained"
                      onClick={() => onRequestAccept(row?.id)}
                    >
                      Issue
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
