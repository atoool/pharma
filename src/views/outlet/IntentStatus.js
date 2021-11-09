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

export function IntentStatus() {
  const { userData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [data, setData] = React.useState(iData);

  const onIndentFetch = async () => {
    try {
      const datas = await get("list-stocks-requests-outlet", token);
      datas?.data && setData(datas?.data);
    } catch {}
  };

  React.useEffect(() => {
    onIndentFetch();
  }, []);

  const onDelivery = async (id) => {
    try {
      await get("request-product-delivered/" + id, token);
      await onIndentFetch();
    } catch {}
  };

  return (
    <Box sx={{ width: "100%" }}>
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
    </Box>
  );
}
