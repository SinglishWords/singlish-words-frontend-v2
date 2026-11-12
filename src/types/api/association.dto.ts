export type GetAssociationRes = {
  nodes: {
    id: number;
    name: string;
    symbolSize: number;
    value: number;
    category: number;
  }[];
  links: { source: number; target: number }[];
  categories: { name: string }[];
};

export type GetRandomAssociationRes = {
  word: string;
  forward: GetAssociationRes;
  backward: GetAssociationRes;
};

export type DirectAssociation = {
  word: string;
  count: number;
};

export type GetDirectAssociationsRes = DirectAssociation[];
