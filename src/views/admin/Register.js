import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { post } from "api/api";
import { Loader } from "component/loader/Loader";
import { AppContext } from "context/AppContext";
import { useSnackbar } from "notistack";
import React from "react";

export const Register = () => {
  const { userData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  const onClear = () =>
    setData({
      name: "",
      email: "",
      password: "",
      role: "",
    });

  const onChange = (e, key) => {
    const temp = { ...data };
    const val = e?.target?.value ?? "";
    temp[key] = val;
    setData(temp);
  };

  const onSubmit = async () => {
    try {
      const { name = "", email = "", password = "", role = "" } = data;
      const check =
        name === "" && email === "" && password === "" && role === "";
      if (!check) {
        await post("register", token)
          .then(() => {
            enqueueSnackbar("Success", { variant: "success" });
            onClear();
          })
          .catch(() =>
            enqueueSnackbar("Something went wrong! try again later", {
              variant: "error",
            })
          );
      } else {
        enqueueSnackbar("Error! Fill all the required field", {
          variant: "error",
        });
      }
    } catch {}
  };
  return (
    <Loader>
      <Box
        sx={{ display: "flex", flexDirection: "column", m: 2, width: "50%" }}
      >
        <TextField
          required
          label="Name"
          size="small"
          value={data?.name}
          onChange={(e) => onChange(e, "name")}
          sx={{ mb: 2 }}
        />
        <TextField
          required
          label="Email"
          size="small"
          value={data?.email}
          onChange={(e) => onChange(e, "email")}
          sx={{ mb: 2 }}
        />
        <TextField
          required
          label="Password"
          size="small"
          id="registerPass"
          value={data?.password}
          onChange={(e) => onChange(e, "password")}
          sx={{ mb: 2 }}
        />
        <FormControl size="small" sx={{ mb: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select
            required
            label="Role"
            value={data?.role}
            onChange={(e) => onChange(e, "role")}
          >
            <MenuItem value={"1"}>Admin</MenuItem>
            <MenuItem value={"2"}>Manager</MenuItem>
            <MenuItem value={"3"}>Outlet</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </Loader>
  );
};
