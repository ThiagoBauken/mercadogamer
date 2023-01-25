type CatalogFilterType = {
  price: {
    max: number;
    min: number;
  };
  platform: string[];
  category: string[];
  types: string[];
  order: string;
  delivery: string[];
  game: string;
  search?: string;
};

type CatalogCountsType = {
  platform: { [key: string]: number };
  category: { [key: string]: number };
  type: { [key: string]: number };
};
