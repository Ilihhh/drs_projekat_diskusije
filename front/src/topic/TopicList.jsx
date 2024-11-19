import React, { useState, useEffect } from "react";
import TopicCard from "./TopicCard";
import "../styles/TopicStyle.css"; // Osiguravamo da importujemo CSS
import { Link, useNavigate } from "react-router-dom"; // Importujemo Link i useNavigate
import axios from "axios"; // Importujemo axios za slanje HTTP zahteva
import { urlTopics } from "../utils/endpoints";

const TopicList = () => {
  const [topics, setTopics] = useState([]); // Početno stanje sa praznom listom
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(true); // Za praćenje statusa učitavanja
  const [error, setError] = useState(null); // Za praćenje grešaka
  const navigate = useNavigate(); // Hook za navigaciju

  // Učitaj podatke sa backend-a
  useEffect(() => {
    axios
      .get(urlTopics) // Poziv na backend za dobijanje svih topika
      .then((response) => {
        setTopics(response.data); // Postavljamo podatke u stanje
        setLoading(false); // Učitavanje je završeno
      })
      .catch((err) => {
        setError("Failed to load topics"); // Postavljamo grešku u slučaju neuspeha
        setLoading(false); // Učitavanje je završeno
      });
  }, []); // Empty dependency array znači da se efekat poziva samo jednom prilikom mount-a komponente

  // Funkcija koja će se pozvati prilikom klika na "Edit"
  const handleEdit = (id) => {
    // Preusmeravanje korisnika na stranicu za editovanje teme sa ID-em teme
    navigate(`/edit-topic/${id}`);
  };

  const handleDelete = (id) => {
    setTopics(topics.filter((topic) => topic.id !== id));
    setSelectedTopics(selectedTopics.filter((selectedId) => selectedId !== id));
  };

  const handleSelect = (id) => {
    setSelectedTopics((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTopics.length === topics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(topics.map((topic) => topic.id));
    }
  };

  const handleDeleteSelected = () => {
    setTopics(topics.filter((topic) => !selectedTopics.includes(topic.id)));
    setSelectedTopics([]);
  };

  if (loading) {
    return <div>Loading...</div>; // Prikazivanje poruke dok se podaci učitavaju
  }

  if (error) {
    return <div>{error}</div>; // Prikazivanje greške u slučaju neuspešnog učitavanja
  }

  return (
    <div>
      <div className="button-group">
        <button
          onClick={handleSelectAll}
          className="select-all-btn" // Dodali smo klasu za Select All dugme
        >
          {selectedTopics.length === topics.length
            ? "Deselect All"
            : "Select All"}
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedTopics.length === 0}
          className="delete-selected-btn" // Dodali smo klasu za Delete Selected dugme
        >
          Delete Selected
        </button>

        {/* Dugme za kreiranje nove teme */}
        <Link to="/create-topic">
          <button className="btn-create-topic">Create Topic</button>{" "}
          {/* Koristimo novu klasu */}
        </Link>
      </div>

      <div className="topic-list">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onEdit={handleEdit} // Prosljeđujemo handleEdit funkciju
            onDelete={handleDelete}
            onSelect={handleSelect}
            selected={selectedTopics.includes(topic.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TopicList;
