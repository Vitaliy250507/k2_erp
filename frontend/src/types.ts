
export interface Client {
  id: number;
  name: string;
  email: string;
}

export interface ClientCreateInput {
  name: string;
  email: string;
}

export interface Item {
  id: number;
  title: string;
  price: number;
}

export interface ItemCreateInput {
  title: string;
  price: number;
}

export interface Order {
  id: number;
  client_id: number;
  total_amount: number;
  created_at: string;
  items: Item[];
}

export interface OrderCreateInput {
  client_id: number;
  items: number[];
}

export interface ApiValidationError {
  errors?: {
    [key: string]: string[];
  };
  error?: string;
}