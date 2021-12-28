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
  TablePagination,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import capitalizeFirstLetter from "utils/capitalizeFirstLetter";
import { Delete, Edit } from "@mui/icons-material";
import { Fragment } from "react";

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

export default function AdvTables({ data = [], head = [], keys = [] }) {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(0);

  const onChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const onChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 700 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Data</StyledTableCell>
            {head?.map((r, i) => (
              <StyledTableCell component="th" key={i}>
                {capitalizeFirstLetter(r)}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            ?.slice(
              currentPage * rowsPerPage,
              currentPage * rowsPerPage + rowsPerPage
            )
            ?.map(
              (row, i) =>
                row?.y?.length > 0 && (
                  <Fragment key={i}>
                    <StyledTableRow>
                      <StyledTableCell rowSpan={row?.y?.length + 1}>
                        {row?.label}
                      </StyledTableCell>
                    </StyledTableRow>
                    {row?.y?.map((f, j) => (
                      <TableRow key={j}>
                        {keys?.map((r, ind) => (
                          <TableCell key={ind}>{f[r]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </Fragment>
                )
            )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={data?.length ?? 0}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </TableContainer>
  );
}
