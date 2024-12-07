import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { urlTopicCreate, urlTopicEdit, urlTopics } from "../utils/endpoints";

function TopicForm() {
  const [title, setTitle] = useState(""); // Polje za unos naziva teme
  const [description, setDescription] = useState(""); // Polje za unos opisa
  const [error, setError] = useState(""); // Polje za prikazivanje grešaka
  const [isEditing, setIsEditing] = useState(false); // Da li uređujemo postojeću temu

  const { id } = useParams(); // Preuzimanje ID-ja teme iz URL-a
  const navigate = useNavigate(); // Za navigaciju na početnu stranicu nakon uspešnog editovanja

  // Učitaj podatke teme sa servera ako postoji ID
  useEffect(() => {
    if (id) {
      console.log("Fetching data for topic with ID:", id); // Proveri ID
      setIsEditing(true); // Ako postoji ID, uređujemo postojeću temu
      axios
        .get(`${urlTopics}/${id}`) // Poziv na backend da bi učitali podatke teme
        .then((response) => {
          const { name, description } = response.data; // Primaš 'name' umesto 'title'
          console.log("Topic data loaded:", response.data); // Proveri podatke
          setTitle(name); // Postavljamo 'name' iz odgovora u 'title' state
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

    // Pretpostavljamo da je ID korisnika dostupan, npr. sa autentifikacije
    const authorId = 1; // Zameni sa stvarnim ID-om korisnika
    const creationDate = new Date().toISOString(); // Automatski dodeljujemo trenutni datum

    const topicData = {
      id: id,
      name: title, // Šaljemo 'name' na back-end, jer server očekuje 'name', a ne 'title'
      description,
      creation_date: creationDate,
      author_id: authorId,
    };

    // Ako uređujemo postojeću temu, šaljemo PUT zahtev
    const apiCall = isEditing
      ? axios.put(urlTopicEdit, topicData) // PUT zahtev za update
      : axios.post(urlTopicCreate, topicData); // POST zahtev za kreiranje nove teme

    apiCall
      .then((response) => {
        console.log(
          isEditing ? "Topic updated:" : "Topic created:",
          response.data
        );
        navigate("/topicmanagement"); // Preusmeravamo na početnu stranicu nakon uspešnog unosa
      })
      .catch((error) => {
        console.error(
          isEditing ? "Error updating topic:" : "Error creating topic:",
          error
        );
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
            id="title" // Ovo je ID polja koje se koristi za unos naziva
            value={title} // Ovdje se koristi title stanje
            onChange={(e) => setTitle(e.target.value)} // Update stanje pri unosu
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
