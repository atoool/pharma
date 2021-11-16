import { Charts } from "../../component/chart/Charts";
import { Loader } from "component/loader/Loader";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { Box } from "@mui/system";

export function Reports() {
  const [select, setSelect] = React.useState({ y: "Stock", x: "Daily" });
  const handleChange = (e, itm) => {
    const temp = { ...select };
    if (itm === "Duration") {
      temp.x = e.target.value;
    } else {
      temp.y = e.target.value;
    }
    setSelect(temp);
  };
  const data = [
    { y: 155, label: "Jan" },
    { y: 150, label: "Feb" },
    { y: 152, label: "Mar" },
    { y: 148, label: "Apr" },
    { y: 142, label: "May" },
    { y: 150, label: "Jun" },
    { y: 146, label: "Jul" },
    { y: 149, label: "Aug" },
    { y: 153, label: "Sept" },
    { y: 158, label: "Oct" },
    { y: 154, label: "Nov" },
    { y: 150, label: "Dec" },
  ];
  const form = [
    {
      title: "Analyze",
      items: [
        "Sales Report",
        "Sales Return",
        "Consolidated Stock",
        "Stock",
        "Expiry Items",
      ],
    },
    { title: "Duration", items: ["Daily", "Monthly", "Yearly"] },
  ];
  return (
    <Loader>
      <Box sx={{ m: 2 }}>
        {form?.map((f, i) => (
          <FormControl size="small" key={i} sx={{ ml: i === 1 ? 2 : 0 }}>
            <InputLabel>{f.title}</InputLabel>
            <Select
              value={i === 0 ? select?.y : select?.x}
              label={f.title}
              onChange={(e) => handleChange(e, f.title)}
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
      <Charts data={data} xTitle="Duration" yTitle={select.y} />
    </Loader>
  );
}
