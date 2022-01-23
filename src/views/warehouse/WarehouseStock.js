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
import capitalizeFirstLetter from "utils/capitalizeFirstLetter";
import { Loader } from "component/loader/Loader";
import { useSnackbar } from "notistack";
import { CSVLink } from "react-csv";
import { generateBillNo } from "utils/generateBillNo";

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

export function WarehouseStock() {
  const pData1 = [
    {
      name: "",
      itemCode: "",
      hsnCode: "",
      genericName: "",
      batch: "",
      purchaseUnit: "",
      unit: "",
      itemCategory: "",
      itemType: "",
      stock: "",
      rate: "",
      packing: "",
      expiry: "",
      price: "",
    },
  ];
  const pData11 = [
    {
      Name: "",
      Code: "",
      HSN: "",
      GenericName: "",
      Batch: "",
      PUnit: "",
      Unit: "",
      Category: "",
      Type: "",
      Stock: "",
      Rate: "",
      Packing: "",
      Expiry: "",
      Price: "",
    },
  ];
  const { userData, setProductData, productData, onGetVendors, onGetDept } =
    React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const isOutlet = false;
  const pData = pData1;
  const pData3 = pData11;

  const [page, setPage] = React.useState("product");
  const [open, setOpen] = React.useState(false);
  let [products, setProducts] = React.useState(pData);
  let [data, setData] = React.useState(pData);
  let [tempData, setTempData] = React.useState(pData);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const onClear = () => {
    setProducts([
      {
        name: "",
        itemCode: "",
        hsnCode: "",
        genericName: "",
        batch: "",
        purchaseUnit: "",
        unit: "",
        itemCategory: "",
        itemType: "",
        stock: "",
        rate: "",
        packing: "",
        expiry: "",
        unitPrice: "",
      },
    ]);
  };

  const handleClickOpenModal = (pg = "product", i = 0) => {
    if (pg === "product") {
      const {
        id = "",
        name = "",
        hsnCode = "",
        itemCode = "",
        purchaseUnit = "",
        conversionUnit = "",
        unit = "",
        purchaseDept = "",
        itemCategory = "",
        itemType = "",
        itemSubType = "",
        itemNature = "",
        stock = "",
        batch = "",
        packing = "",
        expiry = "",
        unitPrice = "",
      } = tempData[i];
      setProducts([
        {
          id,
          name,
          hsnCode,
          itemCode,
          purchaseUnit,
          conversionUnit,
          unit,
          purchaseDept,
          itemCategory,
          itemType,
          itemSubType,
          itemNature,
          stock,
          batch,
          packing,
          expiry,
          unitPrice,
        },
      ]);
    }
    setPage(pg);
    setOpen(true);
  };

  const onProductFetch = async () => {
    try {
      const data1 = await get("list-products", token).catch(() => {});
      if (data1?.data) {
        setData(data1?.data);
        setTempData(data1?.data);
      }
      setProductData({
        wStock: data1?.data ?? [],
        oStock: productData?.oStock ?? [],
        master: productData?.master ?? [],
      });
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
            type={item === "expiry" ? "date" : "text"}
            InputLabelProps={
              item === "expiry"
                ? {
                    shrink: true,
                  }
                : {}
            }
            disabled={item === "id"}
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
    let temp = [...products];
    temp.push({
      name: "",
      hsnCode: "",
      itemCode: "",
      purchaseUnit: "",
      conversionUnit: "",
      unit: "",
      purchaseDept: "",
      itemCategory: "",
      itemType: "",
      itemSubType: "",
      itemNature: "",
      stock: "",
      batch: "",
      packing: "",
      expiry: "",
      unitPrice: "",
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
          label={"Item Name"}
          type={"search"}
          size="small"
          onChange={(txt) => onSearch(txt, "name")}
        />
        <TextField
          required
          label={"Item Code"}
          type={"search"}
          size="small"
          onChange={(txt) => onSearch(txt, "itemCode")}
        />
        <TextField
          required
          label={"Generic Name"}
          type={"search"}
          size="small"
          onChange={(txt) => onSearch(txt, "genericName")}
        />
        <TextField
          required
          label={"Batch"}
          type={"search"}
          size="small"
          onChange={(txt) => onSearch(txt, "batch")}
        />
        <Button variant="contained">
          <CSVLink
            data={data}
            filename={generateBillNo("ITMMASTER") + ".csv"}
            target="_blank"
            style={{ textDecorationLine: "none", color: "inherit" }}
          >
            EXPORT CSV
          </CSVLink>
        </Button>
      </Box>
      <TableContainer>
        <Table
          sx={{ minWidth: window.innerWidth }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              {Object.keys(pData3[0]).map((r, i) => (
                <StyledTableCell component="th" key={i}>
                  {capitalizeFirstLetter(r)}
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
                  {/* {!isOutlet && (
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
                  )} */}
                  {Object.keys(pData[0]).map((r, ind) => (
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
