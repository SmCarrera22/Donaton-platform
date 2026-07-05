import { getToken } from "@/lib/session";

type JsonRecord = Record<string, unknown>;

async function readResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text.length > 0 ? text : null;
}

async function request<TResponse>(
    path: string,
    options: RequestInit = {}
): Promise<{ ok: boolean; status: number; body: TResponse | string | null }> {
  const token = getToken();

  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const body = (await readResponseBody(response)) as TResponse | string | null;

  return {
    ok: response.ok,
    status: response.status,
    body,
  };
}

export function getFromBff<TResponse>(path: string) {
  return request<TResponse>(path, {
    method: "GET",
  });
}

export function postToBff<TResponse>(
    path: string,
    payload: JsonRecord
) {
  return request<TResponse>(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function putToBff<TResponse>(
    path: string,
    payload: JsonRecord
) {
  return request<TResponse>(path, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteFromBff<TResponse>(path: string) {
  return request<TResponse>(path, {
    method: "DELETE",
  });
}

export function extractErrorMessage(body: unknown, fallbackMessage: string) {
  if (typeof body === "string" && body.trim().length > 0) {
    return body;
  }

  if (body && typeof body === "object") {
    const maybeMessage =
        (body as JsonRecord).message ??
        (body as JsonRecord).mensaje ??
        (body as JsonRecord).error;

    if (typeof maybeMessage === "string" && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }
  }

  return fallbackMessage;
}