import Discussion from "./Discussion";

export default function MyDiscussions() {
  const comments = [
    "I really like it ❤️❤️❤️",
    "I’m dying of love ❤️",
    "10/10, would read again 🔥",
    "Big Smok 🚬🚬🚬",
  ];
  return (
    <Discussion
      title="How i met you mother?"
      author="smacker2456"
      date="November 17, 2024"
      content="One summer, while I was on vacation with friends, I met your mom at a fun party. Little did I know then that it would be a meeting that would change many things in my life. We were sitting at the table, laughing about something stupid someone had said, and she immediately radiated her energy. She came over and started talking about some interesting books she was reading, and her laugh and charm completely won me over. Today, when I think back to that moment, I can't believe that from that chance meeting a story was born that brought us together in the way we share our lives today."
      comments={comments}
    />
  );
}
