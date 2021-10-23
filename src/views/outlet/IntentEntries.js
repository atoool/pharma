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
    warehouseName: "",
    intendNo: "",
    createdAt: "",
  },
];
const iData1 = [
  {
    Warehouse: "",
    IntendNo: "",
    Date: "",
  },
];

const iData2 = {
  requests: [
    {
      productId: "",
      quantity: "",
    },
  ],
};

export function IntentEntries() {
  const { userData, productData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";

  const [storeIndent, setStoreIndent] = React.useState(iData2);
  const [data, setData] = React.useState(iData);

  const [open, setOpen] = React.useState(false);

  const onIndentFetch = async () => {
    try {
      const datas = await get("list-stocks-requests-outlet", token);
      datas?.data && setData(datas?.data);
    } catch {}
  };

  React.useEffect(() => {
    onIndentFetch();
  }, []);

  const handleClickOpenModal = () => {
    setOpen(true);
  };

  const onRequest = async () => {
    try {
      const dat = storeIndent;
      await post("request-product-by-outlet", token, dat);
      await onIndentFetch();
    } catch {}
  };

  const onDelivery = async (id) => {
    try {
      const dat = storeIndent;
      await get("request-product-delivered/" + id, token, dat);
      await onIndentFetch();
    } catch {}
  };

  const handleCloseModal = async (val = "") => {
    if (val === "submit") {
      await onRequest().catch(() => {});
    }
    setStoreIndent(iData2);
    setOpen(false);
  };

  const renderModalItem = () => {
    const handleChange = (e, i, itm) => {
      let temp = { ...storeIndent };

      itm === "productId"
        ? (temp.requests[i].productId = e)
        : (temp.requests[i][itm] = e.target.value);
      setStoreIndent(temp);
    };
    const handleDelete = (i) => {
      let temp = { ...storeIndent };
      temp.requests.splice(i, 1);
      setStoreIndent(temp);
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
        {storeIndent?.requests?.map((item, index) => (
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
    let temp = { ...storeIndent };
    temp.requests.push({
      productId: "",
      quantity: "",
    });
    setStoreIndent(temp);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Modal
        open={open}
        handleAddRow={handleAddRowModal}
        handleClose={handleCloseModal}
        renderItem={renderModalItem}
        title="Store Indent"
        page="indent"
      />
      <Box
        sx={{
          bgcolor: "#FBF7F0",
          p: 2,
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button variant="outlined" onClick={handleClickOpenModal}>
          Request
        </Button>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Status</StyledTableCell>
              {Object.keys(iData1[0]).map((itm, i) => (
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
                  {row?.requestStatus === "issued" ? (
                    <Button
                      variant="contained"
                      onClick={() => onDelivery(row?.id)}
                    >
                      Delivered
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
