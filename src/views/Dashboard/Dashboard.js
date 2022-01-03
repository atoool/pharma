import { Loader } from "component/loader/Loader";
import { Paper, Typography } from "@mui/material";
import React from "react";
import { Box } from "@mui/system";
import { get } from "api/api";
import { AppContext } from "../../context/AppContext";
import Tables from "../../component/table/Tables";
import { Charts } from "component/chart/Charts";

const data = [{ y: 155, label: "Jan" }];
export function Dashboard() {
  const { userData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";

  const [report, setReport] = React.useState([]);
  const [load, setLoad] = React.useState(false);

  const getReport = async (y) => {
    try {
      setLoad(true);
      const data1 = await get("dashboard", token);
      setReport(data1?.data?.response ?? []);
      setLoad(false);
    } catch {}
  };

  React.useEffect(() => {
    getReport();
  }, []);

  return (
    <Loader load={load}>
      <Box sx={{ m: 2, display: "flex" }}>
        {report?.cards?.map((itm, k) => (
          <Paper
            key={k}
            elevation={3}
            sx={{
              p: 3,
              mr: 2,
              width: "200px",
              backgroundColor: "#728FCE",
            }}
          >
            <Typography color={"#fff"} fontSize="15px">
              {itm?.title ?? "Title"}
            </Typography>
            <Typography color={"#fff"} fontWeight={"bold"} fontSize="25px">
              {itm?.value ?? "000"}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Charts
        data={report?.graphDate ?? data}
        xTitle="Duration"
        yTitle={"Sales"}
      />

      {report?.sales?.data && (
        <Tables
          data={report?.sales?.data ?? []}
          keys={report?.sales?.key ?? []}
          head={report?.sales?.head ?? []}
        />
      )}
    </Loader>
  );
}
