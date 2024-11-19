import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Authorized from "../auth/Authorize";
import { urlAllDiscussions } from "../utils/endpoints";

export default function DiscussionPage() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        
        const response = await axios.get(urlAllDiscussions, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDiscussions(response.data);
      } catch (err) {
        console.error("Error fetching discussions:", err);
        setError("Failed to fetch discussions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  if (loading) return <div>Loading discussions...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      {discussions.length === 0 ? (
        <div className="alert alert-info">No discussions available.</div>
      ) : (
        discussions.map((discussion, index) => (
          <Discussion
            key={index}
            title={discussion.title}
            author={discussion.author}
            date={discussion.date}
            content={discussion.content}
            description={discussion.description}
            comments={discussion.comments || []}
          />
        ))
      )}
    </div>
  );
}

function Discussion({
  title,
  author,
  date,
  content,
  description,
  comments,
}) {
  const [votes, setVotes] = useState(0);
  const [clicked, setClicked] = useState(false);

  const handleVote = (voteType) => {
    if (voteType === "upvote") {
      setVotes(votes + 1);
      setClicked(true);
    } else if (voteType === "downvote") {
      setVotes(votes - 1);
      setClicked(true);
    }
  };

  return (
    <div className="card shadow-lg rounded mb-4">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div>
            <h5 className="card-title">{title}</h5>
            <p className="card-subtitle text-muted">
              Posted by {author} on {date}
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
          <div>{votes}</div>
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
        <p className="card-text">{content}</p>
      </div>

      {/* Comments */}
      <div className="card-footer">
        <h6>Comments</h6>
        {comments.map((comment, index) => (
          <div key={index} className="card mb-2 shadow-sm">
            <div className="card-body">
              <p className="card-text">{comment}</p>
            </div>
          </div>
        ))}
        <button
          className="btn btn-primary mt-2"
          onClick={() => alert("Leave a funny comment!")}
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
