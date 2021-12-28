import { Charts } from "../../component/chart/Charts";
import { Loader } from "component/loader/Loader";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { Box } from "@mui/system";
import { get } from "api/api";
import { AppContext } from "../../context/AppContext";
import AdvTables from "../../component/table/AdvTables";

const data = [{ y: 155, label: "Jan" }];

let formData2 = [
  {
    title: "Analyze",
    items: [
      "Items",
      "Stocks",
      "Sales",
      "Sales Return",
      "Expire Stock",
      "Indent",
      "Issue",
    ],
  },
  { title: "Duration", items: ["Daily", "Monthly", "Yearly"] },
  { title: "Batch", items: ["none"] },
  { title: "Outlet", items: ["none"] },
];
let formData1 = [
  {
    title: "Analyze",
    items: [
      "Items",
      "Stocks",
      "Sales",
      "Sales Return",
      "Expire Stock",
      "Indent",
      "Issue",
      "User Last Login",
    ],
  },
  { title: "Duration", items: ["Daily", "Monthly", "Yearly"] },
  { title: "Batch", items: ["none"] },
  { title: "Outlet", items: ["none"] },
];

export function Reports() {
  const { userData, setProductData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const role = userData?.user?.role ?? "";
  const [select, setSelect] = React.useState({
    y: "Stocks",
    x: "Daily",
    b: "none",
    o: "none",
  });
  const [report, setReport] = React.useState([]);
  const [form, setForm] = React.useState(role !== 3 ? formData1 : formData2);
  const [load, setLoad] = React.useState(false);

  const handleChange = async (e, itm) => {
    const temp = { ...select };
    if (itm === "Duration") {
      temp.x = e.target.value;
    } else if (itm === "Batch") {
      temp.b = e.target.value;
      const key = temp.b === "none" ? "" : "/" + temp.b;
      await getReport(temp.y + key).catch(() => {});
    } else if (itm === "Outlet") {
      temp.o = e.target.value;
      let key = "";
      if (temp.o !== "none") {
        key = temp.o;
        key = "/" + key.split("-")[1];
      }
      await getReport(temp.y + key).catch(() => {});
    } else {
      temp.y = e.target.value;
      await getReport(temp.y).catch(() => {});
    }
    setSelect(temp);
  };

  const getReport = async (y) => {
    try {
      setLoad(true);
      const data1 = await get("reports/" + y?.trim(), token);
      setReport(data1?.data?.response ?? []);
      setLoad(false);
    } catch {}
  };

  const onProductFetch = async () => {
    try {
      const data1 = await get("list-products-item-master", token).catch(
        () => {}
      );
      const data2 = await get("list-products", token).catch(() => {});
      const data3 = await get("list-stocks", token).catch(() => {});
      const data4 = await get("batchnos", token).catch(() => {});
      const datas = await get("outlet-users", token);
      setProductData({
        wStock: data2?.data ?? [],
        oStock: data3?.data ?? [],
        master: data1?.data ?? [],
      });
      const temp = [...form];
      const out = datas?.data ?? [];
      const outs = [];
      out?.length > 0 && out?.map((f) => outs.push(f?.name + "-" + f?.id));
      const bt = data4?.data?.response ?? [];
      temp[2].items = ["none", ...bt];
      temp[3].items = ["none", ...outs];
      setForm(temp);
    } catch {}
  };

  React.useEffect(() => {
    getReport(select.y);
    onProductFetch();
  }, []);

  const isDisabled = (t) => {
    if (t === "Batch" || t === "Outlet") {
      return (
        (t === "Batch" && select.y !== "Stocks") ||
        (t === "Outlet" &&
          !(
            select.y === "Sales" ||
            select.y === "Issue" ||
            select.y === "Stocks"
          ))
      );
    } else if (t === "User Last Login") {
      return true;
    }
    return false;
  };

  const v = ["y", "x", "b", "o"];

  return (
    <Loader load={load}>
      <Box sx={{ m: 2 }}>
        {form?.map(
          (f, i) =>
            ((role === 3 && f.title !== "Outlet") || role !== 3) && (
              <FormControl size="small" key={i} sx={{ ml: i === 0 ? 0 : 2 }}>
                <InputLabel>{f.title}</InputLabel>
                <Select
                  disabled={isDisabled(f?.title)}
                  value={select[v[i]]}
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
            )
        )}
      </Box>
      {/* <Charts
        data={report[select.x?.toLowerCase()] ?? data}
        xTitle="Duration"
        yTitle={select.y}
      /> */}
      <AdvTables
        data={report[select.x?.toLowerCase()] ?? []}
        keys={report["key"]}
        head={report["head"]}
      />
    </Loader>
  );
}
