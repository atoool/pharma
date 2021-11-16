import { Chart } from "component/chart/Chart";
import { Loader } from "component/loader/Loader";

export function Reports() {
  return (
    <Loader>
      <Chart />
    </Loader>
  );
}
