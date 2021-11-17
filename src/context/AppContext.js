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
  drawer: true,
  onSetDrawer: () => {},
  vendors: [],
  onGetVendor: async () => {},
});

export const AppContextProvider = ({ children }) => {
  const { token, setToken } = useToken();
  const [userData, setUserData] = useState(token);
  const [productData, setProductData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [drawer, setDrawer] = useState(true);
  const [vendors, setVendors] = useState([]);

  const history = useHistory();

  const onSetUserData = (data) => {
    setToken(data);
  };

  const onSetDrawer = () => setDrawer(!drawer);

  const onGetVendors = async (tok) => {
    try {
      const data1 = (await get("list-vendors", tok)) ?? [];
      setVendors(data1?.data?.response ?? []);
      return data1?.data?.response ?? [];
    } catch {}
  };

  useEffect(() => {
    setUserData(token);
    onUserFetch(token);
    onGetVendors(token);
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
    drawer,
    onSetDrawer,
    onGetVendors,
    vendors,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
