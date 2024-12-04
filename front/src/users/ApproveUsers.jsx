import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Loading from "../utils/Loading";
import Swal from "sweetalert2"; // Import SweetAlert2
import { urlRegistrationRequests, urlUpdateRegistration } from "../utils/endpoints";

export default function ApproveUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingUserId, setLoadingUserId] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(urlRegistrationRequests);
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();

    const socket = io("https://drs-projekat-diskusije.onrender.com");

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
    setLoadingUserId(userId);
    try {
      await axios.put(`${urlUpdateRegistration}/${userId}`, {
        status: "approved",
      });
      setUsers(users.filter((user) => user.id !== userId));
      Swal.fire({
        icon: "success",
        title: "User Accepted",
        text: `The user has been successfully accepted.`,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to accept user.",
      });
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleReject = async (userId) => {
    setLoadingUserId(userId);
    try {
      await axios.put(`${urlUpdateRegistration}/${userId}`, {
        status: "rejected",
      });
      setUsers(users.filter((user) => user.id !== userId));
      Swal.fire({
        icon: "success",
        title: "User Rejected",
        text: `The user has been successfully rejected.`,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reject user.",
      });
    } finally {
      setLoadingUserId(null);
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
                    disabled={loadingUserId === user.id}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(user.id)}
                    disabled={loadingUserId === user.id}
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
