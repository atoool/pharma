import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { post, get } from "api/api";
import { Loader } from "../../component/loader/Loader";
import { Modal } from "../../component/Modal/Modal";
import { AppContext } from "context/AppContext";
import { useSnackbar } from "notistack";
import React from "react";
import Tables from "../../component/table/Tables";
import { Edit } from "@mui/icons-material";

export const Register = () => {
  const { userData } = React.useContext(AppContext);
  const token = userData?.token?.accessToken ?? "";
  const role = userData?.user?.role ?? "";
  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [open, setOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [load, setLoad] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  const [usersTemp, setUsersTemp] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const getUsers = async () => {
    setLoad(true);
    try {
      const dat = await get("user-list", token);
      setUsers(dat?.data?.response ?? []);
      setUsersTemp(dat?.data?.response ?? []);
      setLoad(false);
    } catch {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    getUsers();
  }, []);

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
        await post(isEdit ? "edit-user" : "register", token, data)
          .then(async () => {
            enqueueSnackbar("Success", { variant: "success" });
            setOpen(false);
            await getUsers().catch(() => {});
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

  const renderModalItem = () => {
    const keys = ["name", "email", "password", "role", "outletName", "address"];
    const head = [
      "Name",
      "Username",
      "Password",
      "Role",
      "Outlet Name",
      "Address",
    ];
    const check = (itm) =>
      data?.role === 3 ||
      !(
        (data?.role === 2 || data?.role === "") &&
        (itm === "outletName" || itm === "address")
      );
    const ifOutlet = (itm) => {
      return role === 3
        ? itm === "outletName" || itm === "address" || itm === "role"
        : role === 2
        ? itm === "role"
        : false;
    };
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", m: 2, width: "50%" }}
      >
        {keys.map((itm, i) =>
          itm === "role" ? (
            <FormControl size="small" sx={{ mb: 2 }} key={i}>
              <InputLabel>Role</InputLabel>
              <Select
                required
                disabled={ifOutlet(itm)}
                label={head[i]}
                value={data[itm]}
                onChange={(e) => onChange(e, itm)}
              >
                <MenuItem value={2}>Manager</MenuItem>
                <MenuItem value={3}>Outlet</MenuItem>
              </Select>
            </FormControl>
          ) : (
            check(itm) && (
              <TextField
                key={i}
                required={isEdit ? itm !== "password" : true}
                size="small"
                disabled={ifOutlet(itm)}
                InputLabelProps={
                  isEdit
                    ? itm === "password" && {
                        shrink: true,
                      }
                    : {}
                }
                label={head[i]}
                value={data[itm]}
                onChange={(e) => onChange(e, itm)}
                sx={{ mb: 2 }}
                placeholder={
                  isEdit ? (itm === "password" ? "*******" : "") : ""
                }
              />
            )
          )
        )}
        <Button variant="contained" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    );
  };

  const ExtraHead = () => <>{"Action"}</>;

  const ExtraBody = ({ index = 0 }) => (
    <>
      <IconButton
        color="primary"
        onClick={() => {
          const temp = usersTemp[index];
          temp.password = "";
          setData(temp);
          setIsEdit(true);
          setOpen(true);
        }}
      >
        <Edit />
      </IconButton>
      {/* <IconButton color="primary" onClick={() => onEditItem(index)}>
        <Edit />
      </IconButton> */}
    </>
  );

  const onSearch = (search, type) => {
    const temp = [...users];
    if (!search || search === "") {
      setUsersTemp(temp);
    } else if (temp?.length !== 0) {
      const temp1 =
        temp?.filter(
          (f) =>
            f[type]?.toLowerCase().indexOf(search?.toLowerCase() ?? "") > -1
        ) ?? [];
      setUsersTemp(temp1);
    }
  };

  return (
    <Loader load={load}>
      <Modal
        open={open}
        title={isEdit ? "Edit User" : "Add User"}
        show={false}
        handleClose={() => {
          setOpen(false);
          onClear();
        }}
        renderItem={renderModalItem}
      />
      {role !== 3 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            bgcolor: "#FBF7F0",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <TextField
            label="Name search"
            size="small"
            type="search"
            sx={{ mr: 2 }}
            onChange={(e) => onSearch(e?.target?.value ?? "", "name")}
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setIsEdit(false);
              setOpen(true);
            }}
          >
            Add User
          </Button>
          {/* <TextField
          label="PO Date"
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
          type="date"
          // onChange={(e) => handleChange(e, -1, "ordersNo")}
        /> */}
        </Box>
      )}
      <Tables
        keys={["name", "email", "outletName", "address", "roleName", "role"]}
        data={usersTemp}
        head={[
          "Name",
          "Username",
          "Outlet/Warehouse",
          "Address",
          "Role Name",
          "Role",
        ]}
        ExtraHead={ExtraHead}
        ExtraBody={ExtraBody}
        extra
      />
    </Loader>
  );
};
