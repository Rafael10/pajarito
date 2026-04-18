import React, { useEffect, useState } from "react";

const GameUI = ({ gameOver, score, onRestart }) => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = parseInt(localStorage.getItem("highScore")) || 0;
    setHighScore(saved);
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score);
    }
  }, [score, highScore]);

  return (
    <>
      {/* HUD */}
      <div style={styles.hud}>
        <span>🏆 {highScore}</span>
        <span>⭐ {score}</span>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div style={styles.overlay}>
          <div style={styles.box}>
            <div style={styles.title}>🙄 GAME OVER</div>

            <div style={styles.scoreRow}>
              <div style={styles.scoreCard}>
                <span style={styles.scoreLabel}>PUNTUACIÓN</span>
                <span style={styles.scoreValue}>{score}</span>
              </div>
              <div style={styles.divider} />
              <div style={styles.scoreCard}>
                <span style={styles.scoreLabel}>RÉCORD</span>
                <span style={styles.scoreValue}>
                  {score >= highScore && score > 0 ? "🔥 " : ""}{highScore}
                </span>
              </div>
            </div>

            {score >= highScore && score > 0 && (
              <div style={styles.newRecord}>¡Nuevo récord!</div>
            )}

            <button onClick={onRestart} style={styles.button}>
              🔄 Reiniciar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  hud: {
    position: "absolute",
    top: 10,
    right: 12,
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    display: "flex",
    gap: "12px",
    textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
  },
  overlay: {
    position: "absolute",
    top: 0, left: 0,
    width: "100%", height: "100%",
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  box: {
    background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
    border: "2px solid #e94560",
    borderRadius: "16px",
    padding: "28px 32px",
    textAlign: "center",
    boxShadow: "0 0 30px rgba(233,69,96,0.4), 0 8px 32px rgba(0,0,0,0.6)",
    minWidth: "240px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#e94560",
    letterSpacing: "3px",
    marginBottom: "20px",
    textShadow: "0 0 12px rgba(233,69,96,0.7)",
  },
  scoreRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
  },
  scoreCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  scoreLabel: {
    fontSize: "10px",
    letterSpacing: "2px",
    color: "#a0a0c0",
  },
  scoreValue: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#ffffff",
  },
  divider: {
    width: "1px",
    height: "50px",
    background: "#e94560",
    opacity: 0.4,
  },
  newRecord: {
    fontSize: "13px",
    color: "#f5a623",
    fontWeight: "bold",
    letterSpacing: "1px",
    marginBottom: "12px",
    textShadow: "0 0 8px rgba(245,166,35,0.6)",
  },
  button: {
    marginTop: "8px",
    padding: "10px 28px",
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "1px",
    cursor: "pointer",
    border: "2px solid #e94560",
    borderRadius: "8px",
    background: "transparent",
    color: "#e94560",
    transition: "all 0.2s",
  },
};

export default GameUI;
