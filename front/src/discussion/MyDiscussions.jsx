import { useState, useEffect, useContext } from "react";
import Discussion from "../discussion/Discussion";
import { urlUserDiscussions, urlUserReactions } from "../utils/endpoints";
import axios from "axios";
import CreateLink from "./../utils/CreateLink";
import SearchBar from "./SearchBar";
import AuthenticationContext from "../auth/AuthenticationContext"; // Import context for authentication

export default function MyDiscussions() {
  const [discussions, setDiscussions] = useState([]);
  const [reactions, setReactions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { claims } = useContext(AuthenticationContext); // Get authentication context

  // Check if the user is logged in
  const isLoggedIn = () => {
    // Check if there's a "username" claim
    return claims.some((claim) => claim.name === "username");
  };

  // Function to fetch reactions for discussions
  const fetchReactions = async (discussionIds) => {
    try {
      const response = await axios.post(urlUserReactions, { discussion_ids: discussionIds });
      setReactions(response.data); // Assuming server returns { discussionId: reactionData }
    } catch (err) {
      console.error("Error fetching reactions:", err);
    }
  };

  // Function to fetch discussions for the logged-in user
  const fetchDiscussions = async () => {
    try {
      const response = await axios.get(urlUserDiscussions); // Fetch discussions related to the logged-in user
      setDiscussions(response.data);

      // If the user is logged in, fetch reactions for each discussion
      const discussionIds = response.data.map((discussion) => discussion.id);
      if (discussionIds.length > 0 && isLoggedIn()) {
        await fetchReactions(discussionIds);
      }
    } catch (err) {
      console.error("Error fetching discussions:", err);
      setError("Failed to fetch discussions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Update discussions based on search results
  const updateDiscussions = async (searchResults) => {
    const results = Array.isArray(searchResults) ? searchResults : [];
    setDiscussions(results);
  
    // Nakon ažuriranja diskusija, dobavi reakcije ako ima diskusija i korisnik je prijavljen
    if (results.length > 0 && isLoggedIn()) {
      const discussionIds = results.map((discussion) => discussion.id);
      await fetchReactions(discussionIds);
    }
  };

  // Refresh the discussion list after deleting a discussion
  const handleDeleteDiscussion = async () => {
    await fetchDiscussions(); // Re-fetch discussions
  };

  // Fetch discussions when the component mounts
  useEffect(() => {
    fetchDiscussions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          const reaction = reactions[discussion.id]; // Get reaction for this discussion
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
              reaction={reaction} // Pass user reaction
              onDelete={handleDeleteDiscussion} // Pass delete handler
            />
          );
        })
      )}
    </div>
  );
}
