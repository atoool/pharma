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
import { IconButton, Button, TextField, Divider } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Modal } from "component/Modal/Modal";
import { get, post } from "api/api";
import { AppContext } from "context/AppContext";
import capitalizeFirstLetter from "utils/capitalizeFirstLetter";

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

const pData1 = [
  {
    name: "",
    hsnCode: "",
    purchaseUnit: "",
    conversionUnit: "",
    unit: "",
    purchaseDept: "",
    itemCategory: "",
    itemType: "",
    itemSubType: "",
    itemNature: "",
    inStockCount: "",
    batch: "",
    packing: "",
    expiry: "",
  },
];
const pData11 = [
  {
    Name: "",
    HSN: "",
    PUnit: "",
    CUnit: "",
    Unit: "",
    PDept: "",
    Category: "",
    Type: "",
    SubType: "",
    Nature: "",
    Stock: "",
    Batch: "",
    Packing: "",
    Expiry: "",
  },
];
const pData2 = [
  {
    prodName: "",
    batch: "",
    packing: "",
    expiry: "",
    stockCount: "",
  },
];
const pData22 = [
  {
    Product: "",
    Batch: "",
    Packing: "",
    Expiry: "",
    Stock: "",
  },
];
export function Products() {
  const { userData, setProductData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const role = userData?.user?.role ?? 3;
  const isOutlet = role === 3;
  const pData = isOutlet ? pData2 : pData1;
  const pData3 = isOutlet ? pData22 : pData11;

  const [page, setPage] = React.useState("product");
  const [open, setOpen] = React.useState(false);
  let [products, setProducts] = React.useState(pData);
  let [data, setData] = React.useState(pData);

  const handleClickOpenModal = (pg = "product", i = 0) => {
    if (pg === "product") {
      const {
        name = "",
        hsnCode = "",
        purchaseUnit = "",
        conversionUnit = "",
        unit = "",
        purchaseDept = "",
        itemCategory = "",
        itemType = "",
        itemSubType = "",
        itemNature = "",
        inStockCount = "",
        batch = "",
        packing = "",
        expiry = "",
      } = data[i];
      setProducts([
        {
          name,
          hsnCode,
          purchaseUnit,
          conversionUnit,
          unit,
          purchaseDept,
          itemCategory,
          itemType,
          itemSubType,
          itemNature,
          inStockCount,
          batch,
          packing,
          expiry,
        },
      ]);
    }
    setPage(pg);
    setOpen(true);
  };
  const onProductFetch = async () => {
    try {
      const data1 = await get("list-products", token);
      const data2 = isOutlet ? await get("list-stocks", token) : [];
      isOutlet
        ? data2?.data && setData(data2?.data)
        : data1?.data && setData(data1?.data);
      data1?.data && setProductData(data1?.data);
    } catch {}
  };

  React.useEffect(() => {
    onProductFetch();
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
      const dat = { products: products[0] };
      await post("edit-product", token, dat);
      await onProductFetch();
    } catch {}
  };

  const handleCloseModal = async (val = "") => {
    if (val === "submit" && page === "products") {
      await onAddProducts().catch(() => {});
      setProducts([...pData]);
      setOpen(false);
    } else if (val === "submit" && page === "product") {
      await onEditProduct().catch(() => {});
      setProducts([...pData]);
      setOpen(false);
    } else {
      setProducts([...pData]);
      setOpen(false);
    }
  };

  const renderModalItem = () => {
    const handleChange = (e, i, itm) => {
      let temp = [...products];
      temp[i][itm] = e.currentTarget.value;

      setProducts(temp);
    };
    const handleDelete = (i) => {
      products.splice(i, 1);
      setProducts([...products]);
    };

    return products.map((itm, index) => (
      <Box
        key={index}
        sx={{
          "& .MuiTextField-root": { m: 2 },
        }}
        validate
        autoComplete="off"
      >
        {Object.keys(itm).map((item, indx) => (
          <TextField
            key={indx}
            required
            label={item}
            type={item === "name" ? "search" : "text"}
            size="small"
            value={itm[item] ?? ""}
            placeholder={item === "expiry" ? "DD/MM/YYYY" : ""}
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
    let temp = [...products];
    temp.push({
      name: "",
      hsnCode: "",
      purchaseUnit: "",
      conversionUnit: "",
      unit: "",
      purchaseDept: "",
      itemCategory: "",
      itemType: "",
      itemSubType: "",
      itemNature: "",
      inStockCount: "",
      batch: "",
      packing: "",
      expiry: "",
    });
    console.log(temp);
    setProducts(temp);
  };

  const onDeleteProduct = async (id) => {
    try {
      await get("delete-product/" + id, token);
      await onProductFetch();
    } catch {}
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Modal
        open={open}
        handleAddRow={handleAddRowModal}
        handleClose={handleCloseModal}
        title={page === "product" ? "Edit Product" : "Add Products"}
        page={page}
        renderItem={renderModalItem}
      />
      <TableContainer>
        <Table sx={{ minWidth: 700 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {!isOutlet && (
                <StyledTableCell>
                  <Button
                    onClick={() => handleClickOpenModal("products")}
                    variant="contained"
                  >
                    Add
                  </Button>
                </StyledTableCell>
              )}
              {Object.keys(pData3[0]).map((r, i) => (
                <StyledTableCell component="th" key={i}>
                  {capitalizeFirstLetter(r)}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <StyledTableRow key={i}>
                {!isOutlet && (
                  <StyledTableCell component="th" scope="row">
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
                  <StyledTableCell key={ind} align="right">
                    {row[r]}
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
