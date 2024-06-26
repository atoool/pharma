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
  IconButton,
  Button,
  TextField,
  Divider,
  TablePagination,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Modal } from "component/Modal/Modal";
import { get, post } from "api/api";
import { AppContext } from "context/AppContext";
import { Loader } from "component/loader/Loader";
import { useSnackbar } from "notistack";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 15,
    fontWeight: "bold",
    height: 60,
    padding: 2,
    textAlign: "left",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 2,
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

const head = ["Name", "Address", "Phone", "Email", "GST", "PanCard"];
export function Vendors() {
  const keys = [
    {
      name: "",
      address: "",
      phone: "",
      email: "",
      gstno: "",
      pancard: "",
    },
  ];
  const { userData, onGetVendors } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";

  const [page, setPage] = React.useState("product");
  const [open, setOpen] = React.useState(false);
  let [vendors, setVendors] = React.useState(keys);
  let [data, setData] = React.useState(keys);
  let [tempData, setTempData] = React.useState(keys);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const onClear = () => {
    setVendors([
      {
        name: "",
        address: "",
        phone: "",
        email: "",
        gstno: "",
        pancard: "",
      },
    ]);
  };

  const handleClickOpenModal = (pg = "product", i = 0) => {
    if (pg === "product") {
      const {
        id = "",
        name = "",
        address = "",
        phone = "",
        email = "",
        gstno = "",
        pancard = "",
      } = tempData[i];
      setVendors([{ id, name, address, phone, email, gstno, pancard }]);
    }
    setPage(pg);
    setOpen(true);
  };
  const onVendorFetch = async () => {
    try {
      const data1 = await onGetVendors(token);
      setData(data1 ?? []);
      setTempData(data1 ?? []);
    } catch {}
  };

  React.useEffect(() => {
    onVendorFetch();
  }, []);

  const onAddVendor = async () => {
    try {
      await post("new-vendor", token, vendors[0]);
      console.warn(vendors);
      await onVendorFetch();
    } catch {}
  };

  const onEditVendor = async () => {
    try {
      const dat = vendors[0];
      await post("edit-vendor", token, dat);
      await onVendorFetch();
    } catch {}
  };

  const statusCheck = (e) => {
    onClear();
    setOpen(false);
    // } else {
    //   enqueueSnackbar("Something went wrong", { variant: "error" });
    // }
  };

  const handleCloseModal = async (val = "") => {
    if (val === "submit") {
      if (page === "products") {
        await onAddVendor()
          .then(statusCheck)
          .catch((e) => {});
      } else if (page === "product") {
        await onEditVendor()
          .then(statusCheck)
          .catch((e) => {});
      }
    } else {
      onClear();
      setOpen(false);
    }
  };

  const renderModalItem = () => {
    const handleChange = (e, i, itm) => {
      let temp = [...vendors];
      temp[i][itm] = e.currentTarget.value;

      setVendors(temp);
    };
    const handleDelete = (i) => {
      vendors.splice(i, 1);
      setVendors([...vendors]);
    };

    return vendors.map((itm, index) => (
      <Box
        key={index}
        sx={{
          "& .MuiTextField-root": { m: 2 },
        }}
        validate
        autoComplete="off"
      >
        {Object.keys(keys[0]).map((item, indx) => (
          <TextField
            key={indx}
            required
            label={head[indx]}
            size="small"
            value={itm[item] ?? ""}
            onChange={(txt) => handleChange(txt, index, item)}
          />
        ))}
        <IconButton
          color="primary"
          onClick={() => handleDelete(index)}
          sx={{ position: "absolute", right: 5 }}
        >
          <Delete />
        </IconButton>
        <Divider />
      </Box>
    ));
  };

  const handleAddRowModal = () => {
    let temp = [...vendors];
    temp.push({
      name: "",
      address: "",
      phone: "",
      email: "",
      gstno: "",
      pancard: "",
    });
    setVendors(temp);
  };

  const onDeleteVendor = async (id) => {
    try {
      await get("delete-vendor/" + id, token);
      await onVendorFetch();
    } catch {}
  };

  const onChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const onChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const onSearch = (e, type) => {
    const search = e.target.value?.toLowerCase();
    const temp = [...data];
    const tmpData = temp?.filter(
      (f) => f[type]?.toLowerCase()?.indexOf(search) > -1
    );
    tmpData && setTempData(tmpData);
    (search === "" || !search) && setTempData(data);
  };

  const isLoaded = data?.length > 0 && data[0]?.name === "";

  return (
    <Loader load={isLoaded}>
      <Modal
        open={open}
        handleAddRow={handleAddRowModal}
        handleClose={handleCloseModal}
        title={page === "product" ? "Edit Vendor" : "Add Vendor"}
        page={"product"}
        renderItem={renderModalItem}
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
          label={"Name"}
          type={"search"}
          size="small"
          onChange={(txt) => onSearch(txt, "name")}
        />
      </Box>
      <TableContainer>
        <Table
          sx={{ minWidth: window.innerWidth }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <Button
                  onClick={() => handleClickOpenModal("products")}
                  variant="contained"
                >
                  Add
                </Button>
              </StyledTableCell>
              {head?.map((r, i) => (
                <StyledTableCell component="th" key={i}>
                  {r}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tempData
              ?.slice(
                currentPage * rowsPerPage,
                currentPage * rowsPerPage + rowsPerPage
              )
              ?.map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell component="th" scope="row" align={"right"}>
                    <IconButton
                      color="primary"
                      onClick={() => handleClickOpenModal("product", i)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => row?.id && onDeleteVendor(row?.id)}
                    >
                      <Delete />
                    </IconButton>
                  </StyledTableCell>
                  {Object.keys(keys[0])?.map((r, ind) => (
                    <StyledTableCell key={ind} align={"right"}>
                      {row[r]}
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
