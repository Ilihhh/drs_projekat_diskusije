import { useState, useEffect } from "react";
import axios from "axios";
import { urlTopics } from "../utils/endpoints";

function DiscussionForm() {
    const [topics, setTopics] = useState([]); // Držimo listu tema
    const [selectedTopic, setSelectedTopic] = useState(""); // Za čuvanje odabrane teme
    const [selectedTopicDescription, setSelectedTopicDescription] = useState(""); // Opis odabrane teme
    const [discussionText, setDiscussionText] = useState(""); // Tekst diskusije
  
    useEffect(() => {
        // Poziv za preuzimanje tema sa servera
        axios.get(urlTopics)
            .then(response => {
                setTopics(response.data); 
            })
            .catch(error => {
                console.error("There was an error fetching topics!", error);
            });
    }, []);
  
    useEffect(() => {
        console.log("Updated Topic Description:", selectedTopicDescription);
    }, [selectedTopicDescription]);  // Praćenje promene selectedTopicDescription
  
    const handleTopicChange = (event) => {
        const selectedId = event.target.value;
        console.log(selectedId);
        setSelectedTopic(selectedId);
  
        // Pronalazimo temu sa odgovarajućim ID-em i postavljamo njen opis
        const selectedTopic = topics.find(topic => topic.id === selectedId);
        //console.log("izes", selectedTopic.description);
        if (selectedTopic) {
            setSelectedTopicDescription(selectedTopic.description); // Postavljamo opis teme
            console.log("Selected Topic Description inside handleTopicChange:", selectedTopic.description); // Logovanje opisa odmah
        }
    };
  
    const handleDiscussionTextChange = (event) => {
        setDiscussionText(event.target.value);  // Ažuriramo tekst diskusije
    };
  
    const handleSubmit = () => {
        // Na kraju šaljemo podatke diskusije zajedno sa izabranom temom
        axios.post("/api/discussions", {
            title: "Discussion Title",
            text: discussionText,
            topic_id: selectedTopic,  // ID odabrane teme
        })
        .then(response => {
            console.log("Discussion created:", response.data);
        })
        .catch(error => {
            console.error("Error creating discussion:", error);
        });
    };
  
    return (
        <div>
            <h2>Create a Discussion</h2>
            
            <select 
                value={selectedTopic} 
                onChange={handleTopicChange} 
                className="form-control"
            >
                <option value="">Select a topic</option>
                {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>
                        {topic.name}
                    </option>
                ))}
            </select>
    
            {/* Prikazujemo opis teme kada je odabrana */}
            {selectedTopicDescription && (
                <div className="mt-3">
                    <h5>Topic Description:</h5>
                    <p>{selectedTopicDescription}</p>                  
                </div>
            )}
    
            {/* Polje za unos teksta diskusije */}
            <div className="mt-3">
                <label htmlFor="discussionText">Discussion Text:</label>
                <textarea
                    id="discussionText"
                    className="form-control"
                    value={discussionText}
                    onChange={handleDiscussionTextChange}
                    rows="5"
                />
            </div>
    
            {/* Dugme za kreiranje diskusije */}
            <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                Create Discussion
            </button>
        </div>
    );
}
  
export default DiscussionForm;
