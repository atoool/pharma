import Tables from "../../component/table/Tables";
import React from "react";
import { Loader } from "component/loader/Loader";
import { Box, styled } from "@mui/system";
import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
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
import { get, post } from "api/api";
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
const head = [
  "Quotation Date",
  "Valid Date",
  "Vendor",
  "Department",
  "Subject",
  "Status",
];
const head2 = ["Item", "Min Qty", "MRP", "Rate", "Tax", "Tax Amt", "Net Rate"];
const keys = [
  "quotationDate",
  "validDate",
  "name",
  "department",
  "subject",
  "status",
];
const data = [
  {
    quotationDate: "",
    validDate: "",
    name: "",
    department: "",
    subject: "",
    status: "",
    items: [{ itemName: "", itemId: "", rate: "" }],
  },
];
const data2 = {
  quotationDate: "",
  quotationNumber: generateBillNo("QT"),
  validDate: "",
  vendor: "",
  subject: "",
  status: "",
  department: "",
  deliveryDate: "",
  items: [
    {
      itemName: "",
      minQty: "",
      mrp: "",
      rate: "",
      taxSlab: "",
      taxAmount: "",
      netRate: "",
    },
  ],
};

export const Quotation = () => {
  const { userData, vendors, dept, onGetVendors, onGetDept } =
    React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [open, setModal] = React.useState(false);
  const [open2, setModal2] = React.useState(false);
  const [quotes, setQuotes] = React.useState(data2);
  const [quotations, setQuotations] = React.useState(data);
  const [tempQuotations, setTempQuotations] = React.useState(data);
  const [quoteNum, setQuoteNum] = React.useState(0);
  const [load, setLoad] = React.useState(false);
  const [productData, setProductData] = React.useState([{ id: "", name: "" }]);

  const getProducts = async (id) => {
    try {
      const dat = await get("list-product-in-quotation", token);
      setProductData(
        dat?.data?.response ?? [
          {
            id: "",
            name: "",
          },
        ]
      );
    } catch {}
  };

  React.useEffect(() => {
    getProducts().catch(() => {});
    onGetDept(token).catch(() => {});
    onGetVendors(token).catch(() => {});
  }, []);

  const getQuotations = async (id) => {
    try {
      setLoad(true);
      const dat = await get("list-quotations", token);
      setQuotations(dat?.data?.response ?? []);
      setTempQuotations(dat?.data?.response ?? []);

      setLoad(false);
    } catch {}
  };

  React.useEffect(() => {
    getQuotations();
  }, []);

  const handleCloseModal = async (action) => {
    if (action === "submit") {
      try {
        await post("new-quotation", token, quotes);
        await getQuotations();
      } catch {}
    }
    setModal(false);
  };

  const onAddRow = () => {
    let temp = { ...quotes };
    temp.items.push({
      itemName: "",
      minQty: "",
      mrp: "",
      rate: "",
      taxSlab: "",
      taxAmount: "",
      netRate: "",
    });
    setQuotes(temp);
  };

  const onDeleteRow = (id) => {
    let temp = { ...quotes };
    temp.items = quotes?.items.filter((f, i) => i !== id);
    setQuotes(temp);
  };

  const onOpenModal = () => setModal(true);

  const onItemChange = async (e, i, itm) => {
    let temp = { ...quotes };
    if (itm === "vendor") {
      temp[itm] = e.label;
      temp["vendorId"] = e.id;
      setQuotes(temp);
    } else if (itm === "department") {
      temp[itm] = e.label;
      temp["departmentId"] = e.id;
      setQuotes(temp);
    } else if (itm === "productId") {
      temp.items[i].itemId = e;
      temp.items[i].itemName = e;
      setQuotes(temp);
    } else if (i === -1) {
      temp[itm] = e.target.value;
      setQuotes(temp);
    } else {
      const val = temp.items[i];
      val[itm] = e.target.value;
      const total = val.minQty * val.rate;
      val.taxAmount = total * val.taxSlab * 0.01;
      val.netRate = total + val.taxAmount;
      setQuotes(temp);
    }
  };

  const renderModal = () => {
    return (
      <Loader>
        <Box
          sx={{
            bgcolor: "#FBF7F0",
            p: 2,
            width: window.innerWidth,
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Autocomplete
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              onChange={(e, v) => v?.id && onItemChange(v, -1, "vendor")}
              options={vendors?.map((option) => {
                return {
                  label: option.name,
                  id: option.id,
                };
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vendor"
                  size="small"
                  sx={{ mr: 2, width: "250px" }}
                />
              )}
            />
            <TextField
              label="Quotation Date"
              size="small"
              type="datetime-local"
              sx={{ mr: 2, width: "250px" }}
              InputLabelProps={{ shrink: true }}
              value={quotes?.quotationDate}
              onChange={(e) => onItemChange(e, -1, "quotationDate")}
            />
            <TextField
              label="Valid Date"
              size="small"
              type="date"
              sx={{ mr: 2, width: "250px" }}
              InputLabelProps={{ shrink: true }}
              value={quotes?.validDate}
              onChange={(e) => onItemChange(e, -1, "validDate")}
            />
            <TextField
              label="Quotation Number"
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ width: "250px" }}
              value={quotes?.quotationNumber}
              disabled
              onChange={(e) => onItemChange(e, -1, "vendor")}
            />
          </Box>

          <Box sx={{ display: "flex", mt: 2 }}>
            <Autocomplete
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              onChange={(e, v) => v?.id && onItemChange(v, -1, "department")}
              options={dept?.map((option) => {
                return {
                  label: option.name,
                  id: option.id,
                };
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Department"
                  size="small"
                  sx={{ mr: 2, width: "250px" }}
                />
              )}
            />
            <TextField
              label="Subject"
              size="small"
              sx={{ mr: 2, width: "250px" }}
              value={quotes?.subject}
              onChange={(e) => onItemChange(e, -1, "subject")}
            />

            <TextField
              label="Delivery Date"
              size="small"
              type="date"
              sx={{ mr: 2, width: "250px" }}
              value={quotes?.deliveryDate}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => onItemChange(e, -1, "deliveryDate")}
            />
            <TextField
              label="Remarks"
              size="small"
              value={quotes?.remarks}
              sx={{ width: "250px" }}
              onChange={(e) => onItemChange(e, -1, "remarks")}
            />
          </Box>
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
                {head2.map((itm, i) => (
                  <StyledTableCell key={i} align="right">
                    {itm}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes?.items?.map((row, ind) => (
                <StyledTableRow key={ind}>
                  <StyledTableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => onDeleteRow(ind)}
                    >
                      <Delete />
                    </IconButton>
                  </StyledTableCell>

                  {Object.keys(data2?.items[0]).map((itms, i) => {
                    if (itms === "itemId") {
                      return null;
                    } else if (itms === "itemName") {
                      return (
                        <StyledTableCell align="right" key={i}>
                          <Autocomplete
                            isOptionEqualToValue={(option, value) =>
                              option.label === value.label
                            }
                            onChange={(e, v) =>
                              v?.label &&
                              onItemChange(v?.label, ind, "productId")
                            }
                            options={productData?.map((option) => {
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
                                sx={{ width: 230 }}
                              />
                            )}
                          />
                        </StyledTableCell>
                      );
                    } else if (itms === "taxSlab") {
                      return (
                        <StyledTableCell align="right" key={i}>
                          <FormControl size="small" sx={{ width: 90 }}>
                            <Select
                              value={row?.taxSlab}
                              onChange={(e) => onItemChange(e, ind, "taxSlab")}
                            >
                              <MenuItem value="9">9%</MenuItem>
                              <MenuItem value="12">12%</MenuItem>
                              <MenuItem value="16">16%</MenuItem>
                              <MenuItem value="18">18%</MenuItem>
                            </Select>
                          </FormControl>
                        </StyledTableCell>
                      );
                    } else if (itms === "taxAmount" || itms === "netRate") {
                      return (
                        <StyledTableCell key={i}>{row[itms]}</StyledTableCell>
                      );
                    } else if (itms !== "itemName" || itms !== "taxSlab") {
                      return (
                        <StyledTableCell key={i}>
                          <TextField
                            label=""
                            size="small"
                            sx={{ width: "70px" }}
                            value={row[itms]}
                            onChange={(e) => onItemChange(e, ind, itms)}
                          />
                        </StyledTableCell>
                      );
                    }
                  })}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Loader>
    );
  };

  const renderModalItem2 = () => (
    <Tables
      head={head2}
      keys={Object.keys(data2?.items[0])}
      data={tempQuotations[quoteNum]?.items}
    />
  );

  const onViewItem = (i) => {
    setQuoteNum(i);
    setModal2(true);
  };

  const onRespond = async (status = "not approved", id = "") => {
    try {
      if (status === "not approved") {
        await get("approve-quotation/" + id, token);
      }
      await getQuotations();
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
        onClick={() =>
          onRespond(quotations[index]?.status, quotations[index]?.id)
        }
        disabled={quotations[index]?.status === "approved"}
        sx={{ ml: 2 }}
      >
        {quotations[index]?.status === "not approved" ? "Approve" : "NA"}
      </Button>
    </>
  );

  const onSearch = (e, type) => {
    const search = e.target.value?.toLowerCase();
    const temp = [...quotations];
    const tmpData = temp?.filter(
      (f) => f[type]?.toLowerCase()?.indexOf(search) > -1
    );
    tmpData && setTempQuotations(tmpData);
    (search === "" || !search) && setTempQuotations(quotations);
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
        title={"Quotation items"}
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
        <Button variant="contained" color="primary" onClick={onOpenModal}>
          New Quotation
        </Button>
        <TextField
          required
          label={"Vendor Name"}
          type={"search"}
          size="small"
          onChange={(txt) => onSearch(txt, "name")}
        />
        <TextField
          required
          label={"Department"}
          type={"search"}
          size="small"
          onChange={(txt) => onSearch(txt, "department")}
        />
      </Box>
      <Tables
        keys={keys}
        head={head}
        data={tempQuotations}
        ExtraBody={ExtraBody}
        ExtraHead={ExtraHead}
        extra
      />
    </Loader>
  );
};
