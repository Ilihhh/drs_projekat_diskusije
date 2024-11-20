import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Authorized from "../auth/Authorize";

export default function Discussion({
  title,
  author,
  creation_date,
  text,
  description,
  comments,
  likes_count,
  dislikes_count
}) {
  const [clicked, setClicked] = useState(false);
  const [newComment, setNewComment] = useState(""); // Stanje za novi komentar
  const [allComments, setAllComments] = useState(comments); // Stanje za sve komentare


  const handleVote = (voteType) => {
    if (voteType === "upvote") {
      setClicked(true);
    } else if (voteType === "downvote") {
      setClicked(true);
    }
  }
  const handleAddComment = () => {
    if (newComment.trim()) {
      setAllComments([...allComments, newComment]);
      setNewComment(""); // Očisti polje nakon dodavanja komentara
      // Možete dodati logiku za slanje komentara na server ako je potrebno
    }
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
          <div>{likes_count-dislikes_count}</div>
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
              <p className="card-text">{comment}</p>
            </div>
          </div>
        ))}

        {/* Polje za unos novog komentara */}
        <textarea
          className="form-control mt-3"
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
        ></textarea>

        {/* Dugme za dodavanje komentara */}
        <button
          className="btn btn-primary mt-2"
          onClick={handleAddComment} // Poziva funkciju za dodavanje komentara
        >
          Add a Comment
        </button>
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
