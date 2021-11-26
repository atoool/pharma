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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";
import { Modal } from "component/Modal/Modal";
import { get, post } from "api/api";
import { AppContext } from "context/AppContext";
import capitalizeFirstLetter from "utils/capitalizeFirstLetter";
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

const pData1 = [
  {
    itemCode: "",
    name: "",
    genericName: "",
    hsnCode: "",
    purchaseUnit: "",
    conversionUnit: "",
    unit: "",
    itemType: "",
    itemCategory: "",
    tax: "",
  },
];
const pData11 = [
  {
    Code: "",
    Name: "",
    GenericName: "",
    HSN: "",
    PUnit: "",
    CUnit: "",
    Unit: "",
    Type: "",
    Category: "",
    tax: "",
  },
];
const cat = [
  "DISCOUNT MARKUP 5%",
  "MARKUP 10%",
  "MARKUP 20%",
  "MARKDOWN 5%",
  "MARKDOWN 10%",
  "MARKDOWN 20%",
];
const tx = ["9", "12", "16", "18"];
const unt = ["NOS", "BOTTLE", "INJECTION", "GRAM", "LITR"];
const typ = ["TABLET", "CAPSULE", "INJECTION"];

export function ItemMaster() {
  const { userData, setProductData, onGetVendors, onGetDept } =
    React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const isOutlet = false;
  const pData = pData1;
  const pData3 = pData11;

  const [page, setPage] = React.useState("product");
  const [open, setOpen] = React.useState(false);
  let [products, setProducts] = React.useState(pData);
  let [data, setData] = React.useState(pData);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const onClear = () => {
    setProducts([
      {
        itemCode: "",
        name: "",
        genericName: "",
        hsnCode: "",
        purchaseUnit: "",
        conversionUnit: "",
        unit: "",
        itemType: "",
        itemCategory: "",
        tax: "",
      },
    ]);
  };

  const handleClickOpenModal = (pg = "product", i = 0) => {
    if (pg === "product") {
      const {
        id = "",
        name = "",
        genericName = "",
        hsnCode = "",
        itemCode = "",
        purchaseUnit = "",
        conversionUnit = "",
        unit = "",
        itemType = "",
        itemCategory = "",
        tax = "",
      } = data[i];
      setProducts([
        {
          id,
          name,
          genericName,
          hsnCode,
          itemCode,
          purchaseUnit,
          conversionUnit,
          unit,
          itemCategory,
          itemType,
          tax,
        },
      ]);
    }
    setPage(pg);
    setOpen(true);
  };
  const onProductFetch = async () => {
    try {
      const data1 = await get("list-products-item-master", token);
      data1?.data && setData(data1?.data);
      const data2 = await get("list-products", token);
      data2?.data && setProductData(data2?.data);
    } catch {}
  };

  React.useEffect(() => {
    onProductFetch();
    onGetVendors(token);
    onGetDept(token);
  }, []);

  const onAddProducts = async () => {
    try {
      const dat = { products: products };
      await post("add-product", token, dat);
      await onProductFetch();
    } catch {}
  };

  const onEditProduct = async () => {
    try {
      const dat = products[0];
      await post("edit-product", token, dat);
      await onProductFetch();
    } catch {}
  };

  const statusCheck = (e) => {
    // if (e?.status === 200) {
    onClear();
    setOpen(false);
    // } else {
    //   enqueueSnackbar("Something went wrong", { variant: "error" });
    // }
  };

  const handleCloseModal = async (val = "") => {
    if (val === "submit") {
      if (page === "products") {
        await onAddProducts()
          .then(statusCheck)
          .catch((e) => {});
      } else if (page === "product") {
        await onEditProduct()
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
      let temp = [...products];
      temp[i][itm] = e.target.value;

      setProducts(temp);
    };
    const handleDelete = (i) => {
      products.splice(i, 1);
      setProducts([...products]);
    };

    const menus = { tax: tx, itemCategory: cat, unit: unt, itemType: typ };

    return products.map((itm, index) => (
      <Box
        key={index}
        sx={{
          "& .MuiTextField-root": { m: 2 },
        }}
        validate
        autoComplete="off"
      >
        {Object.keys(pData1[0]).map((item, indx) =>
          item === "tax" ||
          item === "itemCategory" ||
          item === "unit" ||
          item === "itemType" ? (
            <FormControl
              size="small"
              sx={{
                width: item === "tax" ? "90px" : "195px",
                mt: 2,
                ml: item === "unit" ? 2 : 4,
              }}
              required
            >
              <InputLabel>{item}</InputLabel>
              <Select
                value={itm[item]}
                label={item}
                onChange={(e) => handleChange(e, index, item)}
              >
                {menus[item].map((f, i) => (
                  <MenuItem key={i} value={f}>
                    {f}
                    {item === "tax" ? "%" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              key={indx}
              required
              label={item}
              type={"text"}
              disabled={item === "id"}
              size="small"
              value={itm[item] ?? ""}
              onChange={(txt) => handleChange(txt, index, item)}
            />
          )
        )}
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
    let temp = [...products];
    temp.push({
      name: "",
      genericName: "",
      hsnCode: "",
      itemCode: "",
      purchaseUnit: "",
      conversionUnit: "",
      unit: "",
      purchaseDept: "",
      itemCategory: "",
      itemType: "",
      tax: "",
    });
    setProducts(temp);
  };

  const onDeleteProduct = async (id) => {
    try {
      await get("delete-product/" + id, token);
      await onProductFetch();
    } catch {}
  };

  const onChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const onChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const isLoaded = data?.length > 0 && data[0]?.name === "";

  return (
    <Loader load={isLoaded}>
      <Modal
        open={open}
        handleAddRow={handleAddRowModal}
        handleClose={handleCloseModal}
        title={page === "product" ? "Edit Product" : "Add Products"}
        page={page}
        renderItem={renderModalItem}
      />
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
              {Object.keys(pData3[0]).map((r, i) => (
                <StyledTableCell component="th" key={i}>
                  {capitalizeFirstLetter(r)}
                </StyledTableCell>
              ))}
              {/* <StyledTableCell>Save</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ?.slice(
                currentPage * rowsPerPage,
                currentPage * rowsPerPage + rowsPerPage
              )
              ?.map((row, i) => (
                <StyledTableRow key={i}>
                  {!isOutlet && (
                    <StyledTableCell component="th" scope="row" align={"right"}>
                      <IconButton
                        color="primary"
                        onClick={() => handleClickOpenModal("product", i)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => row?.id && onDeleteProduct(row?.id)}
                      >
                        <Delete />
                      </IconButton>
                    </StyledTableCell>
                  )}
                  {Object.keys(pData[0]).map((r, ind) => (
                    <StyledTableCell key={ind} align={"right"}>
                      {row[r]}
                    </StyledTableCell>
                  ))}
                  {/* <StyledTableCell>
                    <IconButton color="primary" onClick={() => {}}>
                      <Save />
                    </IconButton>
                  </StyledTableCell> */}
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
