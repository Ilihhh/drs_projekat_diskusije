import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { urlDeleteComment, urlManageReaction } from "../utils/endpoints";
import { useNavigate } from "react-router-dom";
import AuthenticationContext from "../auth/AuthenticationContext";
import CommentSection from "./discussion_compoenents/Comment";
import AdminActions from "./discussion_compoenents/AdminActions";
import DiscussionHeader from "./discussion_compoenents/DiscussionHeader";

export default function Discussion({
  title,
  author,
  creation_date,
  text,
  comments,
  likes_count,
  dislikes_count,
  discussionId,
  topic,
  onDelete,
  reaction,
}) {
  const [allComments, setAllComments] = useState(comments);
  const [likes, setLikes] = useState(likes_count);
  const [dislikes, setDislikes] = useState(dislikes_count);
  const [userReaction, setUserReaction] = useState(reaction);
  const navigate = useNavigate();
  const { claims } = useContext(AuthenticationContext);

  useEffect(() => {
    setUserReaction(reaction);
    setLikes(likes_count);
    setDislikes(dislikes_count);
  }, [reaction, likes_count, dislikes_count]);

  function getUsername() {
    return claims.filter((x) => x.name === "username")[0]?.value;
  }

  const isOwner = getUsername() === author.username;

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
    setAllComments((prevComments) => [...prevComments, addedComment]);
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
      <DiscussionHeader
        title={title}
        author={author}
        creation_date={creation_date}
        topic={topic}
        likes={likes}
        dislikes={dislikes}
        userReaction={userReaction}
        handleVote={handleVote}
        navigate={navigate}
      />

      {/* Post Content */}
      <div className="card-body bg-light">
        <p className="card-text">{text}</p>
      </div>

      {/* Comments */}
      <CommentSection
        comments={allComments}
        discussionId={discussionId}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        getUsername={getUsername}
        isAdmin={getIsAdmin()}
        authorUsername={author.username}
      />

      {/* Admin Functionalities */}
      {(getIsAdmin() || isOwner) && (
        <AdminActions
          discussionId={discussionId}
          title={title}
          text={text}
          topic={topic}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
