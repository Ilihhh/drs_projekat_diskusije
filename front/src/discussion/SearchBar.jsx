import React, { useState } from "react";
import Button from "../utils/Button";
import { urlSearchDiscussions } from "../utils/endpoints";
import "../App.css";

export default function SearchBar({ updateDiscussions }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [creatorFirstName, setCreatorFirstName] = useState("");
  const [creatorLastName, setCreatorLastName] = useState("");
  const [creatorAddress, setCreatorAddress] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [creatorUsername, setCreatorUsername] = useState("");

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "creatorUsername":
        setCreatorUsername(value);
        break;
      case "creatorFirstName":
        setCreatorFirstName(value);
        break;
      case "creatorLastName":
        setCreatorLastName(value);
        break;
      case "creatorAddress":
        setCreatorAddress(value);
        break;
      case "creatorEmail":
        setCreatorEmail(value);
        break;
      case "searchTerm":
        setSearchTerm(value);
        break;
      default:
        break;
    }
  };

  const handleSearch = async () => {
    const searchData = {
      username: creatorUsername,
      first_name: creatorFirstName,
      last_name: creatorLastName,
      address: creatorAddress,
      email: creatorEmail,
      name: searchTerm,
    };

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing");
      return;
    }

    try {
      const response = await fetch(urlSearchDiscussions, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(searchData),
      });
      const data = await response.json();
      // Prosleđivanje rezultata pretrage u HomePage
      
      // Otherwise, update discussions with search results
      if (data && Array.isArray(data)) {
        // Update the discussions in HomePage after the search
        updateDiscussions(data); // Pass the search results to updateDiscussions
      } else {
        updateDiscussions([]); // No discussions found, set an empty array
      }
    
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div className="searchcontrainer">
      <div className="d-flex align-items-center gap-3">
        <input
          type="text"
          name="creatorUsername"
          className="form-control"
          placeholder="Creator Username"
          value={creatorUsername}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="creatorFirstName"
          className="form-control"
          placeholder="Creator First Name"
          value={creatorFirstName}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="creatorLastName"
          className="form-control"
          placeholder="Creator Last Name"
          value={creatorLastName}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="creatorAddress"
          className="form-control"
          placeholder="Creator Address"
          value={creatorAddress}
          onChange={handleSearchChange}
        />
        <input
          type="email"
          name="creatorEmail"
          className="form-control"
          placeholder="Creator Email"
          value={creatorEmail}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="searchTerm"
          className="form-control"
          placeholder="Search Topic"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  );
}