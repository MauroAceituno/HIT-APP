import { useEffect, useRef, useState } from "react";

const App = () => {
  const [phase, setPhase] = useState("idle"); // idle | hit | rest
  const [time, setTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(5); // minutos elegidos
  const intervalRef = useRef(null);
  const totalIntervalRef = useRef(null);

  // Timer de fase (HIT / REST)
  useEffect(() => {
    if (phase === "idle") return;

    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 10);
    }, 10);

    return () => clearInterval(intervalRef.current);
  }, [phase]);

  // Timer total
  useEffect(() => {
    if (phase === "idle") return;

    totalIntervalRef.current = setInterval(() => {
      setTotalTime((prev) => prev + 10);
    }, 10);

    return () => clearInterval(totalIntervalRef.current);
  }, [phase]);

  // Cambio de fase cada 1 min
  useEffect(() => {
    if (phase === "idle") return;
    if (time >= 60000) {
      setTime(0);
      setPhase((prev) => (prev === "hit" ? "rest" : "hit"));
    }
  }, [time, phase]);

  // Detener cuando llega al total seleccionado
  useEffect(() => {
    const totalMs = selectedMinutes * 60000;
    if (totalTime >= totalMs && phase !== "idle") {
      handleStop();
    }
  }, [totalTime]);

  const handleStart = () => {
    setPhase("hit");
    setTime(0);
    setTotalTime(0);
  };

  const handleStop = () => {
    setPhase("idle");
    setTime(0);
    clearInterval(intervalRef.current);
    clearInterval(totalIntervalRef.current);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${minutes}:${seconds}:${centiseconds}`;
  };

  const getBackground = () => {
    if (phase === "hit") return "#00b894";
    if (phase === "rest") return "#636e72";
    return "#111";
  };

  const progress = (totalTime / (selectedMinutes * 60000)) * 100;

  return (
    <div
      style={{
        backgroundColor: getBackground(),
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        height: "100vh",
        width: "100vw",
        fontFamily: "sans-serif",
        transition: "background-color 0.5s ease",
        userSelect: "none",
      }}
    >
      <style>{`
        .no-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
      `}</style>

      {phase === "idle" ? (
        <>
          <h2>Selecciona duración (minutos)</h2>
          <div
            className="no-scrollbar"
            style={{
              width: "80%",
              height: "250px",
              overflowY: "auto",
              textAlign: "center",
              border: "1px solid #00cec9",
              borderRadius: "10px",
              scrollSnapType: "y mandatory",
            }}
          >
            {[...Array(60).keys()].map((n) => (
              <div
                key={n}
                onClick={() => setSelectedMinutes(n + 1)}
                style={{
                  scrollSnapAlign: "center",
                  padding: "8px 0",
                  fontSize: "1.5rem",
                  color: selectedMinutes === n + 1 ? "#00cec9" : "#fff",
                  cursor: "pointer",
                  backgroundColor:
                    selectedMinutes === n + 1 ? "#fff" : "#00cec9",
                }}
              >
                {n + 1}
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            style={{
              marginTop: "2rem",
              padding: "1rem 2rem",
              background: "#00cec9",
              color: "#111",
              border: "none",
              borderRadius: "10px",
              fontSize: "1.2rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            INICIAR {selectedMinutes}{" "}
            {selectedMinutes === 1 ? "MINUTO" : "MINUTOS"}
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: "2rem", opacity: 0.8 }}>
            Total: {formatTime(totalTime)}
          </div>
          <div style={{ fontSize: "3rem" }}>
            {phase === "hit" ? "🏋️‍♂️ HIT" : "🧘 DESCANSO"}
          </div>
          <div style={{ fontSize: "2rem" }}>{formatTime(time)}</div>

          {/* Barra de progreso */}
          <div
            style={{
              position: "relative",
              width: "80%",
              height: "20px",
              background: "#2d3436",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#00cec9",
                transition: "width 0.1s linear",
              }}
            />
          </div>

          <button
            onClick={handleStop}
            style={{
              marginTop: "2rem",
              padding: "1rem 2rem",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "1.2rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            STOP
          </button>
        </>
      )}
    </div>
  );
};

export default App;
