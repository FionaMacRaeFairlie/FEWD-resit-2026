import { useEffect, useState, useCallback } from "react";

const UseFetchUsers = (token) => {
  const [status, setStatus] = useState("idle");
  const [users, setUser] = useState([
    {
      user: "",
      role: "",
      familyId: "",
      id: "",
    },
  ]);

  const fetchUser = useCallback(() => {
    if (!token) {
      return;
    }

    const url = "http://localhost:3002/all-users";
    const settings = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(url, settings)
      .then((response) => response.json())
      .then((incomingData) => {
        setUser(incomingData);
        setStatus("fetched");
      })
      .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { users, status, refetch: fetchUser };
};

export default UseFetchUsers;
