import { useContext, useState } from "react";
import RegisterEditForm from "../forms/RegisterEditForm";
import { useNavigate } from "react-router-dom";
import useUserInfo from "./useUserInfo";
import Loading from "../utils/Loading";
import { urlUserEdit } from "../utils/endpoints";
import axios from "axios";
import { getClaims, saveToken } from "../auth/handleJWT";
import AuthenticationContext from "../auth/AuthenticationContext";

export default function EditUser() {
  const { userModel, loading, error } = useUserInfo(); // Koristimo useUserInfo hook
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { update } = useContext(AuthenticationContext);
  if (loading || isLoading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  // Funkcija za editovanje korisničkih podataka
  async function edit(values) {
    setIsLoading(true);
    try {
      const response = await axios.put(`${urlUserEdit}`, values);
      saveToken(response.data);
      update(getClaims());
      navigate("/userinfo"); // Redirektovanje na profil
    } catch (err) {
      console.error("Error updating user: ", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {userModel && (
        <>
          <RegisterEditForm
            edit={true}
            model={userModel} // Popunjavamo formu sa korisničkim podacima
            onSubmit={async (values) => await edit(values)} // Ažuriranje podataka
          />
        </>
      )}
    </>
  );
}
