import React from "react";
import CommentInput from "./CommentInput"; // Uvezi komponentu za unos komentara

export default function CommentSection({
  comments,
  discussionId,
  onAddComment,
  onDeleteComment,
  getUsername,
  isAdmin,
  authorUsername,
}) {
  return (
    <div className="card-footer">
      <h6>Comments</h6>
      {comments.map((comment, index) => {
        const isCommentAuthor = comment.author.username === getUsername();
        const isDiscussionAuthor = authorUsername === getUsername();

        return (
          <div key={index} className="card mb-2 shadow-sm">
            <div className="card-body">
              <p className="card-text">{comment.text}</p>
              <div className="d-flex justify-content-between align-items-center">
                <p className="text-muted mb-0">
                  <span className="fw-bold">{comment.author.username}</span> on{" "}
                  {comment.creation_date.replace("T", " ").split(".")[0]}
                </p>
                {(isCommentAuthor || isDiscussionAuthor || isAdmin) && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onDeleteComment(comment.id)}
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
      <CommentInput onAddComment={onAddComment} discussionId={discussionId} />
    </div>
  );
}
