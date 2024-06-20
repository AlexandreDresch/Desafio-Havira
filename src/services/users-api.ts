import api from "./api";

export async function getUsers(): Promise<User[]> {
  try {
    const response = await api.usersInstance.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}
