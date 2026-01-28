"use client";

import { useRouter } from "next/navigation";
import { Event } from "@/types/event";

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  const router = useRouter();

  const imageUrl =
    event.imageIds && event.imageIds.length > 0
      ? `http://localhost:8080/api/events/image/${event.imageIds[0]}`
      : "/images/default-event.jpg";

  return (
    <div
      className="card mb-4 shadow-sm event-card"
      onClick={() => router.push(`/events/${event.id}`)}
      style={{
        cursor: "pointer",
        maxWidth: "1100px",
        margin: "0 auto",
        overflow: "hidden",
        height: "300px"
      }}
    >
      <div className="row g-0 event-card-row">
        
        {/* IMAGE */}
        <div className="col-md-4 event-card-image-wrapper">
          <img
            src={imageUrl}
            alt={event.name}
            className="event-card-image"
          />
        </div>

        {/* CONTENT */}
        <div className="col-md-8 d-flex align-items-center">
          <div className="card-body px-4 py-4">
            <h5 className="mb-2">{event.name}</h5>

            <p className="mb-1">
              <strong>Location:</strong> {event.category}
            </p>

            <p className="mb-3">
              <strong>Price:</strong>{" "}
              {event.minPrice != null
                ? `Starts from €${event.minPrice.toFixed(2)}`
                : "No appointments available"}
            </p>

            <span className="badge bg-success px-3 py-2">
              {event.status}
            </span>
          </div>
        </div>
      </div>
    </div>

  );
}