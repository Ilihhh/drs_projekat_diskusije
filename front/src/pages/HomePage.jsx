import React from "react";
import Discussion from "../discussion/Discussion";
import CreateLink from "../utils/CreateLink";
import SearchBar from "../discussion/SearchBar";

export default function HomePage() {
  const comments = [
    "This is literally me 🙈",
    "I’m dying 😂",
    "10/10, would read again 🔥",
    "Big mood 😎",
  ];

  return (
    <div className="container">
      <CreateLink
        to="/create-discussion"
      >
        + Create a Discussion
      </CreateLink>
      <SearchBar />
      <Discussion
        title="How to make your posts funnier?" //fali diesription
        author="Jane Doe"
        date="November 15, 2024"
        content="Ever wondered how to add a little bit of humor to your online posts? Here are some tips: 1. Use emojis, 2. Use memes, 3. Be yourself and don't be afraid to be a little silly!"
        comments={comments}
      />
    </div>
  );
}
