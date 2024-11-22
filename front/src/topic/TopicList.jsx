import React, { useState, useEffect } from "react";
import TopicCard from "./TopicCard";
import "../styles/TopicStyle.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  //urlTopicDelete,
  //urlTopicDeleteSelected,
  urlTopics,
} from "../utils/endpoints";

const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(urlTopics)
      .then((response) => {
        setTopics(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load topics");
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-topic/${id}`);
  };

  const handleDelete = (id) => {
    setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== id));
    setSelectedTopics((prevSelected) =>
      prevSelected.filter((selectedId) => selectedId !== id)
    );
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
    if (selectedTopics.length === 0) return;
  
    Swal.fire({
      title: `Are you sure you want to delete ${selectedTopics.length} topic(s)?`,
      text: "This will also delete all discussions associated with the selected topics.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("/topic/delete-selected-with-discussions", {
            headers: { "Content-Type": "application/json" },
            data: { ids: selectedTopics },
          })
          .then((response) => {
            Swal.fire("Deleted!", response.data.message, "success");
            // Ažuriraj lokalno stanje nakon brisanja
            setTopics((prevTopics) =>
              prevTopics.filter((topic) => !selectedTopics.includes(topic.id))
            );
            setSelectedTopics([]); // Resetuj selekciju
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              error.response?.data?.error || "Failed to delete the selected topics.",
              "error"
            );
          });
      }
    });
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="button-group">
        <button onClick={handleSelectAll} className="select-all-btn">
          {selectedTopics.length === topics.length
            ? "Deselect All"
            : "Select All"}
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedTopics.length === 0}
          className="delete-selected-btn"
        >
          Delete Selected
        </button>
        <Link to="/create-topic">
          <button className="btn-create-topic">Create Topic</button>
        </Link>
      </div>

      <div className="topic-list">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onEdit={handleEdit}
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
