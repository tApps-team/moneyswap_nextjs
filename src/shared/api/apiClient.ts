type GetProps = {};
export class ApiClient {
  private baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }

  async handleResponse<TResult>(response: Response): Promise<TResult> {
    if (!response.ok) {
      // throw new Error(`HTTP error! Status: ${response.status} ${response.url}`);
      console.log("error");
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error("Error parsing JSON response");
      console.log("error");
    }
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

    const response = await fetch(url.toString(), {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
      },
      // cache: requestCache || "no-store",
    });

    return this.handleResponse<TResult>(response);
  }

  public async post<TResult = unknown, TData = Record<string, unknown>>(
    endpoint: string,
    body: TData,
  ): Promise<TResult> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return this.handleResponse<TResult>(response);
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL!);
