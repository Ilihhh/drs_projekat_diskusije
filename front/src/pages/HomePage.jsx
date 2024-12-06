import { useState, useEffect, useContext } from "react";
import Discussion from "../discussion/Discussion";
import { urlAllDiscussions, urlUserReactions } from "../utils/endpoints"; // Dodati url za reakcije
import axios from "axios";
import SearchBar from "../discussion/SearchBar";
import AuthenticationContext from "../auth/AuthenticationContext";

export default function HomePage() {
  const [discussions, setDiscussions] = useState([]);
  const [reactions, setReactions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { claims } = useContext(AuthenticationContext);

  const isLoggedIn = () => {
    // Proverava da li postoji claim sa imenom "username"
    return claims.some((claim) => claim.name === "username");
  };
  // Funkcija za dobavljanje reakcija za sve diskusije
  const fetchReactions = async (discussionIds) => {
    try {
      const response = await axios.post(urlUserReactions, {
        discussion_ids: discussionIds,
      });
      setReactions(response.data); // Pretpostavljamo da server vraća objekat { discussionId: reactionData }
    } catch (err) {
      console.error("Error fetching reactions:", err);
    }
  };

  // Funkcija za osvežavanje liste diskusija
  const fetchDiscussions = async () => {
    try {
      const response = await axios.get(urlAllDiscussions);
      setDiscussions(response.data);
      console.log(response.data);
      console.log(urlAllDiscussions);

      // Nakon dobavljanja diskusija, dobavi reakcije
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

  // Funkcija za ažuriranje diskusija prema rezultatima pretrage
  const updateDiscussions = async (searchResults) => {
    const results = Array.isArray(searchResults) ? searchResults : [];
    setDiscussions(results);

    // Nakon ažuriranja diskusija, dobavi reakcije ako ima diskusija i korisnik je prijavljen
    if (results.length > 0 && isLoggedIn()) {
      const discussionIds = results.map((discussion) => discussion.id);
      await fetchReactions(discussionIds);
    }
  };

  // Funkcija za osvežavanje liste diskusija nakon brisanja
  const handleDeleteDiscussion = async () => {
    await fetchDiscussions(); // Ponovno preuzimanje svih diskusija
  };

  // Poziva fetchDiscussions prilikom učitavanja stranice
  useEffect(() => {
    fetchDiscussions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div>Loading discussions...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <SearchBar updateDiscussions={updateDiscussions} />
      {discussions.length === 0 ? (
        <div className="alert alert-info">No discussions available.</div>
      ) : (
        discussions.map((discussion, index) => {
          const reaction = reactions[discussion.id]; // Dobij reakciju za ovu diskusiju
          console.log(discussion);
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
              reaction={reaction} // Prosleđuje reakciju korisnika
              onDelete={handleDeleteDiscussion} // Prosleđuje funkciju za brisanje
            />
          );
        })
      )}
    </div>
  );
}
