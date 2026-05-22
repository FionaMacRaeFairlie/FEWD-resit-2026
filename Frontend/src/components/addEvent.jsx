import { useState } from "react";

export default function AddEventModal({ show, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  const [requiredItems, setItems] = useState([]);
  const [itemInput, setItemInput] = useState("");

  function getUserFromToken() {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.username;
    } catch {
      return null;
    }
  }

  function getUserFamilyFromToken() {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.familyId;
    } catch {
      return null;
    }
  }

  if (!show) return null;

  const addItem = () => {
    if (itemInput.trim() === "") return;
    setItems([...requiredItems, itemInput]);
    setItemInput("");
  };

  const removeItem = (index) => {
    setItems(requiredItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      title,
      date,
      startTime,
      endTime,
      location,
      requiredItems,
      username: getUserFromToken(),
      userfamily: getUserFamilyFromToken(),
    };

    onSave(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      {/* Modal card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">New Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <div className="flex gap-2">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* Required items */}
          <div>
            <label className="text-sm text-gray-700">Required Items</label>

            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Add item"
                value={itemInput}
                onChange={(e) => setItemInput(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={addItem}
                className="px-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </div>

            <div className="mt-2 space-y-1">
              {requiredItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between border rounded-lg px-3 py-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
