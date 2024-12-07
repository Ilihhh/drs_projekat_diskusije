import { useContext, useState } from "react";
import RegisterEditForm from "../forms/RegisterEditForm";
import { useNavigate } from "react-router-dom";
import useUserInfo from "./useUserInfo";
import Loading from "../utils/Loading";
import { urlUserEdit } from "../utils/endpoints";
import axios from "axios";
import { getClaims, saveToken } from "../auth/handleJWT";
import AuthenticationContext from "../auth/AuthenticationContext";
import BlackSwal from "../utils/BlackSwal";

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
      BlackSwal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Please wait for admin approval before logging in!",
        confirmButtonText: "Go to Home",
      }).then(() => {
        navigate("/userinfo"); // Redirektovanje na profil
      }
      )
    } catch (err) {
      BlackSwal.fire({
        icon: "error",
        title: "Update User Failed",
        text: "Email Adress or Username already in use.",
      });
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
