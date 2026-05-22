// import { useState, useEffect } from "react";

// // Component for editing an existing event
// // Props:
// // - isOpen: controls whether the modal is visible
// // - onClose: function to close the modal
// // - event: the event data to edit
// // - onSave: function to save the updated event
// export default function EditEventModal({ isOpen, onClose, event, onSave }) {
//   // State variables to store form input values
//   const [title, setTitle] = useState("");
//   const [date, setDate] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [location, setLocation] = useState("");

//   // State for required items list
//   const [requiredItems, setItems] = useState([]);
//   const [itemInput, setItemInput] = useState("");

//   // useEffect runs whenever 'event' changes
//   // It pre-fills the form with existing event data
//   useEffect(() => {
//     if (event) {
//       setTitle(event.event || "");
//       setDate(event.date || "");
//       setStartTime(event.startTime || "");
//       setEndTime(event.endTime || "");
//       setLocation(event.location || "");
//       setItems(event.requiredItems || []);
//     }
//   }, [event]);

//   // If modal is not open, render nothing
//   if (!isOpen) return null;

//   // Add an item to the required items list
//   const addItem = () => {
//     if (itemInput.trim() === "") return; // Prevent empty entries
//     setItems([...requiredItems, itemInput]);
//     setItemInput(""); // Clear input field
//   };

//   // Remove an item by index
//   const removeItem = (index) => {
//     setItems(requiredItems.filter((_, i) => i !== index));
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault(); // Prevent page refresh

//     // Create updated event object
//     const updatedEvent = {
//       ...event, // Keep existing properties
//       event: title, // Update title
//       date,
//       startTime,
//       endTime,
//       location,
//       requiredItems,
//     };

//     // Send updated event to parent component
//     onSave(updatedEvent);

//     // Close modal
//     onClose();
//   };

//   return (
//     <div>
//       {/* Modal title */}
//       <h2>Edit Event</h2>

//       {/* Edit form */}
//       <form onSubmit={handleSubmit}>
//         {/* Title input */}
//         <div>
//           <input
//             type="text"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>

//         {/* Date input */}
//         <div>
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             required
//           />
//         </div>

//         {/* Start and end time inputs */}
//         <div>
//           <input
//             type="time"
//             value={startTime}
//             onChange={(e) => setStartTime(e.target.value)}
//             required
//           />
//           <input
//             type="time"
//             value={endTime}
//             onChange={(e) => setEndTime(e.target.value)}
//             required
//           />
//         </div>

//         {/* Location input */}
//         <div>
//           <input
//             type="text"
//             placeholder="Location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//         </div>

//         {/* Required items section */}
//         <div>
//           <label>Required Items</label>

//           <div>
//             <input
//               type="text"
//               placeholder="Example: Wallet"
//               value={itemInput}
//               onChange={(e) => setItemInput(e.target.value)}
//             />
//             <button type="button" onClick={addItem}>
//               Add
//             </button>
//           </div>

//           {/* Display list of required items */}
//           <div>
//             {requiredItems.map((item, index) => (
//               <div key={index}>
//                 {item}
//                 <button type="button" onClick={() => removeItem(index)}>
//                   X
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Action buttons */}
//         <div>
//           <button type="button" onClick={onClose}>
//             Cancel
//           </button>

//           <button type="submit">Save</button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";

export default function EditEventModal({ isOpen, onClose, event, onSave }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  const [requiredItems, setItems] = useState([]);
  const [itemInput, setItemInput] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.event || "");
      setDate(event.date || "");
      setStartTime(event.startTime || "");
      setEndTime(event.endTime || "");
      setLocation(event.location || "");
      setItems(event.requiredItems || []);
    }
  }, [event]);

  if (!isOpen) return null;

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

    const updatedEvent = {
      ...event,
      event: title,
      date,
      startTime,
      endTime,
      location,
      requiredItems,
    };

    onSave(updatedEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      {/* Modal Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Edit Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />

          {/* Date */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />

          {/* Time */}
          <div className="flex gap-3">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          {/* Required Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Items
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add item"
                value={itemInput}
                onChange={(e) => setItemInput(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addItem}
                className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                Add
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {requiredItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border rounded-lg px-3 py-2"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
