import React, { useEffect, useRef, useState } from "react";
import Bird from "./Bird";
import Pipe from "./Pipe";
import GameUI from "./GameUI";
import useSound from "./useSound";
import "./App.css";

const GRAVITY     = 0.6;
const JUMP_FORCE  = -10;
const TICK        = 30;
const HOLD_DELAY  = 180; // El truquito"

const App = () => {
  const [bird, setBird]         = useState({ x: 50, y: 200 });
  const [pipes, setPipes]       = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore]       = useState(0);
  const [started, setStarted]   = useState(false);

  const velocityRef         = useRef(0);
  const gameOverSoundPlayed = useRef(false);
  const heldRef             = useRef(false);
  const frozenYRef          = useRef(null);
  const holdTimerRef        = useRef(null);

  const { playJump, playScore, playGameOver, startBgMusic, stopBgMusic } = useSound();

  const jump = () => {
    if (!started) { setStarted(true); startBgMusic(); }
    if (!gameOver) { velocityRef.current = JUMP_FORCE; playJump(); }
    if (gameOver) restart();
  };

  const restart = () => {
    clearTimeout(holdTimerRef.current);
    holdTimerRef.current         = null;
    velocityRef.current          = 0;
    gameOverSoundPlayed.current  = false;
    heldRef.current              = false;
    frozenYRef.current           = null;
    setBird({ x: 50, y: 200 });
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setStarted(true);
    stopBgMusic();
    startBgMusic();
  };

  // Teclado
  useEffect(() => {
    const onDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameOver) { restart(); return; }
        if (e.repeat) return;

        // Salto inmediato
        jump();

        // Timer: si sigue presionado tras HOLD_DELAY congelar
        holdTimerRef.current = setTimeout(() => {
          heldRef.current    = true;
          frozenYRef.current = null; // se captura en el siguiente tick
          velocityRef.current = 0;
        }, HOLD_DELAY);
      }

      if (e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };

    const onUp = (e) => {
      if (e.code === "Space") {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
        const wasFrozen  = heldRef.current;
        heldRef.current  = false;
        frozenYRef.current = null;
        if (wasFrozen) velocityRef.current = 0; // caer desde reposo al soltar
      }
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [started, gameOver]);

  // Física
  useEffect(() => {
    const interval = setInterval(() => {
      if (started && !gameOver) {
        if (heldRef.current) {
          velocityRef.current = 0;
          setBird(prev => {
            if (frozenYRef.current === null) frozenYRef.current = prev.y;
            return { ...prev, y: frozenYRef.current };
          });
        } else {
          velocityRef.current += GRAVITY;
          setBird(prev => ({ ...prev, y: prev.y + velocityRef.current }));
        }
      }
    }, TICK);
    return () => clearInterval(interval);
  }, [started, gameOver]);

  // Generar pipes
  useEffect(() => {
    const interval = setInterval(() => {
      if (started && !gameOver) {
        setPipes(prev => [
          ...prev,
          { x: 400, gap: Math.random() * 200 + 100, scored: false }
        ]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [started, gameOver]);

  // Mover pipes
  useEffect(() => {
    const interval = setInterval(() => {
      if (started && !gameOver) {
        setPipes(prev =>
          prev.filter(p => p.x > -60).map(p => ({ ...p, x: p.x - 5 }))
        );
      }
    }, TICK);
    return () => clearInterval(interval);
  }, [started, gameOver]);

  // Colisiones + score
  useEffect(() => {
    const gapSize = 150;
    pipes.forEach(pipe => {
      const birdLeft   = bird.x;
      const birdRight  = bird.x + 40;
      const birdTop    = bird.y;
      const birdBottom = bird.y + 40;
      const insideX    = birdRight > pipe.x && birdLeft < pipe.x + 60;

      if (insideX && (birdTop < pipe.gap || birdBottom > pipe.gap + gapSize)) {
        if (!gameOverSoundPlayed.current) {
          gameOverSoundPlayed.current = true;
          stopBgMusic();
          playGameOver();
        }
        setGameOver(true);
      }

      if (!pipe.scored && pipe.x + 60 < bird.x) {
        pipe.scored = true;
        setScore(s => s + 1);
        playScore();
      }
    });

    if (bird.y > 500 || bird.y < 0) {
      if (!gameOverSoundPlayed.current) {
        gameOverSoundPlayed.current = true;
        stopBgMusic();
        playGameOver();
      }
      setGameOver(true);
    }
  }, [bird, pipes]);

  return (
    <div
      className={`game${started && !gameOver ? " game--playing" : ""}`}
      onClick={jump}
    >
      <Bird x={bird.x} y={bird.y} />
      {pipes.map((p, i) => (
        <Pipe key={i} x={p.x} gap={p.gap} />
      ))}
      <GameUI gameOver={gameOver} score={score} onRestart={restart} />
    </div>
  );
};

export default App;
