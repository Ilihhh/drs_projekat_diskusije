import React from "react";
import Authorized from "../../auth/Authorize"; // Importujemo autorizaciju za glasanje

export default function VoteSection({
  likes,
  dislikes,
  userReaction,
  handleVote,
  navigate,
}) {
  return (
    <Authorized
      authorized={
        <div className="text-center">
          <button
            className={`btn ${
              userReaction === "like" ? "btn-success" : "btn-outline-success"
            } btn-sm mb-1`}
            onClick={() => handleVote("upvote")}
          >
            ↑
          </button>
          <div>{likes - dislikes}</div>
          <button
            className={`btn ${
              userReaction === "dislike"
                ? "btn-danger-vote"
                : "btn-outline-danger"
            } btn-sm mt-1`}
            onClick={() => handleVote("downvote")}
          >
            ↓
          </button>
        </div>
      }
      notAuthorized={
        <div className="text-center">
          <button
            className="btn btn-outline-success btn-sm mb-1"
            onClick={() => navigate("/login?redirected=true")}
          >
            ↑
          </button>
          <div>{likes - dislikes}</div>
          <button
            className="btn btn-outline-danger btn-sm mt-1"
            onClick={() => navigate("/login?redirected=true")}
          >
            ↓
          </button>
        </div>
      }
    />
  );
}
