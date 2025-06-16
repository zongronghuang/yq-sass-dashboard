type Request = {
  url: string;
  method?: "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
  options?: {
    headers?: { [key: string]: string };
    body?: { [key: string]: any };
    signal?: AbortSignal;
  };
};

export default function request({
  url = "",
  method = "GET",
  options = { headers: {}, body: {}, signal: undefined },
}: Request) {
  return fetch(new URL(url).href, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: method === "GET" ? null : JSON.stringify(options.body),
    signal: options.signal,
  }).catch((error) => {
    console.error(`[Request: ${error.name}] \n ${error.message}`);
  });
}
