import axios from "axios";
import { useEffect, useState } from "react";
import { urlUserInfo } from "../utils/endpoints";

export default function useUserInfo() {
    const [userModel, setUserModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Funkcija za dohvat korisničkih informacija
    async function fetchUserInfo() {
        try {
            const response = await axios.get(urlUserInfo); // Endpoint za korisničke informacije
            setUserModel({
                id: response.data.id,
                username: response.data.username || "",
                first_name: response.data.first_name || "",
                last_name: response.data.last_name || "",
                address: response.data.address || "",
                city: response.data.city || "",
                country: response.data.country || "",
                phone_number: response.data.phone_number || "",
                email: response.data.email || "",
                password: "", // Ostavite prazno jer ne želite da prikazujete lozinku
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);



    return {userModel, loading, error}
}