import React, { useContext, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Authorized from "../auth/Authorize";
import CommentInput from "./CommentInput"; // Uvezi komponentu za unos komentara
import axios from "axios"; // Dodaj axios za API pozive
import { urlDeleteComment, urlManageReaction } from "../utils/endpoints"; // URL za API endpoint za reakcije
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import AuthenticationContext from "../auth/AuthenticationContext";
import Swal from "sweetalert2";
import { urlDeleteDiscussion } from "../utils/endpoints";

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
  onDelete,
  reaction, // Dodaj trenutnu reakciju iz props-a
}) {
  const [allComments, setAllComments] = useState(comments); // Stanje za sve komentare
  const [likes, setLikes] = useState(likes_count); // Stanje za broj lajkova
  const [dislikes, setDislikes] = useState(dislikes_count); // Stanje za broj dislajkova
  const [userReaction, setUserReaction] = useState(reaction); // Inicijalizuj reakciju iz props-a
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const { claims } = useContext(AuthenticationContext);

  useEffect(() => {
    // console.log(reaction);
    // U slučaju promene reakcije iz props-a
    if (reaction) {
      setUserReaction(reaction);
    }
  }, [reaction]);

  function getUsername() {
    return claims.filter((x) => x.name === "username")[0]?.value;
  }

  function getIsAdmin() {
    return claims.some(
      (claim) => claim.name === "role" && claim.value === "admin"
    );
  }

  const handleVote = async (voteType) => {
    const newReaction = voteType === "upvote" ? "like" : "dislike";
    const updatedReaction = userReaction === newReaction ? "none" : newReaction;

    try {
      const response = await axios.post(urlManageReaction, {
        discussion_id: discussionId,
        reaction: updatedReaction,
      });

      if (response.status === 200) {
        const {
          likes: updatedLikes,
          dislikes: updatedDislikes,
          current_user_reaction,
        } = response.data;

        setLikes(updatedLikes);
        setDislikes(updatedDislikes);
        setUserReaction(current_user_reaction);
      }
    } catch (error) {
      console.error("Error managing reaction:", error.response || error);
      alert("Failed to update reaction. Please try again.");
    }
  };

  const handleAddComment = (addedComment) => {
    setAllComments((prevComments) => [...prevComments, addedComment]); // Dodaj novi komentar u listu
  };

  const handleEdit = () => {
    navigate(`/edit-discussion/${discussionId}`, {
      state: { title, text, topic, discussionId },
    });
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the discussion along with all its comments and reactions.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${urlDeleteDiscussion}/${discussionId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            Swal.fire("Deleted!", response.data.message, "success").then(() => {
              if (onDelete) {
                onDelete(discussionId);
              }
            });
          }
        } catch (error) {
          console.error("Error deleting discussion:", error.response || error);
          Swal.fire(
            "Error",
            "Failed to delete discussion. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`${urlDeleteComment}/${commentId}`);

      if (response.status === 200) {
        setAllComments(
          allComments.filter((comment) => comment.id !== commentId)
        );
      } else {
        alert("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error.response || error);
      alert("Error deleting comment. Please try again.");
    }
  };

  return (
    <div className="card shadow-lg rounded mb-4">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div>
            <h5 className="card-title">{title}</h5>
            <p className="card-subtitle text-muted">
              Posted by {author.username} on{" "}
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
        <Authorized
          authorized={
            <div className="text-center">
              <button
                className={`btn ${
                  userReaction === "like"
                    ? "btn-success"
                    : "btn-outline-success"
                } btn-sm mb-1`}
                onClick={() => handleVote("upvote")}
              >
                ⬆️
              </button>
              <div>{likes - dislikes}</div>
              <button
                className={`btn ${
                  userReaction === "dislike"
                    ? "btn-danger"
                    : "btn-outline-danger"
                } btn-sm mt-1`}
                onClick={() => handleVote("downvote")}
              >
                ⬇️
              </button>
            </div>
          }
          notAuthorized={
            <div className="text-center">
              <button
                className={`btn btn-outline-success btn-sm mb-1`}
                onClick={() => navigate("/login?redirected=true")}
              >
                ⬆️
              </button>
              <div>{likes - dislikes}</div>
              <button
                className={`btn btn-outline-danger btn-sm mt-1`}
                onClick={() => navigate("/login?redirected=true")}
              >
                ⬇️
              </button>
            </div>
          }
        />
      </div>

      {/* Post Content */}
      <div className="card-body bg-light">
        <p className="card-text">{text}</p>
      </div>

      {/* Comments */}
      <div className="card-footer">
        <h6>Comments</h6>
        {allComments.map((comment, index) => {
          const isCommentAuthor = comment.author.username === getUsername();
          const isDiscussionAuthor = author.username === getUsername();
          const isAdmin = getIsAdmin();

          return (
            <div key={index} className="card mb-2 shadow-sm">
              <div className="card-body">
                <p className="card-text">{comment.text}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="text-muted mb-0">
                    <span className="fw-bold">{comment.author.username}</span>{" "}
                    on {comment.creation_date.replace("T", " ").split(".")[0]}
                  </p>
                  {(isCommentAuthor || isDiscussionAuthor || isAdmin) && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete Discussion
            </button>
          </div>
        }
      />
    </div>
  );
}
