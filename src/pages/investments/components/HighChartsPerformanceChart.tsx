import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { PerformancePointDto } from "../../../models/performance";

type Props = {
    data: PerformancePointDto[];
    isLoading: boolean;
};

export default function HighChartsPerformanceChart({ data, isLoading }: Props) {
    const options: Highcharts.Options = {
    chart: {
      type: "line",
      height: 320
    },

    title: {
      text: "Investment Performance"
    },

    xAxis: {
      type: "datetime",
      title: { text: "Date" }
    },

    yAxis: {
      title: { text: "Market Value" },
      labels: {
        formatter() {
          return `$${this.value.toLocaleString()}`;
        }
      }
    },

    tooltip: {
      xDateFormat: "%b %Y",
      pointFormat: "<b>${point.y:,.2f}</b>"
    },

    series: [
      {
        name: "Market Value",
        type: "line",
        data: data.map(p => [
          Date.parse(p.date), // convert date → timestamp
          p.marketValue
        ]),
        marker: {
          enabled: false
        }
      }
    ],

    credits: {
      enabled: false
    }
  };

    return <>
        {isLoading ? (
            <div>Loading performance...</div>
        ) : (
            <HighchartsReact highcharts={Highcharts} options={options} />
        )
        }
    </>
}
