import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../utils/Loading";
import {
  urlRegistrationRequests,
  urlUpdateRegistration,
} from "../utils/endpoints";
import "../styles/ApproveUsersStyle.css";
import socket from "../utils/websocket";
import BlackSwal from "../utils/BlackSwal";

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

    socket.on("new-user-registered", (data) => {
      console.log("New user registered:", data);
      setUsers((prevUsers) => [...prevUsers, data]);
    });

    // return () => {
    //   socket.off("new-user-registered");
    // };
  }, []);
  

  const handleAccept = async (userId) => {
    setLoadingUserId(userId);
    try {
      await axios.put(`${urlUpdateRegistration}/${userId}`, {
        status: "approved",
      });
      setUsers(users.filter((user) => user.id !== userId));
      BlackSwal.fire({
        icon: "success",
        title: "User Accepted",
        text: `The user has been successfully accepted.`,
      });
    } catch (err) {
      BlackSwal.fire({
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
      BlackSwal.fire({
        icon: "success",
        title: "User Rejected",
        text: `The user has been successfully rejected.`,
      });
    } catch (err) {
      BlackSwal.fire({
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
    <div className="approve-users-container">
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
                    className="btn btn-danger-vote"
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
