// import React from "react";

// export default function Discussion(props) {
//   return (
//     <div className="container mt-4">
//       {/* Glavni okvir diskusije */}
//       <div className="card">
//         <div className="card-header">
//           <h5 className="card-title">{props.title}</h5>
//           <p className="card-subtitle mb-2 text-muted">
//             Posted by {props.author} on {props.date}
//           </p>
//         </div>
//         <div className="card-body">
//           <p className="card-text">{props.content}</p>
//         </div>

//         {/* Komentari */}
//         <div className="card-footer">
//           <button
//             className="btn btn-primary btn-sm mr-2"
//             onClick={() => alert("Replying...")}
//           >
//             Reply
//           </button>
//           <button
//             className="btn btn-outline-success btn-sm"
//             onClick={() => alert("Liking...")}
//           >
//             Like
//           </button>
//         </div>
//       </div>

//       {/* Komentari */}
//       <div className="mt-3">
//         {props.comments.map((comment, index) => (
//           <div className="card mb-2" key={index}>
//             <div className="card-body">
//               <p className="card-text">{comment}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// // }

// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function Discussion(props) {
//   const [votes, setVotes] = useState(0);
//   const [clicked, setClicked] = useState(false);

//   // Statičke brojke za emotikone
//   const [emojiCounts, setEmojiCounts] = useState({
//     laugh: 0,
//     clap: 0,
//     fire: 0,
//   });

//   const handleVote = (voteType) => {
//     if (voteType === "upvote") {
//       setVotes(votes + 1);
//       setClicked(true);
//     } else if (voteType === "downvote") {
//       setVotes(votes - 1);
//       setClicked(true);
//     }
//   };

//   const handleEmojiClick = (emoji) => {
//     setEmojiCounts((prevCounts) => ({
//       ...prevCounts,
//       [emoji]: prevCounts[emoji] + 1,
//     }));
//   };

//   return (
//     <div className="container mt-4">
//       {/* Glavni okvir postova */}
//       <div className="card shadow-lg rounded">
//         <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
//           <div className="d-flex">
//             <div className="avatar me-3">
//               <img
//                 src={`https://i.pravatar.cc/150?img=${Math.floor(
//                   Math.random() * 70
//                 )}`}
//                 alt="avatar"
//                 className="rounded-circle"
//                 width="40"
//               />
//             </div>
//             <div>
//               <h5 className="card-title">{props.title}</h5>
//               <p className="card-subtitle text-muted">
//                 Posted by {props.author} on {props.date}
//               </p>
//             </div>
//           </div>
//           {/* Glasanje */}
//           <div className="text-center">
//             <button
//               className={`btn ${
//                 clicked ? "btn-success" : "btn-outline-success"
//               } btn-sm mb-1`}
//               onClick={() => handleVote("upvote")}
//             >
//               👍
//             </button>
//             <div>{votes}</div>
//             <button
//               className={`btn ${
//                 clicked ? "btn-danger" : "btn-outline-danger"
//               } btn-sm mt-1`}
//               onClick={() => handleVote("downvote")}
//             >
//               👎
//             </button>
//           </div>
//         </div>

//         {/* Sadržaj posta */}
//         <div className="card-body bg-light">
//           <p className="card-text">{props.content}</p>
//           <div className="text-end">
//             {/* Klikabilni emotikoni */}
//             <span
//               role="img"
//               aria-label="laugh"
//               className="fs-1 me-3"
//               onClick={() => handleEmojiClick("laugh")}
//               style={{ cursor: "pointer" }}
//             >
//               😂 {emojiCounts.laugh > 0 && `(${emojiCounts.laugh})`}
//             </span>
//             <span
//               role="img"
//               aria-label="clapping"
//               className="fs-1 me-3"
//               onClick={() => handleEmojiClick("clap")}
//               style={{ cursor: "pointer" }}
//             >
//               👏 {emojiCounts.clap > 0 && `(${emojiCounts.clap})`}
//             </span>
//             <span
//               role="img"
//               aria-label="fire"
//               className="fs-1 me-3"
//               onClick={() => handleEmojiClick("fire")}
//               style={{ cursor: "pointer" }}
//             >
//               🔥 {emojiCounts.fire > 0 && `(${emojiCounts.fire})`}
//             </span>
//           </div>
//         </div>

//         {/* Komentari */}
//         <div className="card-footer">
//           <h6>Comments</h6>
//           {props.comments.map((comment, index) => (
//             <div key={index} className="card mb-2 shadow-sm">
//               <div className="card-body">
//                 <p className="card-text">
//                   {comment}{" "}
//                   <span role="img" aria-label="wink" className="ms-2">
//                     😉
//                   </span>
//                 </p>
//               </div>
//             </div>
//           ))}
//           <button
//             className="btn btn-primary mt-2"
//             onClick={() => alert("Leave a funny comment!")}
//           >
//             Add a Comment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Authorized from "../auth/Authorize";

// Komponenta koja omogućava prikaz diskusije, glasanje i komentare
export default function Discussion(props) {
  const [votes, setVotes] = useState(0);
  const [clicked, setClicked] = useState(false);

  const handleVote = (voteType) => {
    if (voteType === "upvote") {
      setVotes(votes + 1);
      setClicked(true);
    } else if (voteType === "downvote") {
      setVotes(votes - 1);
      setClicked(true);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg rounded">
        <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <div className="avatar me-3">
              <img
                src={`https://i.pravatar.cc/150?img=${Math.floor(
                  Math.random() * 70
                )}`}
                alt="avatar"
                className="rounded-circle"
                width="40"
              />
            </div>
            <div>
              <h5 className="card-title">{props.title}</h5>
              <p className="card-subtitle text-muted">
                Posted by {props.author} on {props.date}
              </p>
            </div>
          </div>

          {/* Glasanje */}
          <div className="text-center">
            <button
              className={`btn ${
                clicked ? "btn-success" : "btn-outline-success"
              } btn-sm mb-1`}
              onClick={() => handleVote("upvote")}
            >
              👍
            </button>
            <div>{votes}</div>
            <button
              className={`btn ${
                clicked ? "btn-danger" : "btn-outline-danger"
              } btn-sm mt-1`}
              onClick={() => handleVote("downvote")}
            >
              👎
            </button>
          </div>
        </div>

        {/* Sadržaj posta */}
        <div className="card-body bg-light">
          <p className="card-text">{props.content}</p>
        </div>

        {/* Komentari */}
        <div className="card-footer">
          <h6>Comments</h6>
          {props.comments.map((comment, index) => (
            <div key={index} className="card mb-2 shadow-sm">
              <div className="card-body">
                <p className="card-text">{comment} </p>
              </div>
            </div>
          ))}
          <button
            className="btn btn-primary mt-2"
            onClick={() => alert("Leave a funny comment!")}
          >
            Add a Comment
          </button>
        </div>

        {/* Admin funkcionalnosti: Kreiranje, Izmena i Brisanje */}
        <Authorized
          role="admin"
          authorized={
            <div className="card-footer text-end">
              <button
                className="btn btn-warning me-2"
                onClick={() => alert("Editing discussion...")}
              >
                Edit Discussion
              </button>
              <button
                className="btn btn-danger"
                onClick={() => alert("Deleting discussion...")}
              >
                Delete Discussion
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
}
