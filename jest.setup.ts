import "@testing-library/jest-dom";
import "whatwg-fetch";

if (typeof Response !== "undefined" && !(Response as any).json) {
  (Response as any).json = function json(data: unknown, init: ResponseInit = {}) {
    const headers = new Headers(init.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return new Response(JSON.stringify(data), { ...init, headers });
  };
}
