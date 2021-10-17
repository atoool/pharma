import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useToken from "../hooks/useToken";

export const AppContext = React.createContext({
  userData: { token: { accessToken: null }, user: { role: null } },
  onSetUserData: () => {},
  productData: [],
  setProductData: () => {},
});

export const AppContextProvider = ({ children }) => {
  const { token, setToken } = useToken();
  const [userData, setUserData] = useState(token);
  const [productData, setProductData] = useState([]);
  const history = useHistory();

  const onSetUserData = (data) => {
    setToken(data);
  };

  useEffect(() => {
    setUserData(token);
    if (!token?.token?.accessToken) {
      history.push("/auth");
    } else {
      history.push("/pharma");
    }
  }, [token, history]);

  const values = {
    userData,
    onSetUserData,
    setProductData,
    productData,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
