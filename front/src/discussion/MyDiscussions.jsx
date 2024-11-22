import { useState, useEffect } from "react";
import Discussion from "../discussion/Discussion";
import { urlUserDiscussions } from "../utils/endpoints";
import axios from "axios";
import CreateLink from "./../utils/CreateLink";

export default function MyDiscussions() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await axios.get(urlUserDiscussions, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        //console.log(response.data);
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
      <CreateLink to="/create-discussion">+ Create Discussion</CreateLink>
      {discussions.length === 0 ? (
        <div className="alert alert-info">No discussions available.</div>
      ) : (
        discussions.map((discussion, index) => (
          <Discussion
            key={index}
            title={discussion.title}
            author={discussion.author}
            creation_date={discussion.creation_date}
            text={discussion.text}
            description={discussion.description}
            comments={discussion.comments || []}
          />
        ))
      )}
    </div>
  );
}
