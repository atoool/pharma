/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Button,
  Divider,
  IconButton,
  TablePagination,
  TextField,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { AppContext } from "context/AppContext";
import { get } from "api/api";
import { Loader } from "component/loader/Loader";
import { Box } from "@mui/system";
import { Modal } from "component/Modal/Modal";
import { post } from "api/api";

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

const iData = [
  {
    intendNo: "",
    warehouseName: "",
    userName: "",
    createdAt: "",
    issuedDate: "",
    deliveredDate: "",
  },
];
const iData3 = [
  {
    IntendNo: "",
    Warehouse: "",
    Outlet: "",
    CreatedDate: "",
    IssuedDate: "",
    DeliveredDate: "",
  },
];

export function IntentIssue() {
  const { userData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [data, setData] = React.useState(iData);
  const [selected, setSelected] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(0);

  const onIssueFetch = async () => {
    try {
      const datas = await get("list-stocks-requests", token);
      datas?.data && setData(datas?.data);
    } catch {}
  };

  React.useEffect(() => {
    onIssueFetch();
  }, []);

  const onRequestAccept = async (id) => {
    try {
      await get("issue-request-product/" + id, token);
      await onIssueFetch();
    } catch {}
  };

  const onChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const onChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleAction = async (val, action) => {
    try {
      if (action === "edit") {
        let indx = 0;
        data?.map((f, i) => f?.id === val?.id && (indx = i));
        setSelected(indx);
        setOpen(true);
      } else {
        await get("delete-intend-request/" + val?.id, token).then(async () => {
          await onIssueFetch().catch(() => {});
        });
      }
    } catch {}
  };

  const renderModalItem = () => {
    const handleChange = (e, i, itm) => {
      let temp = [...data];
      temp[selected].products[i][itm] = e.target.value;
      setData(temp);
    };

    // const handleDelete = (i) => {
    //   data[selected]?.products?.splice(i, 1);
    //   setData([...data]);
    // };

    return data[selected]?.products?.map((itm, index) => (
      <Box
        key={index}
        sx={{
          "& .MuiTextField-root": { m: 2 },
        }}
        validate
        autoComplete="off"
      >
        <TextField
          required
          label={"Product"}
          disabled
          size="small"
          value={itm?.name}
        />

        <TextField
          required
          label={"Qty"}
          size="small"
          value={itm?.quantity}
          onChange={(txt) => handleChange(txt, index, "quantity")}
        />
        {/* <IconButton
          color="primary"
          onClick={() => handleDelete(index)}
          sx={{ position: "absolute", right: 5 }}
        >
          <Delete />
        </IconButton> */}
        <Divider />
      </Box>
    ));
  };

  const handleCloseModal = async (action) => {
    try {
      if (action === "submit") {
        let dat = { ...data[selected] };
        dat.requests = data[selected]?.products;
        dat.intendId = data[selected]?.id;
        await post("edit-intend-request", token, dat).then(async () => {
          await onIssueFetch().catch(() => {});
        });
      } else {
        await onIssueFetch();
      }
    } catch {}
    setOpen(false);
  };

  const isLoading = data?.length > 0 && data[0]?.intendNo === "";
  return (
    <Loader load={isLoading}>
      <Modal
        open={open}
        handleClose={handleCloseModal}
        title={"Edit Requests"}
        page={"product"}
        renderItem={renderModalItem}
      />
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
            {data
              ?.slice(
                currentPage * rowsPerPage,
                currentPage * rowsPerPage + rowsPerPage
              )
              ?.map((row, ind) => (
                <StyledTableRow key={ind}>
                  <StyledTableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleAction(row, "edit")}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={async () =>
                        await handleAction(row, "delete").catch(() => {})
                      }
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
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={data?.length ?? 0}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </Loader>
  );
}
