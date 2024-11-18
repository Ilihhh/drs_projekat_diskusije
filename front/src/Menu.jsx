import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthenticationContext from "./auth/AuthenticationContext";
import Authorized from "./auth/Authorize";
import Button from "./utils/Button";
import { logout } from "./auth/handleJWT";
export default function Menu() {
  const { update, claims } = useContext(AuthenticationContext);

  function getUsername() {
    return claims.filter((x) => x.name === "username")[0]?.value;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Diskusija :)
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/mydiscussions">
                My Discussions
              </NavLink>
            </li>
            <Authorized
              role="admin"
              authorized={
                <li className="nav-item">
                  <NavLink className="nav-link" to="/approveusers">
                    Approve Registrations
                  </NavLink>
                </li>
              }
            />
            <Authorized
              role="admin"
              authorized={
                <li className="nav-item">
                  <NavLink className="nav-link" to="/topicmanagement">
                    Topic Management
                  </NavLink>
                </li>
              }
            />
          </ul>

          <ul className="navbar-nav ms-auto">
            <Authorized
              authorized={
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/userProfile">
                      {getUsername()}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <Button
                      onClick={() => {
                        logout();
                        update([]);
                      }}
                      className="nav-link btn btn-link"
                    >
                      Log out
                    </Button>
                  </li>
                </>
              }
              notAuthorized={
                <>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link btn btn-link">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link btn btn-link">
                      Login
                    </Link>
                  </li>
                </>
              }
            />
          </ul>
        </div>
      </div>
    </nav>
  );
}
