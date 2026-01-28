import { Event } from "@/types/event";

const BASE_URL = "http://localhost:8080/api";

export async function getEvents(): Promise<Event[]> {
  const res = await fetch(`${BASE_URL}/events`);
  if (!res.ok) {
    throw new Error("Failed to load events");
  }
  return res.json();
}

export async function getEventById(id: string): Promise<Event> {
  const res = await fetch(`${BASE_URL}/events/${id}`);
  if (!res.ok) {
    throw new Error("Failed to load event");
  }
  return res.json();
}