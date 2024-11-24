import React, { useState } from "react";
import Button from "../utils/Button";
import "../App.css"

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [creatorFirstName, setCreatorFirstName] = useState("");
  const [creatorLastName, setCreatorLastName] = useState("");
  const [creatorAddress, setCreatorAddress] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [creatorUsername, setCreatorUsername] = useState("");
  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
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
      case "createUsername":
        setCreatorUsername(value);
        break;
      default:
        setSearchTerm(value);
    }
  };

  const handleSearch = () => {
    console.log("Searching with parameters:");
    console.log("Creator First Name:", creatorFirstName);
    console.log("Creator Last Name:", creatorLastName);
    console.log("Creator Address:", creatorAddress);
    console.log("Creator Email:", creatorEmail);
    console.log("Search Term:", searchTerm);
    // Logic to perform search based on these parameters
  };

  return (
    <div className="searchcontrainer">
      <div className="d-flex align-items-center gap-3">
        {/* Search Bar */}
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
