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
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "color 0.3s ease",
            padding: "5px 10px",
            backgroundClip: "text",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#5d87b0")}
          onMouseLeave={(e) => (e.target.style.color = "white")}
        >
          {props.children}
        </Link>
      </h2>
    </div>
  );
}
