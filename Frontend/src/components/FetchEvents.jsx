import { useEffect, useState, useCallback } from "react";

const UseFetchData = (token) => {
  const [status, setStatus] = useState("idle");
  const [events, setEvent] = useState([
    {
      event: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      requiredItems: "",
      organiser: "",
      familyId: "",
      id: "",
    },
  ]);

  const fetchData = useCallback(() => {
    if (!token) {
      return;
    }

    const url = "http://localhost:3002/all-events";
    const settings = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(url, settings)
      .then((response) => response.json())
      .then((incomingData) => {
        setEvent(incomingData);
        setStatus("fetched");
      })
      .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { events, status, refetch: fetchData };
};

export default UseFetchData;
