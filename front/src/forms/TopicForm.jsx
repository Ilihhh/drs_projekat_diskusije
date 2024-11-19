import React, { useState } from "react";
import axios from "axios";

function CreateTopicForm() {
  const [title, setTitle] = useState(""); // Polje za unos naziva teme
  const [description, setDescription] = useState(""); // Polje za unos opisa
  const [error, setError] = useState(""); // Polje za prikazivanje grešaka

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !description) {
      setError("All fields are required");
      return;
    }

    // Pretpostavljamo da je ID korisnika dostupan, npr. sa autentifikacije
    const authorId = 1; // Zameni sa stvarnim ID-om korisnika
    const creationDate = new Date().toISOString(); // Automatski dodeljujemo trenutni datum

    // Pravimo objekat sa podacima koje šaljemo serveru
    const newTopic = {
      title,
      description,
      creation_date: creationDate,
      author_id: authorId,
    };

    // Poziv API-a za kreiranje nove teme
    axios
      .post("/api/topics", newTopic)
      .then((response) => {
        console.log("Topic created:", response.data);
        // Ovdje možete resetovati formu ili preusmeriti korisnika
      })
      .catch((error) => {
        console.error("Error creating topic:", error);
        setError("There was an error creating the topic");
      });
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Topic</h2>
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
          Create Topic
        </button>
      </form>
    </div>
  );
}

export default CreateTopicForm;
