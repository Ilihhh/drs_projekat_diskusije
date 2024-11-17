import Login from "./auth/Login";
import Register from "./auth/Register";
import MyDiscussions from "./discussion/MyDiscussions";
import HomePage from "./pages/HomePage";
import ApproveUsers from "./users/ApproveUsers";
import RedirectToHomePage from "./utils/RedirectToHomePage";

const routes = [
    {path: '/approveusers', element: ApproveUsers},
    {path: '/register', element: Register},
    {path: '/login', element: Login},
    {path: '/', element: HomePage},
    {path: '*', element: RedirectToHomePage},
    { path: "/mydiscussions", element: MyDiscussions },
];

export default routes;
