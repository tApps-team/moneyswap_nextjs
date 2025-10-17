type GetProps = {};
export class ApiClient {
  private baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }

  async handleResponse<TResult>(response: Response): Promise<TResult> {
    const data = await response.json();
    
    if (!response.ok) {
      return {
        status: response.status.toString(),
        details: data.message || "Error occurred"
      } as TResult;
    }

    return data;
  }

  public async get<TResult = unknown>(
    endpoint: string,
    queryParams?: Record<string, string | number>,
    requestCache?: RequestCache,
  ): Promise<TResult> {
    const url = new URL(endpoint, this.baseUrl);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        typeof value !== "undefined" && url.searchParams.append(key, value.toString());
      });
    }

    // Добавляем хедер Moneyswap для v2 эндпоинтов
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (endpoint.includes("/api/v2/")) {
      headers["Moneyswap"] = "true";
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
      cache: requestCache || "no-store",
    });

    return this.handleResponse<TResult>(response);
  }

  public async post<TResult = unknown, TData = Record<string, unknown>>(
    endpoint: string,
    body: TData,
  ): Promise<TResult> {
    // Добавляем хедер Moneyswap для v2 эндпоинтов
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (endpoint.includes("/api/v2/")) {
      headers["Moneyswap"] = "true";
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    return this.handleResponse<TResult>(response);
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL!);
