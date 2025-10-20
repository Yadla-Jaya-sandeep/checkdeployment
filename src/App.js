import React, { useState,useEffect } from "react";
import Confetti from "react-confetti";
import Balloon from "./components/Balloon";
import FlipCalendarReal from "./components/FlipCalendarReal";
import { motion } from "framer-motion";
import { Box, Typography, Button } from "@mui/material";
import friendImage from "./assets/person.jpg";
import { gardenImage, fallingPetalImages } from "./assets/gardenImages";
 
const balloonCelebrations = [
  { message: "You are amazing!", emoji: "💖" },
  { message: "Wishing you joy!", emoji: "🎉" },
  { message: "Stay blessed!", emoji: "🙏" },
  { message: "You are loved!", emoji: "❤️" },
  { message: "Keep smiling!", emoji: "😊" },
  { message: "Shine bright!", emoji: "✨" },
  { message: "So caring!", emoji: "🤗" },
  { message: "You are special!", emoji: "🌹" },
  { message: "Dream big!", emoji: "🌟" },
  { message: "Hugs!", emoji: "🤍" },
];

function App() {
  const girlfriendAge = 3;
  const birthdayMonthIndex = 9;
  const birthdayDate = 23;

  const [blastedCount, setBlastedCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [balloonsBlasted, setBalloonsBlasted] = useState({});

  // Removed confettiPieces/confettiCoords state (no longer needed)
  const [balloonCelebration, setBalloonCelebration] = useState(null); // { message, emoji, x, y }

  function handleBlast(id, coords) {
    if (balloonsBlasted[id]) return;
    setBalloonsBlasted((prev) => ({ ...prev, [id]: true }));
    setBlastedCount((c) => c + 1);
  setShowConfetti(false); // reset in case it's still running
  setConfettiKey((k) => k + 1); // change key to force remount
  setTimeout(() => setShowConfetti(true), 10); // ensure re-trigger
  setTimeout(() => setShowConfetti(false), 8010); // always 8s
    // Show unique celebration for this balloon
    const celebration = balloonCelebrations[id % balloonCelebrations.length];
    const x = coords ? coords.x : window.innerWidth / 2;
    const y = coords ? coords.y : window.innerHeight / 2;
    setBalloonCelebration({ ...celebration, x, y });
    setTimeout(() => setBalloonCelebration(null), 1400);
  }

  function reset() {
    setBlastedCount(0);
    setBalloonsBlasted({});
    setShowConfetti(false);
  }

  // Garden and transparent girlfriend image background
  React.useEffect(() => {
    const gardenBgId = 'garden-bg-img';
    const gfBgId = 'transparent-bg-img';
    let gardenBg = document.getElementById(gardenBgId);
    let gfBg = document.getElementById(gfBgId);
    if (!gardenBg) {
      gardenBg = document.createElement('div');
      gardenBg.id = gardenBgId;
      Object.assign(gardenBg.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -300,
        pointerEvents: 'none',
        backgroundImage: `url(${gardenImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: 1,
      });
      document.body.appendChild(gardenBg);
    }
    if (!gfBg) {
      gfBg = document.createElement('div');
      gfBg.id = gfBgId;
      Object.assign(gfBg.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -200,
        pointerEvents: 'none',
        backgroundImage: `url(${friendImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: 0.5,
      });
      document.body.appendChild(gfBg);
    }
    return () => {
      if (gardenBg) document.body.removeChild(gardenBg);
      if (gfBg) document.body.removeChild(gfBg);
    };
  }, []);

  // Falling rose petal animation (confetti-like, with variety and natural flipping)
  function FallingPetals() {
  const petalCount = 200;
    const petals = Array.from({ length: petalCount }).map((_, i) => {
      const left = Math.random() * 100; // percent
      const size = 20 + Math.random() * 40; // px
      const duration = 7 + Math.random() * 6; // seconds (slower, longer)
      const delay = Math.random() * 7; // seconds
      const rotate = Math.random() * 360;
      const opacity = 0.6 + Math.random() * 0.4;
      const blur = Math.random() > 0.8 ? 'blur(2px)' : 'none';
      const flip = Math.random() > 0.5 ? 'scaleX(-1)' : 'scaleX(1)';
      const petalImg = fallingPetalImages[Math.floor(Math.random() * fallingPetalImages.length)];
      // Each petal gets a unique animation name for random flipping and swaying
      const animName = `fall-petal-${i}`;
      const sway = Math.random() * 40 + 10; // px
      // Randomize initial top position so some petals start lower
      const initialTop = -size - Math.random() * 400; // px, some petals start further down
      return (
        <React.Fragment key={i}>
          <img
            src={petalImg}
            alt="petal"
            style={{
              position: 'fixed',
              top: `${initialTop}px`,
              left: `${left}%`,
              width: `${size}px`,
              height: 'auto',
              zIndex: 0,
              opacity,
              filter: blur,
              pointerEvents: 'none',
              animation: `${animName} ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              transform: `${flip} rotate(${rotate}deg)`
            }}
          />
          <style>{`
            @keyframes ${animName} {
              0% { transform: ${flip} rotate(${rotate}deg) translateY(0) scale(1); }
              20% { transform: ${flip} rotate(${rotate + 60}deg) translateY(20vh) translateX(-${sway}px) scale(1.1); }
              50% { opacity: 1; transform: ${flip} rotate(${rotate + 120}deg) translateY(50vh) translateX(${sway}px) scale(0.95); }
              80% { transform: ${flip} rotate(${rotate + 240}deg) translateY(80vh) translateX(-${sway}px) scale(1.05); }
              100% { transform: ${flip} rotate(${rotate + 360}deg) translateY(100vh) scale(0.8); opacity: 0; }
            }
          `}</style>
        </React.Fragment>
      );
    });
    return <>{petals}</>;
  }

  return (
    <>
    {/* Removed per-balloon confetti burst for consistency */}
    {/* Per-balloon celebration popup */}
    {balloonCelebration && (
      <div
        style={{
          position: 'fixed',
          left: balloonCelebration.x - 90,
          top: balloonCelebration.y - 100,
          width: 180,
          height: 180,
          zIndex: 9999,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pop-celebrate 1.2s cubic-bezier(.17,.67,.83,.67)',
        }}
      >
        {/* Sparkles */}
        {[...Array(7)].map((_, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: 80 + 60 * Math.cos((i / 7) * 2 * Math.PI),
              top: 80 + 60 * Math.sin((i / 7) * 2 * Math.PI),
              fontSize: 22 + (i % 2) * 8,
              color: '#ffd700',
              opacity: 0.85,
              filter: 'drop-shadow(0 0 8px #fff8e1)',
              animation: `sparkle-pop 1.1s ${0.1 * i}s ease-out`,
              pointerEvents: 'none',
            }}
          >
            ✨
          </span>
        ))}
        {/* Floating hearts */}
        {[...Array(3)].map((_, i) => (
          <span
            key={100 + i}
            style={{
              position: 'absolute',
              left: 60 + i * 30,
              top: 120 + i * 10,
              fontSize: 24,
              color: '#e91e63',
              opacity: 0.7,
              animation: `float-heart 1.2s ${0.2 * i}s ease-in`,
              pointerEvents: 'none',
            }}
          >
            💗
          </span>
        ))}
        {/* Emoji with bounce-in */}
        <span style={{
          fontSize: 60,
          filter: 'drop-shadow(0 2px 12px #fff)',
          animation: 'emoji-bounce 1.1s cubic-bezier(.17,.67,.83,.67)',
          zIndex: 2,
        }}>{balloonCelebration.emoji}</span>
        {/* Message with float/scale animation */}
        <span style={{
          fontSize: 22,
          color: '#c2185b',
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 14,
          padding: '8px 20px',
          marginTop: 10,
          fontWeight: 700,
          boxShadow: '0 2px 12px #e1bee7',
          animation: 'msg-float 1.1s cubic-bezier(.17,.67,.83,.67)',
          zIndex: 2,
        }}>{balloonCelebration.message}</span>
        <style>{`
          @keyframes pop-celebrate {
            0% { opacity: 0; transform: scale(0.7); }
            30% { opacity: 1; transform: scale(1.1); }
            60% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.7); }
          }
          @keyframes sparkle-pop {
            0% { opacity: 0; transform: scale(0.2) rotate(-30deg); }
            40% { opacity: 1; transform: scale(1.2) rotate(10deg); }
            80% { opacity: 0.9; transform: scale(1) rotate(0deg); }
            100% { opacity: 0; transform: scale(0.7) rotate(0deg); }
          }
          @keyframes float-heart {
            0% { opacity: 0; transform: translateY(0) scale(0.7); }
            30% { opacity: 0.7; transform: translateY(-20px) scale(1.1); }
            60% { opacity: 0.7; transform: translateY(-40px) scale(1); }
            100% { opacity: 0; transform: translateY(-60px) scale(0.7); }
          }
          @keyframes emoji-bounce {
            0% { opacity: 0; transform: scale(0.2) translateY(40px); }
            40% { opacity: 1; transform: scale(1.2) translateY(-10px); }
            70% { opacity: 1; transform: scale(1) translateY(0); }
            100% { opacity: 0; transform: scale(0.7) translateY(20px); }
          }
          @keyframes msg-float {
            0% { opacity: 0; transform: scale(0.7) translateY(20px); }
            40% { opacity: 1; transform: scale(1.1) translateY(-5px); }
            70% { opacity: 1; transform: scale(1) translateY(0); }
            100% { opacity: 0; transform: scale(0.7) translateY(20px); }
          }
        `}</style>
      </div>
    )}
    {showConfetti && (
      <Confetti
        key={confettiKey}
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={2000}
        recycle={false}
      />
    )}
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: 'linear-gradient(135deg, #fce4ec, #f3e5f5)',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        gap: 5,
        position: 'relative',
        zIndex: 1,
      }}
    >
  <FallingPetals />
      {showConfetti && <Confetti recycle={false} numberOfPieces={50} />}
 
      <Typography variant="h3" color="#0e8845ff" sx={{ fontWeight: "bold" }}>
        🎉 Surprise Birthday Celebration! 🎉
      </Typography>
 
      {blastedCount < girlfriendAge ? (
        <Typography variant="h6" color="#4a148c" textAlign="center" sx={{ maxWidth: 400 }}>
          Click each balloon to celebrate! 🎈
        </Typography>
      ) : (
        <Typography variant="h4" color="#880e4f" sx={{ fontWeight: "bold", textAlign: "center" }}>
          All balloons blasted! Special wishes just for you ❤️
        </Typography>
      )}
 
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, position: 'relative', minHeight: 180 }}>
        {Array.from({ length: girlfriendAge }).map((_, i) =>
          !balloonsBlasted[i] ? (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                width: 56,
                height: 180,
                position: 'relative',
                animation: `balloon-float 3.5s ${0.2 * i}s ease-in-out infinite`,
                zIndex: 2,
              }}
            >
              <Balloon id={i} onBlast={handleBlast} />
              <style>{`
                @keyframes balloon-float {
                  0% { transform: translateY(0) translateX(0) scale(1); }
                  20% { transform: translateY(-10px) translateX(-8px) scale(1.04); }
                  40% { transform: translateY(-22px) translateX(8px) scale(1.07); }
                  60% { transform: translateY(-32px) translateX(-6px) scale(1.04); }
                  80% { transform: translateY(-40px) translateX(6px) scale(1.01); }
                  100% { transform: translateY(0) translateX(0) scale(1); }
                }
              `}</style>
            </div>
          ) : (
            <Box key={i} sx={{ width: 56 }} /> // empty space to keep layout
          )
        )}
      </Box>
 
      {blastedCount === girlfriendAge && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ textAlign: "center", marginTop: 24 }}
        >
          <Typography variant="h5" color="#880e4f" sx={{ mt: 2 }}>
            Happy Birthday, My Favourite Human! 💖
          </Typography>
          <FlipCalendarReal birthdayMonthIndex={birthdayMonthIndex} birthdayDate={birthdayDate} />
          <Button
            variant="contained"
            color="secondary"
            onClick={reset}
            sx={{ mt: 3 }}
          >
            Celebrate Again
          </Button>
        </motion.div>
      )}
    </Box>
    </>
  );
}
 
export default App;