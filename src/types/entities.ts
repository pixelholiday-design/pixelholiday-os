// Entity types
export type Order = {
  id: string;
  userId: string;
  total: number;
  status: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
};
