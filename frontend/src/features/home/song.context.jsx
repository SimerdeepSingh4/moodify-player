import { createContext, useState } from "react";
export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
    const [song, setSong] = useState({
        "url": "https://ik.imagekit.io/dhyh95euj/moodify/songs/Sitaare___Ikkis___Agastya_Nanda__Simar_Bhatia__Dharmendra_Deol__Jaideep_A___Arijit_Singh__Amitabh_B_TItKJFqMg.mp3",
        "posterUrl": "https://ik.imagekit.io/dhyh95euj/moodify/posters/Sitaare___Ikkis___Agastya_Nanda__Simar_Bhatia__Dharmendra_Deol__Jaideep_A___Arijit_Singh__Amitabh_B_lvhI9FExR.jpeg",
        "title": "Sitaare | Ikkis | Agastya Nanda, Simar Bhatia, Dharmendra Deol, Jaideep A | Arijit Singh, Amitabh B",
        "mood": "happy",
    })

    const [loading, setLoading] = useState(false)

    return (
        <SongContext.Provider value = {{loading, setLoading, song, setSong}}>
            {children}
        </SongContext.Provider>
    )


}