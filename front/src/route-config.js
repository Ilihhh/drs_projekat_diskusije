import Login from "./auth/Login";
import Register from "./auth/Register";
import MyDiscussions from "./discussion/MyDiscussions";
import HomePage from "./pages/HomePage";
import TopicPage from "./pages/TopicPage";
import ApproveUsers from "./users/ApproveUsers";
import RedirectToHomePage from "./utils/RedirectToHomePage";
import DiscussionForm from "./forms/DiscussionForm";
import CreateTopicForm from "./forms/TopicForm";

const routes = [
  { path: "/approveusers", element: ApproveUsers },
  { path: "/register", element: Register },
  { path: "/login", element: Login },
  { path: "/", element: HomePage },
  { path: "*", element: RedirectToHomePage },
  { path: "/mydiscussions", element: MyDiscussions },
  { path: "/create-discussion", element: DiscussionForm },
  { path: "/topicmanagement", element: TopicPage },
  { path: "/create-topic", element: CreateTopicForm },
];

export default routes;
