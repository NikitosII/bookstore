const API_BASE_URL = "http://localhost:5004";

export interface BookRequest {
  title: string;
  author: string;
  description: string;
  datetime: string;
}

export interface FilterParams {
  search?: string;
  sortitem?: string;
  sortBy?: 'asc' | 'desc';
}

const fetchWithCors = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response;
};

export const GetAll = async (): Promise<Book[]> => {
  const response = await fetchWithCors(`${API_BASE_URL}/Book`);
  return response.json();
};

export const GetWithFilter = async (params: FilterParams): Promise<Book[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.sortitem) queryParams.append('sortitem', params.sortitem);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);

  const url = `${API_BASE_URL}/Book/filter?${queryParams.toString()}`;
  const response = await fetchWithCors(url);
  return response.json();
};

export const Create = async (bookRequest: BookRequest): Promise<void> => {
  await fetchWithCors(`${API_BASE_URL}/Book`, {
    method: "POST",
    body: JSON.stringify(bookRequest),
  });
};

export const Update = async (id: string, bookRequest: BookRequest): Promise<void> => {
  await fetchWithCors(`${API_BASE_URL}/Book/${id}`, {
    method: "PUT",
    body: JSON.stringify(bookRequest),
  });
};

export const Delete = async (id: string): Promise<void> => {
  await fetchWithCors(`${API_BASE_URL}/Book/${id}`, {
    method: "DELETE",
  });
};