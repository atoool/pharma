import { Loader } from "component/loader/Loader";
import Tables from "component/table/Tables";

const head = [
  "Code",
  "Name",
  "Batch",
  "Exp Date",
  "Sale Price",
  "Qty",
  "Amount",
  "Tax",
];
const keys = [
  "code",
  "name",
  "batch",
  "expDate",
  "salePrice",
  "qty",
  "amount",
  "tax",
];
const data = [
  {
    code: "",
    name: "",
    batch: "",
    expData: "",
    salePrice: "",
    qty: "",
    tax: "",
  },
];

export function Sales() {
  const isLoad = false;
  return (
    <Loader load={isLoad}>
      <Tables head={head} keys={keys} data={data} />
    </Loader>
  );
}
