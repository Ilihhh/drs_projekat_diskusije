import React from "react";
import "../styles/TopicStyle.css";

const TopicCard = ({ topic, onEdit, onDelete, onSelect, selected }) => {
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
            e.stopPropagation();
            onEdit(topic.id);
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
