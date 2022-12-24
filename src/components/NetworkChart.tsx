import ReactEcharts from "echarts-for-react";

import { GetAssociationRes } from "src/types/api/association.dto";

type NetworkChartProps = {
  association: GetAssociationRes | undefined;
};

export const NetworkChart = ({ association }: NetworkChartProps) => {
  return (
    <ReactEcharts
      option={{
        tooltip: {},
        // legend: [
        //   {
        //     data: data.categories.map(function (a) {
        //       return a.name;
        //     })
        //   }
        // ],
        animationDuration: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            type: "graph",
            zoom: 3,
            layout: "force",
            draggable: true,
            force: {
              repulsion: [100, 100],
              friction: 0.3,
              gravity: 0.03,
            },
            data: association && association.nodes,
            links: association && association.links,
            categories: association && association.categories,
            roam: true,
            edgeSymbol: ["none", "arrow"],
            itemStyle: {
              opacity: 0.8,
            },
            label: {
              position: "inside",
              formatter: "{b}",
              show: true,
              fontFamily: "Segoe UI",
              fontSize: 15,
              color: "#000",
            },
            lineStyle: {
              color: "source",
              curveness: 0,
              width: 1.5,
            },
            emphasis: {
              focus: "adjacency", // Known bug - Causes buggy legend hovering. https://github.com/apache/echarts/issues/13869 Will resolve buggy hovering using CSS disable hovering
              lineStyle: {
                width: 4,
              },
            },
          },
        ],
      }}
      style={{ height: "700px" }}
    />
  );
};
