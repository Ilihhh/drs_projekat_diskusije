import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../utils/Loading";
import "../styles/ApproveUsersStyle.css";
import { urlUsers } from "../utils/endpoints";

export default function ApprovedUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(urlUsers); // API URL za dobavljanje korisnika
        const approvedUsers = response.data.filter(user => user.status === 'approved'); // Filtriramo samo korisnike sa statusom 'approved'
        setUsers(approvedUsers);
      } catch (err) {
        setError("Greška prilikom dobavljanja korisnika.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="approve-users-container">
      <h3>Approved Users</h3>
      {users.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>City</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.phone_number}</td>
                <td>{user.address}</td>
                <td>{user.city}</td>
                <td>{user.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nema odobrenih korisnika za prikaz</p>
      )}
    </div>
  );
}
