import api from "./api";

export async function getUsers(): Promise<User[]> {
  const response = await api.get("/users");

  return response.data;
}
