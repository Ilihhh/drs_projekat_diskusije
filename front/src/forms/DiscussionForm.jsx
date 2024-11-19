import { useState, useEffect } from "react";
import axios from "axios";
import { urlTopics, urlDiscussions } from "../utils/endpoints";
import Discussion from "../discussion/Discussion"; // Importuj komponentu za prikaz diskusije

function DiscussionForm() {
  const [topics, setTopics] = useState([]); // Držimo listu tema
  const [discussions, setDiscussions] = useState([]); // Držimo listu diskusija
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

  useEffect(() => {
    // Poziv za preuzimanje diskusija sa servera
    axios
      .get(urlDiscussions) // Pretpostavljamo da je ovo endpoint za diskusije
      .then((response) => {
        setDiscussions(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching discussions!", error);
      });
  }, []);

  const handleTopicChange = (event) => {
    const selectedId = event.target.value;
    console.log("Selected ID:", selectedId);
    setSelectedTopic(selectedId);

    // Provera da li postoji tema u listi pre nego što pokušamo da je pronađemo
    if (topics.length > 0) {
      const selectedTopic = topics.find(
        (topic) => String(topic.id) === String(selectedId)
      );
      if (selectedTopic) {
        setSelectedTopicDescription(selectedTopic.description); // Setuj opis teme
        console.log("Selected Topic Description:", selectedTopic.description);
      }
    } else {
      console.log("Topics data is not loaded yet");
    }
  };

  const handleDiscussionTextChange = (event) => {
    setDiscussionText(event.target.value); // Ažuriramo tekst diskusije
  };

  const handleSubmit = () => {
    // Na kraju šaljemo podatke diskusije zajedno sa izabranom temom
    axios
      .post("/api/discussions", {
        title: "Discussion Title",
        text: discussionText,
        topic_id: selectedTopic, // ID odabrane teme
      })
      .then((response) => {
        console.log("Discussion created:", response.data);
        setDiscussions([...discussions, response.data]); // Dodaj novu diskusiju u stanje
      })
      .catch((error) => {
        console.error("Error creating discussion:", error);
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

      {/* Prikazivanje svih diskusija kao kartice */}
      <div className="mt-5">
        <h3>All Discussions</h3>
        <div className="row">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="col-md-4">
              <Discussion
                title={discussion.title}
                author={discussion.author}
                date={discussion.date}
                content={discussion.content}
                comments={discussion.comments}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiscussionForm;
