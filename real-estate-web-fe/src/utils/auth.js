export function getUser() {
  try {
    const user = localStorage.getItem("user");
    if (!user || user === "undefined") return null;
    return JSON.parse(user);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
}

export function getToken() {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined") return null;
  return token;
}
