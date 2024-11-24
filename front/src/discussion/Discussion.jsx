import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Authorized from "../auth/Authorize";
import CommentInput from "./CommentInput"; // Uvezi komponentu za unos komentara
import axios from "axios"; // Dodaj axios za API pozive
import { urlManageReaction } from "../utils/endpoints"; // URL za API endpoint za reakcije
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

export default function Discussion({
  title,
  author,
  creation_date,
  text,
  comments,
  likes_count,
  dislikes_count,
  discussionId, // Dodaj ID diskusije kao prop
  topic, // topic je objekat koji sadrži name i description
}) {
  const [allComments, setAllComments] = useState(comments); // Stanje za sve komentare
  const [likes, setLikes] = useState(likes_count); // Stanje za broj lajkova
  const [dislikes, setDislikes] = useState(dislikes_count); // Stanje za broj dislajkova
  const [userReaction, setUserReaction] = useState(null); // Stanje za trenutnu reakciju korisnika
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleVote = async (voteType) => {
    const reaction = voteType === "upvote" ? "like" : "dislike";

    // Ako korisnik klikne na istu reakciju, uklanja se reakcija
    const newReaction = userReaction === reaction ? "none" : reaction;

    try {
      const response = await axios.post(
        urlManageReaction,
        {
          discussion_id: discussionId,
          reaction: newReaction,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const { likes: updatedLikes, dislikes: updatedDislikes } =
          response.data;

        // Ažuriraj broj lajkova i dislajkova
        setLikes(updatedLikes);
        setDislikes(updatedDislikes);

        // Ažuriraj trenutnu reakciju korisnika
        setUserReaction(newReaction === "none" ? null : newReaction);
      } else {
        throw new Error("Failed to update reaction.");
      }
    } catch (error) {
      console.error("Error managing reaction:", error.response || error);
      alert("Failed to update reaction. Please try again.");
    }
  };

  const handleAddComment = (newComment) => {
    setAllComments([...allComments, { text: newComment }]); // Dodaj novi komentar u listu
  };

  const handleEdit = () => {
    console.log(discussionId);
    navigate(`/edit-discussion/${discussionId}`, {
      state: { title, text, topic, discussionId },
    });
  };

  return (
    <div className="card shadow-lg rounded mb-4">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div>
            <h5 className="card-title">{title}</h5>
            <p className="card-subtitle text-muted">
              Posted by {author} on{" "}
              {creation_date
                ? creation_date.replace("T", " ").split(".")[0]
                : null}
            </p>

            {/* Topic Title and Description */}
            {topic && (
              <div className="mt-3">
                <h6>
                  Topic Title: {topic.name} | Description: {topic.description}
                </h6>
              </div>
            )}
          </div>
        </div>

        {/* Voting */}
        <div className="text-center">
          <button
            className={`btn ${
              userReaction === "like" ? "btn-success" : "btn-outline-success"
            } btn-sm mb-1`}
            onClick={() => handleVote("upvote")}
          >
            👍
          </button>
          <div>{likes - dislikes}</div>
          <button
            className={`btn ${
              userReaction === "dislike" ? "btn-danger" : "btn-outline-danger"
            } btn-sm mt-1`}
            onClick={() => handleVote("downvote")}
          >
            👎
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="card-body bg-light">
        <p className="card-text">{text}</p>
      </div>

      {/* Comments */}
      <div className="card-footer">
        <h6>Comments</h6>
        {allComments.map((comment, index) => (
          <div key={index} className="card mb-2 shadow-sm">
            <div className="card-body">
              <p className="card-text">{comment.text}</p>
            </div>
          </div>
        ))}

        {/* Dodaj komponentu za unos komentara */}
        <CommentInput
          onAddComment={handleAddComment}
          discussionId={discussionId}
        />
      </div>

      {/* Admin Functionalities */}
      <Authorized
        role="admin"
        authorized={
          <div className="card-footer text-end">
            <button className="btn btn-warning me-2" onClick={handleEdit}>
              Edit Discussion
            </button>
            <button
              className="btn btn-danger"
              onClick={() => alert("Deleting discussion...")}
            >
              Delete Discussion
            </button>
          </div>
        }
      />
    </div>
  );
}
