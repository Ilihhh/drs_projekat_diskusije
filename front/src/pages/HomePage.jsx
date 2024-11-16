import React from "react";
import Discussion from "../discussion/Discussion";
import SearchAndCreate from "../discussion/SearchBar";

export default function HomePage() {
  //const comments = ["Nigga", "MEL"];
  const comments = [
    "This is literally me 🙈",
    "I’m dying 😂",
    "10/10, would read again 🔥",
    "Big mood 😎",
  ];
  return (
    <div>
      {/* <Discussion
        title="HOW TO NIGGA"
        author="Joe Biden"
        date="November 15, 2024"
        content="This is an example of how you can use Bootstrap within a React application. You can easily make responsive layouts and nice UI components."
        comments={comments}
      /> */}
      <SearchAndCreate />
      <Discussion
        title="How to make your posts funnier?"
        author="Jane Doe"
        date="November 15, 2024"
        content="Ever wondered how to add a little bit of humor to your online posts? Here are some tips: 1. Use emojis, 2. Use memes, 3. Be yourself and don't be afraid to be a little silly!"
        comments={comments}
      />
    </div>
  );
}
