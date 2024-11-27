import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Loading from "../utils/Loading";

export default function ApproveUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingUserId, setLoadingUserId] = useState(null); // Držanje ID-a korisnika za kojeg je akcija u toku

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("/registration-requests");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();

    // WebSocket konekcija
    const socket = io("http://localhost:5000");

    socket.on("user-status-changed", (updatedUser) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id
            ? { ...user, status: updatedUser.status }
            : user
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAccept = async (userId) => {
    setLoadingUserId(userId); // Postavi korisnika za kog je akcija u toku
    try {
      await axios.put(`/update-registration/${userId}`, {
        status: "approved",
      });
      setUsers(users.filter((user) => user.id !== userId));
      console.log(`User ${userId} accepted`);
    } catch (err) {
      setError("Failed to accept user");
    } finally {
      setLoadingUserId(null); // Resetuj loading stanje
    }
  };

  const handleReject = async (userId) => {
    setLoadingUserId(userId); // Postavi korisnika za kog je akcija u toku
    try {
      await axios.put(`/update-registration/${userId}`, {
        status: "rejected",
      });
      setUsers(users.filter((user) => user.id !== userId));
      console.log(`User ${userId} rejected`);
    } catch (err) {
      setError("Failed to reject user");
    } finally {
      setLoadingUserId(null); // Resetuj loading stanje
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Users to Approve</h3>
      {users.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleAccept(user.id)}
                    disabled={loadingUserId === user.id} // Onemogući dugme dok se akcija izvršava
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(user.id)}
                    disabled={loadingUserId === user.id} // Onemogući dugme dok se akcija izvršava
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users to display</p>
      )}
    </div>
  );
}
