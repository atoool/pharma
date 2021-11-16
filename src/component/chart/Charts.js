import { Box } from "@mui/system";
import React from "react";
import CanvasJSReact from "./canva/canvasjs.react";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export const Charts = ({ yTitle = "", xTitle = "", data = [] }) => {
  const options = {
    animationEnabled: true,
    title: {
      text: "",
    },
    axisY: {
      title: yTitle,
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: "spline",
        name: xTitle,
        showInLegend: true,
        dataPoints: data,
      },
    ],
  };

  return (
    <Box sx={{ p: 5 }}>
      <CanvasJSChart
        options={options}
        /* onRef={ref => this.chart = ref} */
      />
    </Box>
  );
};
