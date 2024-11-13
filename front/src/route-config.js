import Login from "./auth/Login";
import Register from "./auth/Register";
import HomePage from "./pages/HomePage";
import RedirectToHomePage from "./utils/RedirectToHomePage";

const routes = [
    {path: '/register', element: Register},
    {path: '/login', element: Login},
    {path: '/', element: HomePage},
    {path: '*', element: RedirectToHomePage}
];

export default routes;