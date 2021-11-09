import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { inWords } from "utils/inWords";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    padding: 2,
    width: "100%",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 2,
  },
}));

const data = {
  customerName: "",
  doctorName: "",
  outletUserId: "",
  billNo: "",
  scheme: "",
  date: new Date().toLocaleString(),
  products: [
    {
      productId: "",
      quantity: "",
      hsnCode: "",
      itemName: "",
      batch: "",
      expDate: "",
      salePrice: "",
      qty: "",
      amount: "",
      tax: "",
      netRate: "",
    },
  ],
  billAmount: "",
  discAmount: "",
  tax: "",
  roundAmount: "",
  remarks: "",
  balance: "",
  payment: "",
  inPercent: "",
  inAmount: "",
};

export const Invoice = React.forwardRef(({ bill = data }, ref) => {
  let total = 0;
  bill?.products?.map((f) => (total += f?.salePrice));
  return (
    <Box
      ref={ref}
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        margin: 5,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            flexDirection: "column",
            display: "flex",
            maxWidth: "50%",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h3" fontSize="20px">
            MVR CANCER CENTRE & RESEARCH INSTITUTE
          </Typography>
          <Typography fontSize="12px">
            CP 13/516 B,C, Vellalaseri, Poolacode, Choolor, via NIT P.O.
            Kozhikode 673601 03-11-2021 03:43 PM Contact
            No.:0495-2289500,0495-7199525 GST No: 32AABAC1051D1ZP, Email:
            pharmacy@mvrccri.co, Whatsapp No: 8330 014 003, Google Pay No: 8330
            014 042 DL. No. : KL-KKD-116153,116154. Location-OP PHARMACY, Ground
            Floor, Hospital Block
          </Typography>
        </Box>
        <Box
          sx={{
            flexDirection: "column",
            display: "flex",
            maxWidth: "20%",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <Typography variant="h3" fontSize="20px">
            SALE BILL
          </Typography>
          <Typography fontSize="12px">{`Invoice #: ${bill?.billNo}`}</Typography>
          <Typography fontSize="12px">{new Date().toLocaleString()}</Typography>
        </Box>
      </Box>
      <Box
        sx={{ height: 2, width: "100%", backgroundColor: "#000", mt: 2, mb: 2 }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box
          sx={{
            flexDirection: "column",
            display: "flex",
            maxWidth: "50%",
            flexWrap: "wrap",
          }}
        >
          <Typography fontWeight="bold" fontSize="13px">
            Name: Mr/Ms. {bill?.customerName}
          </Typography>
          <Typography fontSize="12px">Payment Mode : Cash</Typography>
        </Box>
        <Box
          sx={{
            flexDirection: "column",
            display: "flex",
            maxWidth: "20%",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <Typography fontSize="12px">Category : {bill?.scheme}</Typography>
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        <TableContainer sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>PARTICULARS</StyledTableCell>
                <StyledTableCell align="right">QTY</StyledTableCell>
                <StyledTableCell align="right">HSN</StyledTableCell>
                <StyledTableCell align="right">MFG</StyledTableCell>
                <StyledTableCell align="right">BATCH</StyledTableCell>
                <StyledTableCell align="right">EXP</StyledTableCell>
                <StyledTableCell align="right">MRP</StyledTableCell>
                <StyledTableCell align="right">PACK</StyledTableCell>
                <StyledTableCell align="right">AMT</StyledTableCell>
                <StyledTableCell align="right">GST</StyledTableCell>
                <StyledTableCell align="right">TOTAL</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ p: 0 }}>
              {bill?.products.map((row) => (
                <TableRow key={row}>
                  <StyledTableCell>{row?.itemName}</StyledTableCell>
                  <StyledTableCell align="right">
                    {row?.quantity}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row?.hsnCode}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row?.mfg}</StyledTableCell>
                  <StyledTableCell align="right">{row?.batch}</StyledTableCell>
                  <StyledTableCell align="right">
                    {row?.expDate.split("-")[1] +
                      "/" +
                      row?.expDate.split("-")[0].substr(2)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row?.salePrice}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row?.pack}</StyledTableCell>
                  <StyledTableCell align="right">{row?.amount}</StyledTableCell>
                  <StyledTableCell align="right">{row?.tax}</StyledTableCell>
                  <StyledTableCell align="right">{row?.amount}</StyledTableCell>
                </TableRow>
              ))}
              <TableRow>
                <StyledTableCell>
                  No. of items: {bill?.products?.length ?? 0}
                </StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="right">{total}</StyledTableCell>
                <StyledTableCell align="right">0</StyledTableCell>
                <StyledTableCell align="right">{total}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell rowSpan={5}>
                  <Typography fontSize="10px">{`Net Amount In words: ${inWords(
                    bill?.roundAmount
                  )}`}</Typography>
                  <Typography fontSize="10px">
                    **All figures are in Rupees (INR) only
                  </Typography>
                </StyledTableCell>
                <StyledTableCell colSpan={7}>CGST: 0</StyledTableCell>
                <StyledTableCell colSpan={3} align="right">
                  SGST: 0
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan={7}>
                  Discount: {bill?.discAmount}
                </StyledTableCell>
                <StyledTableCell colSpan={3} align="right">
                  Bill Amt.: {bill?.billAmount}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan={7}>Round Off: 0</StyledTableCell>
                <StyledTableCell colSpan={3} align="right">
                  Net Amt.: {bill?.roundAmount}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan={9} sx={{ fontWeight: "bold" }}>
                  Amt. Paid:
                </StyledTableCell>
                <StyledTableCell align="right" sx={{ fontWeight: "bold" }}>
                  {bill?.payment}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan={9}>Balance: </StyledTableCell>
                <StyledTableCell align="right">{bill?.balance}</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
          alignSelf: "flex-end",
          mt: 8,
        }}
      >
        <Box>
          <Typography fontSize="16px" textAlign="center">
            Thesni Noorjahan K
          </Typography>
          <Typography fontSize="14px" textAlign="center">
            Prepared by
          </Typography>
        </Box>
        <Box>
          <Typography fontSize="16px" textAlign="center">
            {"--"}
          </Typography>
          <Typography fontSize="14px" textAlign="center">
            Dispensed & Verified by
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{ height: 2, width: "100%", backgroundColor: "#000", mt: 2, mb: 2 }}
      />
    </Box>
  );
});
