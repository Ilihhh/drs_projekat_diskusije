import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { urlCreateDiscussion, urlTopics } from "../utils/endpoints";

function DiscussionForm() {
  const [topics, setTopics] = useState([]); // Držimo listu tema
  const [selectedTopic, setSelectedTopic] = useState(""); // Za čuvanje odabrane teme
  const [selectedTopicDescription, setSelectedTopicDescription] = useState(""); // Opis odabrane teme
  const [discussionText, setDiscussionText] = useState(""); // Tekst diskusije
  const [discussionTitle, setDiscussionTitle] = useState(""); // Držimo naslov diskusije
  const navigate = useNavigate(); // Initialize useNavigate for redirection

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

  const handleDiscussionTitleChange = (event) => {
    setDiscussionTitle(event.target.value);
  };

  const handleSubmit = () => {
    if (!selectedTopic || !discussionText || !discussionTitle) {
      alert(
        "Please select a topic, enter a discussion title, and provide some discussion text."
      );
      return;
    }

    // Poziv na backend za kreiranje diskusije
    axios
      .post(urlCreateDiscussion, {
        title: discussionTitle, // Dinamički naslov diskusije
        text: discussionText,
        topic_id: selectedTopic,
      })
      .then((response) => {
        console.log("Discussion created:", response.data);
        alert("Discussion successfully created!");

        // Preusmeravamo korisnika na početnu stranicu
        navigate("/"); // Replace "/" with the path you want the user to be redirected to
      })
      .catch((error) => {
        console.error("Error creating discussion:", error);
        alert("There was an error creating the discussion.");
      });
  };

  return (
    <div>
      <h2>Create a Discussion</h2>

      {/* Input for Discussion Title */}
      <div className="mt-3">
        <label htmlFor="discussionTitle">Discussion Title:</label>
        <input
          id="discussionTitle"
          className="form-control"
          type="text"
          value={discussionTitle}
          onChange={handleDiscussionTitleChange}
          placeholder="Enter discussion title"
        />
      </div>

      {/* Label for the Topic Selection */}
      <div className="mt-3">
        <label htmlFor="topicSelect">Select a Topic:</label>
        <select
          id="topicSelect"
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
      </div>

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
