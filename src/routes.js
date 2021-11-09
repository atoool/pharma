import {
  Inventory2,
  FormatListNumbered,
  CompareArrows,
  RequestPage,
  ShoppingBag,
  Input,
  Done,
  PowerInput,
  Task,
  List,
  PointOfSale,
  Receipt,
  PostAdd,
  Flag,
  PendingActions,
} from "@mui/icons-material";
import {
  IntentIssue,
  IntentStatus,
  IntentEntry,
  ItemMaster,
  PendingPurchase,
  PurchaseEntry,
  PurchaseOrder,
  PurchaseRequisition,
  Quotation,
  RateComparator,
  Stocks,
  Login,
  IntentEntries,
  Sales,
  SalesReturn,
  Reports,
} from "./views";

var dashRoutes = [
  {
    name: "Warehouse",
    state: "pageCollapse",
    views: [
      {
        path: "/Items",
        name: "Item Master",
        secondaryNavbar: true,
        component: ItemMaster,
        layout: "/Pharma",
        icon: () => <Inventory2 />,
      },
      {
        path: "/Quotation",
        name: "Quotation",
        secondaryNavbar: true,
        component: Quotation,
        layout: "/Pharma",
        icon: () => <FormatListNumbered />,
      },
      {
        path: "/RateComparator",
        name: "Rate Comparator",
        secondaryNavbar: true,
        component: RateComparator,
        layout: "/Pharma",
        icon: () => <CompareArrows />,
      },
      {
        path: "/PurchaseRequisition",
        name: "Purchase Requisition",
        secondaryNavbar: true,
        component: PurchaseRequisition,
        layout: "/Pharma",
        icon: () => <RequestPage />,
      },
      {
        path: "/PurchaseOrder",
        name: "Purchase Order",
        secondaryNavbar: true,
        component: PurchaseOrder,
        layout: "/Pharma",
        icon: () => <ShoppingBag />,
      },
      {
        path: "/PurchaseEntry",
        name: "Purchase Entry",
        secondaryNavbar: true,
        component: PurchaseEntry,
        layout: "/Pharma",
        icon: () => <Input />,
      },
      {
        path: "/IndentIssue",
        name: "Indent Issue",
        secondaryNavbar: true,
        component: IntentIssue,
        layout: "/Pharma",
        icon: () => <Done />,
      },
      {
        path: "/IndentEntry",
        name: "Indent Entry",
        secondaryNavbar: true,
        component: IntentEntry,
        layout: "/Pharma",
        icon: () => <PowerInput />,
      },
      {
        path: "/PendingPurchase",
        name: "Pending Purchase",
        secondaryNavbar: true,
        component: PendingPurchase,
        layout: "/Pharma",
        icon: () => <PendingActions />,
      },
    ],
  },
  {
    name: "Outlet",
    state: "pageCollapse",
    views: [
      {
        path: "/Stocks",
        name: "Stocks",
        secondaryNavbar: true,
        component: Stocks,
        layout: "/Pharma",
        icon: () => <List />,
      },
      {
        path: "/Sales",
        name: "Sales",
        secondaryNavbar: true,
        component: Sales,
        layout: "/Pharma",
        icon: () => <PointOfSale />,
      },
      {
        path: "/SalesReturn",
        name: "Sales Return",
        secondaryNavbar: true,
        component: SalesReturn,
        layout: "/Pharma",
        icon: () => <Receipt />,
      },
      {
        path: "/IndentEntries",
        name: "Indent Entries",
        secondaryNavbar: true,
        component: IntentEntries,
        layout: "/Pharma",
        icon: () => <PostAdd />,
      },
      {
        path: "/IndentStatus",
        name: "Indent Status",
        secondaryNavbar: true,
        component: IntentStatus,
        layout: "/Pharma",
        icon: () => <Task />,
      },
      {
        path: "/Reports",
        name: "Reports",
        secondaryNavbar: true,
        component: Reports,
        layout: "/Pharma",
        icon: () => <Flag />,
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
