// GregorianPlayer.tsx
import { useEffect, useRef, useState } from "react";
import { Button, Toast } from "react-bootstrap";
import { SkipForward, Pause, Play } from "lucide-react";

const tracks = [
  "/gregorian1.mp3",
  "/gregorian2.mp3",
  "/gregorian3.mp3"
];

export default function GregorianPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setShowNotice(false);
      } catch (err) {
        console.warn("Autoplay bloqueado. Aguardando clique do usuário.");
      }
    };

    const handleUserInteraction = () => {
      tryPlay();
      window.removeEventListener("click", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, trackIndex]);

  const skipTrack = () => {
    setTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  return (
    <div className="my-3 text-center position-relative">
      <Toast
        show={showNotice}
        onClose={() => setShowNotice(false)}
        delay={6000}
        autohide
        style={{ position: "absolute", top: 0, right: 0, backgroundColor: "#0d6efd", color: "white" }}
      >
        <Toast.Body style={{ fontSize: "0.9rem" }}>Clique na página para iniciar o canto gregoriano.</Toast.Body>
      </Toast>

      <div className="d-flex align-items-center justify-content-center gap-2 rounded bg-light p-2 shadow-sm">
        <Button variant="primary" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button variant="secondary" onClick={skipTrack}>
          <SkipForward size={20} />
        </Button>
      </div>

      <audio
        ref={audioRef}
        src={tracks[trackIndex]}
        loop
        preload="auto"
        style={{ display: "none" }}
      >
        <track kind="captions" srcLang="en" label="Gregorian Chant" src="" />
      </audio>
    </div>
  );
}
