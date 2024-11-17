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

    if (loading) return <Loading/>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3>Users to Approve</h3>
            {users.length > 0 ? (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.first_name} {user.last_name} - {user.email}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users to display</p>
            )}
        </div>
    );
}
