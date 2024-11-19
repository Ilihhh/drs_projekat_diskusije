import React, { useState, useEffect } from "react";
import axios from "axios";
import Discussion from "../discussion/Discussion"; // Putanja do Discussion komponente

export default function HomePage() {
  const [discussions, setDiscussions] = useState([]); // Inicijalizacija discussions stanja

  useEffect(() => {
    // Poziv za preuzimanje diskusija sa servera
    axios
      .get("/api/discussions") // Putanja za API poziv
      .then((response) => {
        setDiscussions(response.data); // Postavljanje podataka u stanje
      })
      .catch((error) => {
        console.error("Error fetching discussions:", error);
      });
  }, []); // useEffect se pokreće samo jednom prilikom učitavanja komponente

  return (
    <div className="row">
      {discussions.map((discussion) => (
        <div key={discussion.id} className="col-md-4">
          <Discussion
            title={discussion.title}
            author={discussion.author}
            date={discussion.date}
            content={discussion.content}
            description={discussion.description} // Prosleđujemo description
            comments={discussion.comments}
          />
        </div>
      ))}
    </div>
  );
}
