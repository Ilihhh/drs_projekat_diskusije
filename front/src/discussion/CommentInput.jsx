import React, { useState, useEffect } from "react";
import axios from "axios";
import { MentionsInput, Mention } from "react-mentions";
import { urlAddComment, urlSearchUsers } from "../utils/endpoints";
import mentionStyles from "./mentionStyles"; // Import stilova

export default function CommentInput({ onAddComment, discussionId }) {
  const [newComment, setNewComment] = useState("");
  const [userSuggestions, setUserSuggestions] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(urlSearchUsers);
        if (response.status === 200) {
          const allUsers = response.data.map((user) => ({
            id: user.username,
            display: `@${user.username}`,
          }));
          setUserSuggestions(allUsers);
        }
      } catch (error) {
        console.error("Error fetching user suggestions:", error);
      }
    };

    fetchAllUsers();
  }, []);

  const formatCommentText = (text) => {
    const cleanedText = text.replace(/^@\[(@.*?)\]/, "[$1]");
    return cleanedText.replace(/\[@(.*?)\]\((.*?)\)/g, "@$1");
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const mentions = userSuggestions
        .filter((user) => newComment.includes(`@${user.id}`))
        .map((user) => user.id);

      const commentData = {
        commentText: formatCommentText(newComment),
        mentions,
        discussionId,
      };

      try {
        const response = await axios.post(urlAddComment, commentData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const addedComment = response.data;
          onAddComment(addedComment);
          setNewComment("");
        } else {
          console.error("Failed to add comment.");
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  return (
    <div>
      <MentionsInput
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Type your comment here..."
        className="form-control"
        style={mentionStyles} // Dodaj stilove
      >
        <Mention
          trigger="@"
          data={userSuggestions}
          appendSpaceOnAdd={true}
          style={mentionStyles.suggestions} // Stil za sugestije
        />
      </MentionsInput>
      <button className="btn btn-primary mt-2" onClick={handleAddComment}>
        Add a Comment
      </button>
    </div>
  );
}
