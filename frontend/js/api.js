const API_BASE = "/api";
async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  let payload;
  try { payload = await response.json(); }
  catch { throw new Error("The server returned an unreadable response."); }
  if (!response.ok || payload.status !== "success") {
    const error = new Error(payload.message || "Something went wrong.");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}
