import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthenticationContext from "./auth/AuthenticationContext";
import Authorized from "./auth/Authorize";
import { logout } from "./auth/handleJWT";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Menu() {
  const { update, claims } = useContext(AuthenticationContext);

  function getUsername() {
    return claims.filter((x) => x.name === "username")[0]?.value;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        {/* Logo */}
        <NavLink className="navbar-brand" to="/">
          Diskusija :)
        </NavLink>

        {/* Toggler Button za mobilni prikaz */}
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

        {/* Meni Linkovi */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <Authorized
              authorized={
                <li className="nav-item">
                  <NavLink className="nav-link" to="/mydiscussions">
                    My Discussions
                  </NavLink>
                </li>
              }
            />
            <Authorized
              role="admin"
              authorized={
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/approveusers">
                      Approve Registrations
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/registeredusers">
                      Registered Users
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/topicmanagement">
                      Topic Management
                    </NavLink>
                  </li>
                </>
              }
            />
          </ul>

          <ul className="navbar-nav ms-auto">
            <Authorized
              authorized={
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/userinfo">
                      {getUsername()}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/"
                      className="nav-link"
                      onClick={() => {
                        logout();
                        update([]);
                      }}
                    >
                      Log out
                    </NavLink>
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
