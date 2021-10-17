// import
import Login from "views/Auth/Login";
import { Departments } from "./views/Departments";
import { StoreIndent, Products, IssueGoods } from "./views/Store";

// import {
//   HomeIcon,
//   StatsIcon,
//   CreditIcon,
//   PersonIcon,
//   DocumentIcon,
//   RocketIcon,
//   SupportIcon,
// } from "components/Icons/Icons";

var dashRoutes = [
  {
    name: "Store",
    state: "pageCollapse",
    views: [
      {
        path: "/Products",
        name: "Products",
        // icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: Products,
        layout: "/Pharma",
      },
      {
        path: "/IssueGoods",
        name: "Issue Goods",
        // icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: IssueGoods,
        layout: "/Pharma",
      },
      {
        path: "/StoreIndent",
        name: "Store Indent",
        // icon: <PersonIcon color="inherit" />,
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
        // icon: <PersonIcon color="inherit" />,
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
