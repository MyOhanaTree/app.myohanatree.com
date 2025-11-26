import { api } from "./axiosClient";
import type { FamilyPerson } from "../types/family";

export async function fetchFamilyPerson(id?: string): Promise<FamilyPerson> {
  const params = id ? { id } : undefined;
  const res = await api.get<FamilyPerson>("/family", { params });
  return res.data;
}

export async function updateFamilyPerson(
  id: string,
  data: Partial<FamilyPerson>
) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/family/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update person");
  }

  return res.json();
}
