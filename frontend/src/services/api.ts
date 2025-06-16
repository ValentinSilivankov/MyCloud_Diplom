const API_URL = '/api';

export async function getCSRFToken(): Promise<string> {
  const response = await fetch(`${API_URL}/csrf/`, {
    credentials: 'include',
  });
  const { csrfToken } = await response.json();
  return csrfToken;
}

export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const csrfToken = await getCSRFToken();
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
  };

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });
}