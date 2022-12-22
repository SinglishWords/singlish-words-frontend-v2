import ReactEcharts from "echarts-for-react";

const visualisationState = {
  nodes: [
    {
      id: 0,
      name: "apple",
      symbolSize: 40,
      value: 40,
      category: 0,
    },
    {
      id: 1,
      name: "fruit",
      symbolSize: 36,
      value: 36,
      category: 0,
    },
    {
      id: 2,
      name: "red",
      symbolSize: 26,
      value: 26,
      category: 0,
    },
    {
      id: 3,
      name: "orange",
      symbolSize: 25,
      value: 25,
      category: 4,
    },
    {
      id: 4,
      name: "tree",
      symbolSize: 21,
      value: 21,
      category: 3,
    },
    {
      id: 5,
      name: "pear",
      symbolSize: 19,
      value: 19,
      category: 1,
    },
    {
      id: 6,
      name: "pie",
      symbolSize: 18,
      value: 18,
      category: 0,
    },
    {
      id: 7,
      name: "green",
      symbolSize: 16,
      value: 16,
      category: 1,
    },
    {
      id: 8,
      name: "core",
      symbolSize: 9,
      value: 9,
      category: 0,
    },
    {
      id: 9,
      name: "banana",
      symbolSize: 6,
      value: 6,
      category: 1,
    },
    {
      id: 10,
      name: "doctor",
      symbolSize: 5,
      value: 5,
      category: 0,
    },
    {
      id: 11,
      name: "computer",
      symbolSize: 5,
      value: 5,
      category: 0,
    },
    {
      id: 12,
      name: "seed",
      symbolSize: 5,
      value: 5,
      category: 3,
    },
    {
      id: 13,
      name: "sweet",
      symbolSize: 4,
      value: 4,
      category: 1,
    },
    {
      id: 14,
      name: "grape",
      symbolSize: 20,
      value: 20,
      category: 1,
    },
    {
      id: 15,
      name: "crunch",
      symbolSize: 20,
      value: 20,
      category: 2,
    },
    {
      id: 16,
      name: "juice",
      symbolSize: 4,
      value: 4,
      category: 4,
    },
    {
      id: 17,
      name: "round",
      symbolSize: 4,
      value: 4,
      category: 4,
    },
    {
      id: 18,
      name: "crisp",
      symbolSize: 3,
      value: 3,
      category: 2,
    },
    {
      id: 19,
      name: "crunchy",
      symbolSize: 3,
      value: 3,
      category: 2,
    },
  ],
  links: [
    {
      source: 0,
      target: 1,
    },
    {
      source: 1,
      target: 0,
    },
    {
      source: 0,
      target: 2,
    },
    {
      source: 0,
      target: 3,
    },
    {
      source: 0,
      target: 4,
    },
    {
      source: 0,
      target: 5,
    },
    {
      source: 0,
      target: 6,
    },
    {
      source: 0,
      target: 7,
    },
    {
      source: 0,
      target: 8,
    },
    {
      source: 0,
      target: 9,
    },
    {
      source: 0,
      target: 10,
    },
    {
      source: 0,
      target: 11,
    },
    {
      source: 0,
      target: 12,
    },
    {
      source: 0,
      target: 13,
    },
    {
      source: 0,
      target: 14,
    },
    {
      source: 0,
      target: 15,
    },
    {
      source: 0,
      target: 16,
    },
    {
      source: 0,
      target: 17,
    },
    {
      source: 0,
      target: 18,
    },
    {
      source: 0,
      target: 19,
    },
    {
      source: 18,
      target: 15,
    },
    {
      source: 18,
      target: 19,
    },
    {
      source: 18,
      target: 0,
    },
    {
      source: 12,
      target: 7,
    },
    {
      source: 12,
      target: 4,
    },
    {
      source: 11,
      target: 8,
    },
    {
      source: 9,
      target: 5,
    },
    {
      source: 9,
      target: 1,
    },
    {
      source: 9,
      target: 13,
    },
  ],
  categories: [
    {
      name: "A",
    },
    {
      name: "B",
    },
    {
      name: "C",
    },
    {
      name: "D",
    },
    {
      name: "E",
    },
  ],
};

export const NetworkChart = () => {
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
            data: visualisationState.nodes,
            links: visualisationState.links,
            categories: visualisationState.categories,
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
