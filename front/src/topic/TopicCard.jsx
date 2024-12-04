import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TopicStyle.css";
import Swal from "sweetalert2";
import axios from "axios";
import {urlTopicDeleteWithDiscussions} from "../utils/endpoints";

const TopicCard = ({ topic, onDelete, onSelect, selected }) => {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit-topic/${id}`);
  };



  const handleDelete = (e) => {
    e.stopPropagation();
  
    Swal.fire({
      title: `Are you sure you want to delete "${topic.name}"?`,
      text: "This will also delete all discussions associated with this topic.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete everything!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(urlTopicDeleteWithDiscussions, {
            headers: { "Content-Type": "application/json" },
            data: { id: topic.id, delete_discussions: true },
          })
          .then((response) => {
            Swal.fire("Deleted!", response.data.message, "success");
            onDelete(topic.id); // Samo obaveštava `TopicList` o brisanju
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              error.response?.data?.error || "Failed to delete the topic and discussions.",
              "error"
            );
          });
      } else {
        Swal.fire("Cancelled", "The topic was not deleted.", "info");
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
