import { Link } from "react-router-dom";

export default function CreateLink(props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
        marginTop: "2rem",
      }}
    >
      <h2>
        <Link
          to={props.to}
          style={{
            textDecoration: "none",
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.color = "white")}
          onMouseLeave={(e) => (e.target.style.color = "black")}
        >
          {props.children}
        </Link>
      </h2>
    </div>
  );
}
