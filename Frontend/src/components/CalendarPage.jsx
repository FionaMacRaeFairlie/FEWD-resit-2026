import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../styles/styling.css";
import useToken from "./useToken";
import UseFetchData from "./FetchEvents";
import Login from "./login";
import { nanoid } from "nanoid";
import Layout from "./Layout";

function CalendarPage() {
  const { token, setToken } = useToken();
  const { events } = UseFetchData(token);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventPositions, setEventPositions] = useState({});

  useEffect(() => {
    const stored = sessionStorage.getItem("eventPositions");
    if (stored) {
      setEventPositions(JSON.parse(stored));
    }
  }, []);

  const eventsForSelectedDay = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate()
    );
  });

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Layout />
      <div className="flex flex-1 items-center justify-center mt-6 px-4">
        <div className="flex gap-8 w-full max-w-5xl">
          {/* Calendar Card */}
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
            <Calendar
              onChange={(date) => setSelectedDate(date)}
              value={selectedDate}
              tileClassName={({ date }) => {
                const isSelected =
                  date.toDateString() === selectedDate.toDateString();

                const isToday =
                  date.toDateString() === new Date().toDateString();

                if (isSelected) {
                  return "border border-indigo-500 rounded-lg";
                }

                if (isToday) {
                  return "border border-indigo-800 rounded-lg";
                }

                return "hover:bg-gray-100 rounded-lg";
              }}
              /* Event dot indicator */
              tileContent={({ date, view }) => {
                if (view !== "month") return null;

                const hasEvent = events.some((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    eventDate.getFullYear() === date.getFullYear() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getDate() === date.getDate()
                  );
                });

                return hasEvent ? (
                  <div className="flex justify-center mt-1">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  </div>
                ) : null;
              }}
            />
          </div>

          {/* Events List Card */}
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Events on {selectedDate.toDateString()}
            </h2>

            <ul className="space-y-3">
              {[...eventsForSelectedDay]
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((event) => (
                  <div>
                    <div className="flex flex-col gap-1 border rounded-lg p-3">
                      <span className="text-lg font-semibold text-gray-800">
                        {event.event}
                      </span>

                      <span className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString("de-DE")}:
                        {event.startTime} – {event.endTime}
                      </span>

                      <span className="text-sm text-gray-500">
                        Location: {event.location}
                      </span>

                      <span className="text-sm text-gray-500">
                        Added by: {event.organiser || "Unknown"}
                      </span>
                    </div>
                  </div>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
