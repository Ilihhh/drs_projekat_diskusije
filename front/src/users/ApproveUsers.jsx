import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../utils/Loading";

export default function ApproveUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("/users"); // radi testa se dobavljaju svi korisnici
        setUsers(response.data); 
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false); // Isključujemo loading kada se završi
      }
    }

    fetchUsers();
  }, []);

  const handleAccept = (userId) => {
    // Funkcija za prihvatanje korisnika (za implementaciju)
    console.log(`User ${userId} accepted`);
  };

  const handleReject = (userId) => {
    // Funkcija za odbijanje korisnika (za implementaciju)
    console.log(`User ${userId} rejected`);
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
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(user.id)}
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
