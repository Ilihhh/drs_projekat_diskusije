import { useState, useEffect } from "react";
import axios from "axios";
import { urlTopics } from "../utils/endpoints";

function DiscussionForm() {
  const [topics, setTopics] = useState([]); // Držimo listu tema
  const [selectedTopic, setSelectedTopic] = useState(""); // Za čuvanje odabrane teme
  const [selectedTopicDescription, setSelectedTopicDescription] = useState(""); // Opis odabrane teme
  const [discussionText, setDiscussionText] = useState(""); // Tekst diskusije

  useEffect(() => {
    // Poziv za preuzimanje tema sa servera
    axios
      .get(urlTopics)
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching topics!", error);
      });
  }, []);

  const handleTopicChange = (event) => {
    const selectedId = event.target.value;
    setSelectedTopic(selectedId);

    if (topics.length > 0) {
      const selectedTopic = topics.find(
        (topic) => String(topic.id) === String(selectedId)
      );
      if (selectedTopic) {
        setSelectedTopicDescription(selectedTopic.description);
      }
    }
  };

  const handleDiscussionTextChange = (event) => {
    setDiscussionText(event.target.value);
  };

  const handleSubmit = () => {
    if (!selectedTopic || !discussionText) {
      alert("Please select a topic and enter some discussion text.");
      return;
    }

    // Poziv na backend za kreiranje diskusije
    axios
      .post("/api/discussions", {
        title: "Discussion Title", // Možeš postaviti dinamički naslov
        text: discussionText,
        topic_id: selectedTopic,
      })
      .then((response) => {
        console.log("Discussion created:", response.data);
        alert("Discussion successfully created!");
        // Dodaj logiku za preusmeravanje ili ažuriranje stanja, ako je potrebno
      })
      .catch((error) => {
        console.error("Error creating discussion:", error);
        alert("There was an error creating the discussion.");
      });
  };

  return (
    <div>
      <h2>Create a Discussion</h2>

      <select
        value={selectedTopic}
        onChange={handleTopicChange}
        className="form-control"
      >
        <option value="">Select a topic</option>
        {topics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name}
          </option>
        ))}
      </select>

      {/* Prikazujemo opis teme kada je odabrana */}
      {selectedTopicDescription && (
        <div className="mt-3">
          <h5>Topic Description:</h5>
          <p>{selectedTopicDescription}</p>
        </div>
      )}

      {/* Polje za unos teksta diskusije */}
      <div className="mt-3">
        <label htmlFor="discussionText">Discussion Text:</label>
        <textarea
          id="discussionText"
          className="form-control"
          value={discussionText}
          onChange={handleDiscussionTextChange}
          rows="5"
        />
      </div>

      {/* Dugme za kreiranje diskusije */}
      <button className="btn btn-primary mt-3" onClick={handleSubmit}>
        Create Discussion
      </button>
    </div>
  );
}

export default DiscussionForm;
