import * as React from "react";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import logo from "../../assets/images/logo.png";
import { LoadingButton } from "@mui/lab";
import { AppContext } from "context/AppContext";
import { loginUser } from "api/api";

export default function Login() {
  let [creds, setCreds] = React.useState({ email: "", password: "" });
  const [loading, setLoading] = React.useState(false);
  const { onSetUserData } = React.useContext(AppContext);

  const handleSubmit = async (event) => {
    setLoading(true);
    try {
      const data = await loginUser(creds);
      data && onSetUserData(data.data);
      setLoading(false);
    } catch (e) {
      console.warn("s");
      setLoading(false);
    }
  };

  const handleChange = (e = "", itm = "") => {
    try {
      creds[itm] = e.target.value;
      setCreds(...creds);
    } catch {}
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src={logo}
        alt=""
        style={{ width: 250, height: 120, marginBottom: 20 }}
      />
      <Typography
        component="h1"
        variant="h5"
        color="primary"
        sx={{ alignSelf: "flex-Start" }}
      >
        Login
      </Typography>
      <Box component="form" noValidate={false} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          type="email"
          autoFocus
          onChange={(txt) => handleChange(txt, "email")}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          onChange={(txt) => handleChange(txt, "password")}
          autoComplete="current-password"
        />
        {/* <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
      /> */}
        <LoadingButton
          type="submit"
          loading={loading}
          variant="outlined"
          fullWidth
          sx={{ mt: 2, mb: 2, height: 50 }}
          onClick={handleSubmit}
        >
          Sign In
        </LoadingButton>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          {/* <Grid item>
          <Link href="#" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid> */}
        </Grid>
      </Box>
    </Box>
  );
}
