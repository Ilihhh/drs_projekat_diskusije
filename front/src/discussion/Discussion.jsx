import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Authorized from "../auth/Authorize";
import CommentInput from "./CommentInput";  // Uvezi komponentu za unos komentara

export default function Discussion({
  title,
  author,
  creation_date,
  text,
  description,
  comments,
  likes_count,
  dislikes_count,
  discussionId  // Dodaj ID diskusije kao prop
}) {
  const [clicked, setClicked] = useState(false);
  const [allComments, setAllComments] = useState(comments); // Stanje za sve komentare

  const handleVote = (voteType) => {
    if (voteType === "upvote") {
      setClicked(true);
    } else if (voteType === "downvote") {
      setClicked(true);
    }
  };

  const handleAddComment = (newComment) => {
    setAllComments([...allComments, { text: newComment }]);  // Dodaj novi komentar u listu
  };

  return (
    <div className="card shadow-lg rounded mb-4">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div>
            <h5 className="card-title">{title}</h5>
            <p className="card-subtitle text-muted">
              Posted by {author} on {creation_date ? creation_date.replace("T", " ") : null}
            </p>
          </div>
        </div>

        {/* Voting */}
        <div className="text-center">
          <button
            className={`btn ${
              clicked ? "btn-success" : "btn-outline-success"
            } btn-sm mb-1`}
            onClick={() => handleVote("upvote")}
          >
            👍
          </button>
          <div>{likes_count - dislikes_count}</div>
          <button
            className={`btn ${
              clicked ? "btn-danger" : "btn-outline-danger"
            } btn-sm mt-1`}
            onClick={() => handleVote("downvote")}
          >
            👎
          </button>
        </div>
      </div>

      {/* Topic Description */}
      {description && (
        <div className="card-body bg-light">
          <h6>Topic Description:</h6>
          <p>{description}</p>
        </div>
      )}

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
        <CommentInput onAddComment={handleAddComment} discussionId={discussionId} />
      </div>

      {/* Admin Functionalities */}
      <Authorized
        role="admin"
        authorized={
          <div className="card-footer text-end">
            <button
              className="btn btn-warning me-2"
              onClick={() => alert("Editing discussion...")}
            >
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
