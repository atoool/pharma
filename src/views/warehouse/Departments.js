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

const keys = [
  {
    name: "",
  },
];
const head = ["Name"];
export function Departments() {
  const { userData, onGetDept } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";

  const [page, setPage] = React.useState("product");
  const [open, setOpen] = React.useState(false);
  let [department, setDepartment] = React.useState(keys);
  let [data, setData] = React.useState(keys);
  let [tempData, setTempData] = React.useState(keys);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const onClear = () => {
    setDepartment([
      {
        name: "",
      },
    ]);
  };

  const handleClickOpenModal = (pg = "product", i = 0) => {
    if (pg === "product") {
      const { id = "", name = "" } = tempData[i];
      setDepartment([{ id, name }]);
    }
    setPage(pg);
    setOpen(true);
  };
  const onDeptFetch = async () => {
    try {
      const data1 = await onGetDept(token);
      setData(data1 ?? []);
      setTempData(data1 ?? []);
    } catch {}
  };

  React.useEffect(() => {
    onDeptFetch();
  }, []);

  const onAddDept = async () => {
    try {
      await post("new-department", token, department[0]);
      console.warn(department);
      await onDeptFetch();
    } catch {}
  };

  const onEditDept = async () => {
    try {
      const dat = department[0];
      await post("edit-department", token, dat);
      await onDeptFetch();
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
        await onAddDept()
          .then(statusCheck)
          .catch((e) => {});
      } else if (page === "product") {
        await onEditDept()
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
      let temp = [...department];
      temp[i][itm] = e.currentTarget.value;

      setDepartment(temp);
    };
    const handleDelete = (i) => {
      department.splice(i, 1);
      setDepartment([...department]);
    };

    return department.map((itm, index) => (
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
    let temp = [...department];
    temp.push({
      name: "",
    });
    setDepartment(temp);
  };

  const onDeleteDept = async (id) => {
    try {
      await get("delete-department/" + id, token);
      await onDeptFetch();
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
        title={page === "product" ? "Edit Department" : "Add Department"}
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
                      onClick={() => row?.id && onDeleteDept(row?.id)}
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
