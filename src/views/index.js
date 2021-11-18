import { Sales } from "./outlet/Sales";
import { IntentEntries } from "./outlet/IntentEntries";
import { SalesReturn } from "./outlet/SalesReturn";
import { Reports } from "./outlet/Reports";
import { Vendors } from "./warehouse/Vendors";
import { Departments } from "./warehouse/Departments";
import { SalesHistory } from "./outlet/SalesHistory";
const { Stocks } = require("./outlet/Stocks");
const { IntentIssue } = require("./warehouse/IndentIssue");
const { IntentEntry } = require("./warehouse/IntentEntry");
const { IntentStatus } = require("./outlet/IntentStatus");
const { ItemMaster } = require("./warehouse/ItemMaster");
const { PendingPurchase } = require("./warehouse/PendingPurchase");
const { PurchaseEntry } = require("./warehouse/PurchaseEntry");
const { PurchaseOrder } = require("./warehouse/PurchaseOrder");
const { PurchaseRequisition } = require("./warehouse/PurchaseRequisition");
const { Quotation } = require("./warehouse/Quotation");
const { RateComparator } = require("./warehouse/RateComparator");
const { Login } = require("./Auth/Login");

export {
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
  Sales,
  IntentEntries,
  SalesReturn,
  Reports,
  Vendors,
  Departments,
  SalesHistory,
};
