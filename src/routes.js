import Login from "views/Auth/Login";
import { Departments } from "./views/Departments";
import { StoreIndent, Products, IssueGoods } from "./views/Store";

var dashRoutes = [
  {
    name: "Store",
    state: "pageCollapse",
    views: [
      {
        path: "/Products",
        name: "Items",
        secondaryNavbar: true,
        component: Products,
        layout: "/Pharma",
      },
      {
        path: "/IssueGoods",
        name: "Issue Goods",
        secondaryNavbar: true,
        component: IssueGoods,
        layout: "/Pharma",
      },
      {
        path: "/StoreIndent",
        name: "Store Indent",
        secondaryNavbar: true,
        component: StoreIndent,
        layout: "/Pharma",
      },
    ],
  },
  {
    name: "Departments",
    state: "pageCollapse",
    views: [
      {
        path: "/Departments",
        name: "Departments",
        secondaryNavbar: true,
        component: Departments,
        layout: "/Pharma",
      },
    ],
  },
  {
    path: "/signin",
    name: "Sign In",
    component: Login,
    layout: "/auth",
  },
];
export default dashRoutes;
