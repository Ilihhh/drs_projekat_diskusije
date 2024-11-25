import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  urlCreateDiscussion,
  urlEditDiscussion,
  urlTopics,
} from "../utils/endpoints";
import Swal from "sweetalert2";
import "../styles/DiscussionFormStyle.css";

function DiscussionForm() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedTopicDescription, setSelectedTopicDescription] = useState("");
  const [discussionText, setDiscussionText] = useState("");
  const [discussionTitle, setDiscussionTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [discussionId, setDiscussionId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch topics for the dropdown
    axios
      .get(urlTopics)
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching topics", error);
      });

    // Handle edit mode if existing data is passed
    if (location.state) {
      const { title, text, topic, discussionId } = location.state;
      setDiscussionTitle(title);
      setDiscussionText(text);
      setSelectedTopic(topic.id);
      setSelectedTopicDescription(topic.description);
      setDiscussionId(discussionId);
      setIsEditMode(true);
    }
  }, [location.state]);

  const handleTopicChange = (event) => {
    const selectedId = event.target.value;
    setSelectedTopic(selectedId);

    const selected = topics.find(
      (topic) => String(topic.id) === String(selectedId)
    );
    if (selected) {
      setSelectedTopicDescription(selected.description);
    }
  };

  const handleSubmit = () => {
    if (!selectedTopic || !discussionTitle || !discussionText) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all fields.",
      });
      return;
    }

    const discussionData = {
      id: discussionId,
      title: discussionTitle,
      text: discussionText,
      topic_id: selectedTopic,
    };

    const apiCall = isEditMode
      ? axios.put(`${urlEditDiscussion}`, discussionData)
      : axios.post(urlCreateDiscussion, discussionData);

    apiCall
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: isEditMode ? "Discussion Updated" : "Discussion Created",
          text: isEditMode
            ? "Discussion updated successfully."
            : "Discussion created successfully.",
          confirmButtonText: "Go to Home",
        }).then(() => {
          navigate("/");
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred. Please try again.",
        });
      });
  };

  return (
    <div className="discussion-form-container">
      <h2>{isEditMode ? "Edit Discussion" : "Create a Discussion"}</h2>

      <div className="mt-3">
        <label htmlFor="discussionTitle">Discussion Title:</label>
        <input
          id="discussionTitle"
          className="form-control"
          type="text"
          value={discussionTitle}
          onChange={(e) => setDiscussionTitle(e.target.value)}
          placeholder="Enter discussion title"
        />
      </div>

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

      {selectedTopicDescription && (
        <div className="topic-description">
          <h5>Topic Description:</h5>
          <p>{selectedTopicDescription}</p>
        </div>
      )}

      <div className="mt-3">
        <label htmlFor="discussionText">Discussion Text:</label>
        <textarea
          id="discussionText"
          className="form-control"
          value={discussionText}
          onChange={(e) => setDiscussionText(e.target.value)}
          rows="5"
        />
      </div>

      <button className="btn btn-primary mt-3" onClick={handleSubmit}>
        {isEditMode ? "Update Discussion" : "Create Discussion"}
      </button>
    </div>
  );
}

export default DiscussionForm;
