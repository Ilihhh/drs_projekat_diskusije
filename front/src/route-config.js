import Login from "./auth/Login";
import Register from "./auth/Register";
import MyDiscussions from "./discussion/MyDiscussions";
import HomePage from "./pages/HomePage";
import TopicPage from "./pages/TopicPage";
import ApproveUsers from "./users/ApproveUsers";
import RedirectToHomePage from "./utils/RedirectToHomePage";
import DiscussionForm from "./forms/DiscussionForm";
import TopicForm from "./forms/TopicForm";
import EditUser from "./users/EditUser";
import UserInfo from "./users/UserInfo";

const routes = [
  { path: "/approveusers", element: ApproveUsers, isAdmin: true },
  { path: "/register", element: Register },
  { path: "/login", element: Login },
  { path: "/", element: HomePage },
  { path: "*", element: RedirectToHomePage },
  { path: "/mydiscussions", element: MyDiscussions, isLoggedIn: true },
  { path: "/create-discussion", element: DiscussionForm, isLoggedIn: true },
  { path: "/topicmanagement", element: TopicPage, isAdmin: true },
  { path: "/create-topic", element: TopicForm, isAdmin: true },
  { path: "/edit-topic/:id", element: TopicForm, isAdmin: true },
  { path: "/edituser", element: EditUser, isLoggedIn: true },
  { path: "/userinfo", element: UserInfo, isLoggedIn: true },
];

export default routes;
