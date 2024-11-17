import React, { useState } from "react";

export default function SearchAndCreate() {
  const [searchTerm, setSearchTerm] = useState("");

  // Funkcija za promenu pretrage
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Funkcija za simulaciju pretrage
  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    // Ovdje možeš dodati logiku za pretragu diskusija
  };

  // Funkcija za kreiranje nove diskusije
  const handleCreateDiscussion = () => {
    console.log("Creating a new discussion...");
    // Ovdje možeš dodati logiku za kreiranje diskusije
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        {/* Search Bar */}
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Create Discussion Button */}
        <button className="btn btn-success" onClick={handleCreateDiscussion}>
          Create Discussion
        </button>
      </div>
    </div>
  );
}
