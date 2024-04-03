import React, { useState } from "react";
import Chart from "react-apexcharts";

function ApexSparkTile(props) {
  const { data } = props;
  const [options] = useState(data.chartData ? data.chartData.options : "");
  const [series] = useState(data.chartData ? data.chartData.series : "");

  return (
    <div className="card mb-4">
      <div className="card-body">
        {options ? <Chart
          options={options}
          series={series}
          type={options ? options.chart.type : "bar"}
          height={options ? options.chart.height : 315}
        /> : null}
      </div>
    </div>
  );
}


export default ApexSparkTile;