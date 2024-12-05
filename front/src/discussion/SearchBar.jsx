import React, { useState } from "react";
import Button from "../utils/Button";
import CreateLink from "../utils/CreateLink";
import "../styles/SearchBarStyle.css";

export default function SearchBar({ updateDiscussions }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [creatorFirstName, setCreatorFirstName] = useState("");
  const [creatorLastName, setCreatorLastName] = useState("");
  const [creatorAddress, setCreatorAddress] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [creatorUsername, setCreatorUsername] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => setShowSearch(!showSearch);

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
      creatorUsername,
      creatorFirstName,
      creatorLastName,
      creatorAddress,
      creatorEmail,
      searchTerm,
    };
    console.log("Pretraga sa podacima:", searchData);
  };

  const handleReset = async () => {
    setCreatorUsername("");
    setCreatorFirstName("");
    setCreatorLastName("");
    setCreatorAddress("");
    setCreatorEmail("");
    setSearchTerm("");
  };

  return (
    <div className="search-container">
      <div className="search-top">
        <CreateLink to="/create-discussion" className="create-discussion-link">
          + Create Discussion
        </CreateLink>
        <Button onClick={toggleSearch} className="search-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 50 50"
            fill="#fff"
          >
            <path d="M21,3C11.62,3,4,10.62,4,20c0,9.38,7.62,17,17,17c3.71,0,7.14-1.19,9.94-3.22l13.16,13.13l2.81-2.81l-13-13.03C36.46,28.09,38,24.22,38,20C38,10.62,30.38,3,21,3z M21,5c8.3,0,15,6.7,15,15c0,8.3-6.7,15-15,15c-8.3,0-15-6.7-15-15C6,11.7,12.7,5,21,5z" />
          </svg>
        </Button>
      </div>
      {showSearch && (
        <div className={`search-form ${showSearch ? "active" : ""}`}>
          <div className="row">
            <div className="col-12 col-md-2">
              <input
                type="text"
                name="creatorUsername"
                className="form-control"
                placeholder="Creator Username"
                value={creatorUsername}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-12 col-md-2">
              <input
                type="text"
                name="creatorFirstName"
                className="form-control"
                placeholder="Creator First Name"
                value={creatorFirstName}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-12 col-md-2">
              <input
                type="text"
                name="creatorLastName"
                className="form-control"
                placeholder="Creator Last Name"
                value={creatorLastName}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-12 col-md-2">
              <input
                type="text"
                name="creatorAddress"
                className="form-control"
                placeholder="Creator Address"
                value={creatorAddress}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-12 col-md-2">
              <input
                type="email"
                name="creatorEmail"
                className="form-control"
                placeholder="Creator Email"
                value={creatorEmail}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-12 col-md-2">
              <input
                type="text"
                name="searchTerm"
                className="form-control"
                placeholder="Search Topic"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="search-buttons">
            <Button onClick={handleSearch} className="btn-primary">
              Search
            </Button>
            <Button onClick={handleReset} className="btn-secondary">
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
