type JsonRecord = Record<string, unknown>;

async function readResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text.length > 0 ? text : null;
}

export async function postToBff<TResponse>(
  path: string,
  payload: JsonRecord,
): Promise<{ ok: boolean; status: number; body: TResponse | string | null }> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = (await readResponseBody(response)) as TResponse | string | null;

  return {
    ok: response.ok,
    status: response.status,
    body,
  };
}

export function extractErrorMessage(body: unknown, fallbackMessage: string) {
  if (typeof body === "string" && body.trim().length > 0) {
    return body;
  }

  if (body && typeof body === "object") {
    const maybeMessage = (body as JsonRecord).message ?? (body as JsonRecord).mensaje;

    if (typeof maybeMessage === "string" && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }
  }

  return fallbackMessage;
}