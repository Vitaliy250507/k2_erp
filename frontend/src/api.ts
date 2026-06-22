import {
  Client, ClientCreateInput,
  Item, ItemCreateInput,
  Order, OrderCreateInput
} from './types';

class ErpApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        ...errorData
      };
    }
    return response.json() as Promise<T>;
  }

  async createClient(clientData: ClientCreateInput): Promise<Client> {
    const res = await fetch(`${this.baseUrl}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
    });
    return this.handleResponse<Client>(res);
  }


  async createItem(itemData: ItemCreateInput): Promise<Item> {
    const res = await fetch(`${this.baseUrl}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    return this.handleResponse<Item>(res);
  }

  async createOrder(orderData: OrderCreateInput): Promise<Order> {
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return this.handleResponse<Order>(res);
  }

  async getClientOrders(clientId: number): Promise<Order[]> {
    const res = await fetch(`${this.baseUrl}/clients/${clientId}/orders`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return this.handleResponse<Order[]>(res);
  }
}

export const api = new ErpApiClient();