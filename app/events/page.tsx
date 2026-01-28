"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import EventCard from "@/components/eventCard";
import { getEvents } from "@/lib/api";
import { Event } from "@/types/event";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [hideCancelled, setHideCancelled] = useState(false);

  useEffect(() => {
    getEvents().then(setEvents).catch(console.error);
  }, []);

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.name.toLowerCase().includes(search.toLowerCase()) ||
      ev.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !hideCancelled || ev.status !== "CANCELLED";

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Navbar search={search} onSearchChange={setSearch} />

      <div style={{ padding: "1rem" }}>
        <div className="d-flex justify-content-center mt-3 mb-4">
          <label className="form-check d-flex align-items-center gap-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={hideCancelled}
              onChange={(e) => setHideCancelled(e.target.checked)}
            />
            <span>Hide cancelled events</span>
          </label>
        </div>

        <div style={{ marginTop: "1rem" }}>
          {filteredEvents.length === 0 && <p>No events found</p>}

          {filteredEvents.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      </div>
    </>
  );
}