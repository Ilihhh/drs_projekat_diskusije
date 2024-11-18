import React, { useState } from "react";
import TopicCard from "./TopicCard";
import "../styles/TopicStyle.css";

const TopicList = () => {
  const [topics, setTopics] = useState([
    {
      id: 1,
      name: "Novi Sad",
      description: "Novi Sad drugi najveci grad u Republici Srbiji",
    },
    { id: 2, name: "Beograd", description: "Beograd je glavni grad Srbije" },
    { id: 3, name: "Niš", description: "Niš je treći najveći grad u Srbiji" },
    {
      id: 4,
      name: "Novi Sad",
      description: "Novi Sad drugi najveci grad u Republici Srbiji",
    },
    { id: 5, name: "Beograd", description: "Beograd je glavni grad Srbije" },
    { id: 6, name: "Niš", description: "Niš je treći najveći grad u Srbiji" },
  ]);

  const [selectedTopics, setSelectedTopics] = useState([]);

  const handleEdit = (id) => {
    alert(`Edit topic with ID: ${id}`);
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

  return (
    <div>
      <div
        style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}
      >
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
