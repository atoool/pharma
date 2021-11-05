import { get } from "api/api";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useToken from "../hooks/useToken";

export const AppContext = React.createContext({
  userData: { token: { accessToken: null }, user: { role: null } },
  userList: [],
  onSetUserData: () => {},
  productData: [],
  setProductData: () => {},
  onUserFetch: () => {},
});

export const AppContextProvider = ({ children }) => {
  const { token, setToken } = useToken();
  const [userData, setUserData] = useState(token);
  const [productData, setProductData] = useState([]);
  const [userList, setUserList] = useState([]);

  const history = useHistory();

  const onSetUserData = (data) => {
    setToken(data);
  };

  useEffect(() => {
    setUserData(token);
    onUserFetch(token);
    if (!token?.token?.accessToken) {
      history.push("/auth");
    } else {
      history.push("/pharma");
    }
  }, [token, history]);

  const onUserFetch = async (tok) => {
    try {
      const datas = await get("outlet-users", tok?.token?.accessToken ?? "");
      datas?.data && setUserList(datas?.data);
    } catch {}
  };

  const values = {
    userData,
    userList,
    onSetUserData,
    setProductData,
    productData,
    onUserFetch,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
