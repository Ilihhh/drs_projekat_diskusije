import React from "react";
import VoteSection from "./VoteSection";

export default function DiscussionHeader({
  title,
  author,
  creation_date,
  topic,
  likes,
  dislikes,
  userReaction,
  handleVote,
  navigate,
}) {
  return (
    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
      <div className="d-flex">
        <div>
          <h5 className="card-title">{title}</h5>
          <p className="card-subtitle text-light">
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

      {/* Voting Section */}
      <VoteSection
        likes={likes}
        dislikes={dislikes}
        userReaction={userReaction}
        handleVote={handleVote}
        navigate={navigate}
      />
    </div>
  );
}
