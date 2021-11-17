import { Charts } from "../../component/chart/Charts";
import { Loader } from "component/loader/Loader";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { Box } from "@mui/system";
import { get } from "api/api";
import { AppContext } from "context/AppContext";

const data = [{ y: 155, label: "Jan" }];

const form = [
  {
    title: "Analyze",
    items: [
      "Sales",
      "Sales Return",
      "Consolidated Stock",
      "Stock",
      "Expiry Items",
    ],
  },
  { title: "Duration", items: ["Daily", "Monthly", "Yearly"] },
];

export function Reports() {
  const { userData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [select, setSelect] = React.useState({ y: "Sales", x: "Daily" });
  const [report, setReport] = React.useState([]);
  const [load, setLoad] = React.useState(false);

  const handleChange = async (e, itm) => {
    const temp = { ...select };
    if (itm === "Duration") {
      temp.x = e.target.value;
    } else {
      temp.y = e.target.value;
      await getReport(temp.y).catch(() => {});
    }
    setSelect(temp);
  };

  const getReport = async (y) => {
    try {
      setLoad(true);
      const data1 = await get("reports/" + y?.toLowerCase(), token);
      setReport(data1?.data?.response ?? []);
      console.warn(data1?.data?.response);
      setLoad(false);
    } catch {}
  };

  React.useEffect(() => {
    getReport(select.y);
  }, []);

  return (
    <Loader load={load}>
      <Box sx={{ m: 2 }}>
        {form?.map((f, i) => (
          <FormControl size="small" key={i} sx={{ ml: i === 1 ? 2 : 0 }}>
            <InputLabel>{f.title}</InputLabel>
            <Select
              value={i === 0 ? select?.y : select?.x}
              label={f.title}
              onChange={async (e) =>
                await handleChange(e, f.title).catch(() => {})
              }
            >
              {f?.items?.map((j) => (
                <MenuItem key={j} value={j}>
                  {j}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </Box>
      <Charts
        data={report[select.x?.toLowerCase()] ?? data}
        xTitle="Duration"
        yTitle={select.y}
      />
    </Loader>
  );
}
