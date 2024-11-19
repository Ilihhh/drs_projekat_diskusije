import React from "react";
import { useNavigate } from "react-router-dom"; // Importuj useNavigate
import "../styles/TopicStyle.css";

const TopicCard = ({ topic, onDelete, onSelect, selected }) => {
  const navigate = useNavigate(); // Koristi useNavigate za navigaciju

  const handleEdit = (id) => {
    navigate(`/edit-topic/${id}`); // Navigiraj na stranicu za editovanje teme sa ID-jem
  };

  return (
    <div
      className={`topic-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(topic.id)} // Dodajemo onClick za selektovanje kartice
    >
      <h3>{topic.name}</h3>
      <p>{topic.description}</p>
      <div className="topic-card-actions">
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation(); // Sprečavamo da klik na edit dugme selektuje karticu
            handleEdit(topic.id); // Pozivamo handleEdit sa ID-jem teme
          }}
        >
          Edit
        </button>
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(topic.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TopicCard;
