import {
  Client, ClientCreateInput,
  Item, ItemCreateInput,
  Order, OrderCreateInput
} from './types.js';

class ErpApiClient {
  private baseUrl = 'http://localhost:5000/api';

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }
  async getClients(): Promise<Client[]> {
    const response = await fetch(`${this.baseUrl}/clients`);
    return this.handleResponse<Client[]>(response);
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
    const url = `${this.baseUrl}/clients`;

    // 📝 Логуємо перед відправкою
    console.log("=== [FRONTEND REQUEST] ===");
    console.log("Sending POST to:", url);
    console.log("Payload:", clientData);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });

      // 📝 Логуємо статус відповіді
      console.log("=== [FRONTEND RESPONSE STATUS] ===");
      console.log("Status:", res.status, res.statusText);

      return this.handleResponse<Client>(res);
    } catch (error) {
      console.error("=== [FRONTEND REQUEST FAILED] ===");
      console.error("Error details:", error);
      throw error;
    }
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