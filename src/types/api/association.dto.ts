export type GetAssociationRes = {
  nodes: {
    id: number;
    name: string;
    symbolSize: number;
    value: number;
    category: number;
  }[];
  Links: { source: number; target: number }[];
  Categories: string[];
};
