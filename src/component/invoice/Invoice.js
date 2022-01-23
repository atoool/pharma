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
import { inWords } from "../../utils/inWords";
import logo from "../../assets/images/logo.png";

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
const dateNow = new Date().toLocaleString();
export const Invoice = React.forwardRef(({ bill }, ref) => {
  let amtTotal = 0;
  let allTotal = 0;
  let taxTotal = 0;
  bill?.products?.map((f) => {
    amtTotal += parseFloat(f?.amount) ?? 0;
    allTotal += parseFloat(f?.total) ?? 0;
    taxTotal += parseFloat(f?.amount * (f?.tax / 100)) ?? 0;
  });
  return (
    <Box
      ref={ref}
      sx={{
        height: window.innerHeight,
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
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
          }}
        >
          <img
            src={logo}
            alt=""
            style={{ width: 150, height: 60, marginRight: 10 }}
          />
          <Box
            sx={{
              flexDirection: "column",
              display: "flex",
              maxWidth: "50%",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h3" fontSize="20px">
              {bill?.outletAddress}
            </Typography>
            <Typography fontSize="12px">{bill?.outletName}</Typography>
          </Box>
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
          <Typography fontSize="12px">{`Invoice : ${
            bill?.billNo === "" ? "##########" : bill?.billNo
          }`}</Typography>
          <Typography fontSize="12px">{dateNow}</Typography>
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
          <Typography fontSize="12px">
            Payment Mode : {bill?.settlementMode}
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
                    {row?.expDate
                      ? row?.expDate !== ""
                        ? row?.expDate.split("-")[1] +
                          "/" +
                          row?.expDate.split("-")[0].substr(2)
                        : ""
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row?.salePrice}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row?.pack}</StyledTableCell>
                  <StyledTableCell align="right">{row?.amount}</StyledTableCell>
                  <StyledTableCell align="right">
                    {(row?.tax / 100) * row?.amount}
                  </StyledTableCell>
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
                <StyledTableCell align="right">{amtTotal}</StyledTableCell>
                <StyledTableCell align="right">{bill?.tax}</StyledTableCell>
                <StyledTableCell align="right">{allTotal}</StyledTableCell>
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
                <StyledTableCell colSpan={9}>CGST+SGST:</StyledTableCell>
                <StyledTableCell align="right">{bill?.tax}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan={7} sx={{ fontWeight: "bold" }}>
                  Discount: {bill?.discAmount}
                </StyledTableCell>
                <StyledTableCell colSpan={3} align="right">
                  Bill Amt.: {bill?.billAmount}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan={9}>Net Amt.:</StyledTableCell>
                <StyledTableCell align="right">
                  {bill?.roundAmount}
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
            {"--"}
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
