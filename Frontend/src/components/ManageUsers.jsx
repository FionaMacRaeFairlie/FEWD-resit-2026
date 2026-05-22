import Layout from "./Layout";
import UseFetchUsers from "./FetchUsers";
import useToken from "./useToken";
import { nanoid } from "nanoid";
import EditUserModal from "./editUser";
import { useState } from "react";

function getRoleFromToken(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function getFamilyFromToken(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.familyId;
  } catch {
    return null;
  }
}

function ManageUser() {
  const { token } = useToken();
  const { users } = UseFetchUsers(token);
  const userRole = getRoleFromToken(token);
  const mainFamily = getFamilyFromToken(token);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const openEditUser = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleUserUpdated = (updatedUser) => {
    // NOTE: assumes you later manage state properly
    console.log("Updated user:", updatedUser);
  };

  const filteredUsers = users.filter((user) => {
    return user.familyId == mainFamily;
  });

  const handleDeleteUser = (_id) => {
    return fetch(`http://localhost:3002/delete-user/${_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id }),
    })
      .then((data) => data.json())
      .then(() => window.location.reload());
  };

  // Admin view
  if (userRole === "admin") {
    return (
      <div className="min-h-screen flex flex-col">
        <Layout />

        <div className="flex flex-1 justify-center px-4 mt-6">
          <div className="w-full max-w-3xl space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={nanoid()}
                className="bg-white shadow-xl rounded-2xl p-4 flex justify-between items-center"
              >
                {/* User info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user.user}
                  </h3>
                  <p className="text-sm text-gray-500">Role: {user.role}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditUser(user)}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <EditUserModal
          isOpen={isEditOpen}
          user={selectedUser}
          onClose={() => setIsEditOpen(false)}
          onUserUpdated={handleUserUpdated}
        />
      </div>
    );
  }

  //  Non-admin view
  return (
    <div className="min-h-screen flex flex-col">
      <Layout />

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <p className="text-gray-700 font-medium">No Access</p>
        </div>
      </div>
    </div>
  );
}

export default ManageUser;
