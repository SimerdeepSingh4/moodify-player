import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import { useSong } from "../../home/hooks/useSong";
import "./style/face-expression.scss";

const expressionToMoodMap = {
    Happy: "happy",
    Sad: "sad",
    Surprised: "happy",
    Neutral: "happy",
};

export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);

    const [expression, setExpression] = useState("Detecting...");
    const [cameraError, setCameraError] = useState("");
    const [cameraReady, setCameraReady] = useState(false);
    const [lastMood, setLastMood] = useState("Neutral");

    const { handleRandomMoodSong, loading } = useSong();

    useEffect(() => {
        const setup = async () => {
            try {
                await init({ landmarkerRef, videoRef, streamRef });
                setCameraReady(true);
            } catch (error) {
                
            }
        };
        setup();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    const handleDetect = async () => {
        const currentExpression = detect({ landmarkerRef, videoRef, setExpression });
        if (!currentExpression) return;

        const mappedMood = expressionToMoodMap[currentExpression] || "happy";
        setLastMood(mappedMood);
        await handleRandomMoodSong({ mood: mappedMood });
    };

    return (
        <section className="expression-card">
            <div className="expression-header">
                <p className="eyebrow">Mood Detection</p>

                <h2>Record expression and fetch matching songs</h2>
            </div>

            <video
                ref={videoRef}
                className="expression-video"
                playsInline
                muted
            />

            <div className="expression-status">
                <span className="label">Expression</span>
                <strong>{expression}</strong>
            </div>

            {lastMood && (
                <p className="mood-result">
                    Mood matched: <span>{lastMood}</span>
                </p>
            )}

            {cameraError && <p className="error-text">{cameraError}</p>}

            <button
                className="detect-button"
                onClick={handleDetect}
                disabled={!cameraReady || loading}
            >
                {loading ? "Loading songs..." : "Record & Detect Mood"}
            </button>
        </section>
    );
}
