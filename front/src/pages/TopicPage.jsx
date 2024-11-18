import React from "react";
import TopicList from "./../topic/TopicList";

export default function TopicPage() {
  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>Topic Management</h1>
      <TopicList />
    </div>
  );
}
