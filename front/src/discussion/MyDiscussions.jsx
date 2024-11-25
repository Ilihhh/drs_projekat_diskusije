import { useState, useEffect } from "react";
import Discussion from "../discussion/Discussion";
import { urlUserDiscussions } from "../utils/endpoints";
import axios from "axios";
import CreateLink from "./../utils/CreateLink";
import SearchBar from "./SearchBar";

export default function MyDiscussions() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiscussions = async () => {
    try {
      const response = await axios.get(urlUserDiscussions);
      setDiscussions(response.data);
    } catch (err) {
      console.error("Error fetching discussions:", err);
      setError("Failed to fetch discussions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateDiscussions = (searchResults) => {
    setDiscussions(Array.isArray(searchResults) ? searchResults : []);
  };


  // Funkcija za osvežavanje liste nakon brisanja diskusije
  const handleDeleteDiscussion = async () => {
    await fetchDiscussions(); // Ponovno preuzimanje svih diskusija
  };

  
  // Poziva fetchDiscussions prilikom učitavanja stranice
  useEffect(() => {
    fetchDiscussions();
  }, []);

  if (loading) return <div>Loading discussions...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <CreateLink to="/create-discussion">+ Create Discussion</CreateLink>
      <SearchBar updateDiscussions={updateDiscussions} />
      {discussions.length === 0 ? (
        <div className="alert alert-info">No discussions available.</div>
      ) : (
        discussions.map((discussion, index) => {
          return (
            <Discussion
              key={index}
              title={discussion.title}
              discussionId={discussion.id}
              text={discussion.text}
              author={discussion.author}
              creation_date={discussion.creation_date}
              comments={discussion.comments || []}
              likes_count={discussion.likes_count}
              dislikes_count={discussion.dislikes_count}
              topic={discussion.topic} // topic title
              description={discussion.description} // topic text
              onDelete={handleDeleteDiscussion} // Prosleđuje funkciju za brisanje
            />
          );
        })
      )}
    </div>
  );
}
