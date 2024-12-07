import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { urlTopicCreate, urlTopicEdit, urlTopics } from "../utils/endpoints";
import BlackSwal from "../utils/BlackSwal"

function TopicForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      axios
        .get(`${urlTopics}/${id}`)
        .then((response) => {
          const { name, description } = response.data;
          setTitle(name);
          setDescription(description);
        })
        .catch((error) => {
          console.error("Error loading topic:", error);
          setError("There was an error loading the topic");
        });
    }
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !description) {
      setError("All fields are required");
      return;
    }

    const authorId = 1; // Zameni sa stvarnim ID-om korisnika
    const creationDate = new Date().toISOString();

    const topicData = {
      id: id,
      name: title,
      description,
      creation_date: creationDate,
      author_id: authorId,
    };

    const apiCall = isEditing
      ? axios.put(urlTopicEdit, topicData)
      : axios.post(urlTopicCreate, topicData);

    apiCall
      .then((response) => {
        console.log(
          isEditing ? "Topic updated:" : "Topic created:",
          response.data
        );
        
        // Dodato SweetAlert obaveštenje
        BlackSwal.fire({
          title: isEditing ? "Topic Updated!" : "Topic Created!",
          text: isEditing 
            ? "The topic has been successfully updated." 
            : "The topic has been successfully created.",
          icon: "success",
        }).then(() => {
          navigate("/topicmanagement"); // Preusmeravanje nakon zatvaranja modala
        });
      })
      .catch((error) => {
        console.error(
          isEditing ? "Error updating topic:" : "Error creating topic:",
          error
        );
        
        // Dodato SweetAlert obaveštenje o grešci
        BlackSwal.fire({
          title: "Error",
          text: "There was an error processing the topic.",
          icon: "error",
        });
        
        setError("There was an error processing the topic");
      });
  };

  return (
    <div className="container mt-5">
      <h2>{isEditing ? "Edit Topic" : "Create Topic"}</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Topic Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Topic Description
          </label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Topic" : "Create Topic"}
        </button>
      </form>
    </div>
  );
}

export default TopicForm;
