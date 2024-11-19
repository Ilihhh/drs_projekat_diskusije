import Loading from "../utils/Loading";
import Button from "../utils/Button";
import { useNavigate } from "react-router-dom";
import useUserInfo from "./useUserInfo";

export default function UserInfo() {
  const { userModel, error, loading } = useUserInfo();
  const navigate = useNavigate();
  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Information</h1>
      {userModel ? (
        <div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <strong>Username:</strong> {userModel.username}
            </li>
            <li>
              <strong>First Name:</strong> {userModel.first_name}
            </li>
            <li>
              <strong>Last Name:</strong> {userModel.last_name}
            </li>
            <li>
              <strong>Address:</strong> {userModel.address}
            </li>
            <li>
              <strong>City:</strong> {userModel.city}
            </li>
            <li>
              <strong>Country:</strong> {userModel.country}
            </li>
            <li>
              <strong>Phone Number:</strong> {userModel.phone_number}
            </li>
            <li>
              <strong>Email:</strong> {userModel.email}
            </li>
          </ul>
          <Button
            onClick={() => {
              navigate("/edituser");
            }}
          >
            Edit Profile
          </Button>
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
}
