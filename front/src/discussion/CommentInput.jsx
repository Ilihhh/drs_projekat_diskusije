import React, { useState } from "react";
import axios from "axios"; // Importuj axios
import { urlAddComment } from "../utils/endpoints";

// Funkcija za prepoznavanje mentiona u tekstu
const findMentions = (text) => {
  const mentionRegex = /@(\w+)/g; // Traži sve mentione (@korisnik)
  const matches = [];
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    matches.push(match[1]); // Spremi ime korisnika bez '@'
  }
  return matches;
};

// Komponenta za unos komentara
export default function CommentInput({ onAddComment, discussionId }) {
  const [newComment, setNewComment] = useState("");

  // Funkcija za dodavanje komentara
  const handleAddComment = async () => {
    if (newComment.trim()) {
      const mentions = findMentions(newComment); // Pronađi mentione u tekstu
      const commentData = {
        commentText: newComment,
        mentions: mentions, // Prosledi mentionovane korisnike
        discussionId: discussionId, // Dodaj ID diskusije
      };
  
      try {
        // Poziv backend-a za dodavanje komentara koristeći axios
        const response = await axios.post(urlAddComment, commentData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.status === 200) {
          // Backend vraća kompletan objekat komentara (uključujući ID)
          const addedComment = response.data; 
          onAddComment(addedComment); // Pozovi roditeljsku funkciju sa podacima iz backend odgovora
          console.log(addedComment);
          setNewComment(""); // Očisti polje nakon dodavanja komentara
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
      <textarea
        className="form-control mt-3"
        rows="3"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write your comment here..."
      ></textarea>
      <button className="btn btn-primary mt-2" onClick={handleAddComment}>
        Add a Comment
      </button>
    </div>
  );
}
