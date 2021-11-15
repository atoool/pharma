import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import capitalizeFirstLetter from "utils/capitalizeFirstLetter";
import { Delete, Edit } from "@mui/icons-material";

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

export default function Tables({
  data = [],
  head = [],
  keys = [],
  extra = false,
  ExtraHead = () => {},
  ExtraBody = () => {},
}) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 700 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {extra && (
              <StyledTableCell>
                <ExtraHead />
              </StyledTableCell>
            )}
            {head?.map((r, i) => (
              <StyledTableCell component="th" key={i}>
                {capitalizeFirstLetter(r)}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, i) => (
            <StyledTableRow key={i}>
              {extra && (
                <StyledTableCell align="right">
                  <ExtraBody index={i} />
                </StyledTableCell>
              )}
              {keys?.map((r, ind) => (
                <StyledTableCell key={ind} align="right">
                  {row[r]}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
