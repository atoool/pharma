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
  BadgeOutlined,
  Apartment,
  History,
  PersonAdd,
  ChatBubble,
} from "@mui/icons-material";
import {
  IntentIssue,
  IntentStatus,
  IntentEntry,
  ItemMaster,
  PendingPurchase,
  Chat,
  PurchaseEntry,
  PurchaseReturn,
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
  Departments,
  Vendors,
  SalesHistory,
  WarehouseStock,
  Register,
} from "./views";

var dashRoutes = [
  {
    name: "Dashboard",
    state: "pageCollapse",
    views: [
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
        path: "/WarehouseStock",
        name: "Stocks",
        secondaryNavbar: true,
        component: WarehouseStock,
        layout: "/Pharma",
        icon: () => <List />,
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
        path: "/PurchaseReturn",
        name: "Purchase Return",
        secondaryNavbar: true,
        component: PurchaseReturn,
        layout: "/Pharma",
        icon: () => <Receipt />,
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
      // {
      //   path: "/PendingPurchase",
      //   name: "Pending Purchase",
      //   secondaryNavbar: true,
      //   component: PendingPurchase,
      //   layout: "/Pharma",
      //   icon: () => <PendingActions />,
      // },
      {
        path: "/Vendors",
        name: "Vendors List",
        secondaryNavbar: true,
        component: Vendors,
        layout: "/Pharma",
        icon: () => <BadgeOutlined />,
      },
      {
        path: "/Departments",
        name: "Departments List",
        secondaryNavbar: true,
        component: Departments,
        layout: "/Pharma",
        icon: () => <Apartment />,
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
        path: "/SalesHistory",
        name: "Sales History",
        secondaryNavbar: true,
        component: SalesHistory,
        layout: "/Pharma",
        icon: () => <History />,
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
    ],
  },
  {
    name: "Admin",
    state: "pageCollapse",
    views: [
      {
        path: "/CreateUser",
        name: "Create User",
        secondaryNavbar: true,
        component: Register,
        layout: "/Pharma",
        icon: () => <PersonAdd />,
      },
    ],
  },
  {
    path: "/signin",
    name: "Sign In",
    component: Login,
    layout: "/auth",
  },
  {
    name: "Communications",
    state: "pageCollapse",
    views: [
      {
        path: "/Communications",
        name: "Messages",
        secondaryNavbar: true,
        component: Chat,
        layout: "/Pharma",
        icon: () => <ChatBubble />,
      },
    ],
  },
];
export default dashRoutes;
