import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TopicStyle.css";
import Swal from "sweetalert2";

const TopicCard = ({ topic, onDelete, onSelect, selected }) => {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit-topic/${id}`);
  };



const handleDelete = (e) => {
  e.stopPropagation();
  Swal.fire({
    title: `Are you sure you want to delete "${topic.name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      onDelete(topic.id);
      Swal.fire("Deleted!", "The topic has been deleted.", "success");
    }
  });
};


  return (
    <div
      className={`topic-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(topic.id)}
    >
      <h3>{topic.name}</h3>
      <p>{topic.description}</p>
      <div className="topic-card-actions">
        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(topic.id);
          }}
        >
          Edit
        </button>
        <button
          className="delete-btn"
          onClick={handleDelete}  // Koristi novu funkciju za brisanje
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TopicCard;
