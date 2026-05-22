import Layout from "./Layout";
import Login from "./login";
import useToken from "./useToken";
import UseFetchData from "./FetchEvents";
import { nanoid } from "nanoid";
import AddEventModal from "./addEvent";
import { useState, useEffect } from "react";
import EditEventModal from "./editevent";

function getUserFromToken(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username;
  } catch {
    return null;
  }
}

function getRoleFromToken(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function Home() {
  const { token, setToken } = useToken();
  const { events } = UseFetchData(token);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser = getUserFromToken(token);
  const currentRole = getRoleFromToken(token);

  const [eventPositions, setEventPositions] = useState({});

  useEffect(() => {
    const stored = sessionStorage.getItem("eventPositions");
    if (stored) {
      setEventPositions(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("eventPositions", JSON.stringify(eventPositions));
  }, [eventPositions]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter((event) => {
      const text = (
        (event.event || "") +
        " " +
        (event.location || "") +
        " " +
        (new Date(event.date).toLocaleDateString("de-DE") || "") +
        " " +
        (event.requiredItems || "")
      ).toLowerCase();

      const matchesSearch =
        searchTerm.trim() === "" || text.includes(searchTerm.toLowerCase());
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today && matchesSearch;
    })
    .sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

  const handleSaveEvent = (eventData) => {
    return fetch("http://localhost:3002/new-event-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((data) => data.json())
      .then(window.location.reload());
  };

  const handleDeleteEvent = (_id) => {
    return fetch("http://localhost:3002/delete-event/${_id}", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id }),
    })
      .then((data) => data.json())
      .then(window.location.reload());
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEditModal(true);
  };
  const handleUpdateEvent = (event) => {
    return fetch("http://localhost:3002/update-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }).then((data) => data.json());
    // .then(window.location.reload());
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }
  return (
    <div>
      <Layout />

      <div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-900 transition"
        >
          + Add Event
        </button>
        <AddEventModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveEvent}
        />
        <EditEventModal
          isOpen={editModal}
          onClose={() => setEditModal(false)}
          event={selectedEvent}
          onSave={(updatedEvent) => {
            handleUpdateEvent(updatedEvent);

            setShowEditModal(false);
          }}
        />

        {upcomingEvents.length === 0 && (
          <p className="text-gray-500 text-center">No upcoming Events</p>
        )}

        <ul className="space-y-4">
          {upcomingEvents.map((event) => (
            <li
              key={nanoid()}
              className="flex justify-between items-start rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col gap-1 ">
                <span className="text-lg font-semibold text-gray-800">
                  {event.event}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString("de-DE")}:{" "}
                  {event.startTime} – {event.endTime}
                </span>
                <span className="text-sm text-gray-600">
                  Requirements: {event.requiredItems + ""}
                </span>
                <span className="text-sm text-gray-600">
                  Added by: {event.organiser}
                </span>
              </div>
              {(currentRole === "admin" || currentUser === event.organiser) && (
                <div className="justify-items-end">
                  {/* <div className="mt-1">
                    <button onClick={() => handleDeleteEvent(event._id)}>
                      X
                    </button>
                  </div>
                  <div className="mt-3">
                    <button onClick={() => handleEditEvent(event)}>
                      edit Event
                    </button>
                  </div> */}
                  <div className="flex gap-2">
                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
