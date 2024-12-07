import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import {
  urlCreateDiscussion,
  urlEditDiscussion,
  urlTopics,
} from "../utils/endpoints";
import BlackSwal from "../utils/BlackSwal";
import "../styles/DiscussionStyle.css";

function DiscussionForm() {
  const [topics, setTopics] = useState([]); // List of topics
  const [selectedTopic, setSelectedTopic] = useState(""); // Selected topic
  const [selectedTopicDescription, setSelectedTopicDescription] = useState(""); // Description of selected topic
  const [discussionText, setDiscussionText] = useState(""); // Text of the discussion
  const [discussionTitle, setDiscussionTitle] = useState(""); // Title of the discussion
  const [isEditMode, setIsEditMode] = useState(false); // Flag to determine if we are editing
  const [discussionId, setDiscussionId] = useState(null); // Store the discussion ID for editing
  const navigate = useNavigate(); // For redirection
  const location = useLocation(); // For accessing passed state in edit mode

  useEffect(() => {
    // Fetch topics for the dropdown
    axios
      .get(urlTopics)
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching topics!", error);
      });

    // If we are in edit mode, set the state with the existing discussion data
    if (location.state) {
      const { title, text, topic, discussionId } = location.state;
      setDiscussionTitle(title);
      setDiscussionText(text);
      setSelectedTopic(topic.id);
      setSelectedTopicDescription(topic.description);
      setDiscussionId(discussionId); // Store the discussion ID
      setIsEditMode(true); // Set to edit mode
    }
  }, [location.state]);

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
    if (!selectedTopic || !discussionTitle || !discussionText) {
      BlackSwal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select a topic, enter a discussion title, and provide some discussion text.",
      });
      return;
    }

    const discussionData = {
      id: discussionId, // Include the discussion ID when editing
      title: discussionTitle,
      text: discussionText,
      topic_id: selectedTopic,
    };

    // Make API call based on whether we're creating or editing
    const apiCall = isEditMode
      ? axios.put(`${urlEditDiscussion}`, discussionData) // Edit call
      : axios.post(urlCreateDiscussion, discussionData); // Create call

    apiCall
      .then((response) => {
        console.log(
          isEditMode ? "Discussion updated" : "Discussion created",
          response.data
        );

        BlackSwal.fire({
          icon: "success",
          title: isEditMode ? "Discussion Updated!" : "Discussion Created!",
          text: isEditMode
            ? "Discussion has been successfully updated."
            : "Discussion has been successfully created.",
          confirmButtonText: "Go to Home",
        }).then(() => {
          navigate("/"); // Redirect after success
        });
      })
      .catch((error) => {
        console.error("Error:", error);

        BlackSwal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error processing your request. Please try again later.",
        });
      });
  };

  return (
    <div>
      <h2>{isEditMode ? "Edit Discussion" : "Create a Discussion"}</h2>

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

      {/* Display description of the selected topic */}
      {selectedTopicDescription && (
        <div className="mt-3">
          <h5>Topic Description:</h5>
          <p>{selectedTopicDescription}</p>
        </div>
      )}

      {/* Input for Discussion Text */}
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

      {/* Submit button */}
      <button className="btn btn-primary mt-3" onClick={handleSubmit}>
        {isEditMode ? "Update Discussion" : "Create Discussion"}
      </button>
    </div>
  );
}

export default DiscussionForm;
