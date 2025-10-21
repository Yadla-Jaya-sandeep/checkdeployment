import React, { useState } from "react";
import Confetti from "react-confetti";
import Balloon from "./components/Balloon";
import FlipCalendarReal from "./components/FlipCalendarReal";
// import { motion } from "framer-motion";
import { Box, Typography, Button } from "@mui/material";
import friendImage from "./assets/person.jpg";
import { fallingPetalImages } from "./assets/gardenImages";

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
  { message: "Brave and bold!", emoji: "🦁" },
  { message: "Keep being kind!", emoji: "🌼" },
  { message: "You’ve got this!", emoji: "💪" },
  { message: "Stay curious!", emoji: "🔭" },
  { message: "Smile more!", emoji: "😊" },
  { message: "Keep learning!", emoji: "📚" },
  { message: "Radiate love!", emoji: "💞" },
  { message: "Be unstoppable!", emoji: "🚀" },
  { message: "Cherish every moment!", emoji: "⏳" },
  { message: "You inspire me!", emoji: "✨" },
  { message: "Kind heart wins!", emoji: "💛" },
  { message: "Magic within you!", emoji: "🪄" },
  { message: "Keep the faith!", emoji: "🕊️" },
  { message: "Live fearlessly!", emoji: "🔥" },
  { message: "Celebrate you!", emoji: "🥳" },
  { message: "Always be you!", emoji: "🌈" },
  { message: "Love yourself first!", emoji: "💗" },
];

function App() {
  // Track confetti timeout to clear on fast blasts
  const confettiTimeoutRef = React.useRef();
  const accessYear = 1997;
  const currentYear = new Date().getFullYear();
  const birthdayMonthIndex = 9;
  const birthdayDate = 23;

  const [blastedCount, setBlastedCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [balloonsBlasted, setBalloonsBlasted] = useState({});
  const [balloonCelebration, setBalloonCelebration] = useState(null); // { message, emoji, x, y }

  // New: state for date input and validation
  const [dateInput, setDateInput] = useState("");
  const [dateValid, setDateValid] = useState(false);
  const [dateError, setDateError] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(0);

  const friendAge = dateInput ? currentYear - accessYear : 0;
  

  function handleDateChange(e) {
    setDateInput(e.target.value);
    setDateError("");
  }

  function handleDateSubmit(e) {
    e.preventDefault();
    // Acceptable: 1997-10-23 only
    if (!dateInput) {
      setDateError("Please enter your birthday to start the fun! 🎉");
      setDateValid(false);
      return;
    }
    const d = new Date(dateInput);
    if (
      d instanceof Date &&
      !isNaN(d) &&
      d.getDate() === 23 &&
      d.getMonth() === 9 && // October is 9 (0-based)
      d.getFullYear() === 1997
    ) {
      setDateValid(true);
      setDateError("");
    } else {
      setDateError(
        "Nice try! Enter your real birthday to unlock the celebration. 😜🎈"
      );
      setDateValid(false);
    }
  }

  function handleBlast(id, coords) {
    if (balloonsBlasted[id]) return;
    setBalloonsBlasted((prev) => ({ ...prev, [id]: true }));
    setBlastedCount((c) => c + 1);
    setShowConfetti(false); // reset in case it's still running
    setConfettiKey((k) => k + 1); // change key to force remount
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
    }
    setTimeout(() => {
      setShowConfetti(true);
      confettiTimeoutRef.current = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }, 10);
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
    setDateInput("");
    setDateValid(false);
    setDateError("");
  }

  // Garden and transparent friend image background
  React.useEffect(() => {
    const gardenBgId = "garden-bg-img";
    const gfBgId = "transparent-bg-img";
    let gardenBg = document.getElementById(gardenBgId);
    let gfBg = document.getElementById(gfBgId);

    if (!gfBg) {
      gfBg = document.createElement("div");
      gfBg.id = gfBgId;
      Object.assign(gfBg.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -200,
        pointerEvents: "none",
        backgroundImage: `url(${friendImage})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        opacity: 0.25,
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
      const blur = Math.random() > 0.8 ? "blur(2px)" : "none";
      const flip = Math.random() > 0.5 ? "scaleX(-1)" : "scaleX(1)";
      const petalImg =
        fallingPetalImages[
          Math.floor(Math.random() * fallingPetalImages.length)
        ];
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
              position: "fixed",
              top: `${initialTop}px`,
              left: `${left}%`,
              width: `${size}px`,
              height: "auto",
              zIndex: 0,
              opacity,
              filter: blur,
              pointerEvents: "none",
              animation: `${animName} ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              transform: `${flip} rotate(${rotate}deg)`,
            }}
          />
          <style>{`
            @keyframes ${animName} {
              0% { transform: ${flip} rotate(${rotate}deg) translateY(0) scale(1); }
              20% { transform: ${flip} rotate(${
            rotate + 60
          }deg) translateY(20vh) translateX(-${sway}px) scale(1.1); }
              50% { opacity: 1; transform: ${flip} rotate(${
            rotate + 120
          }deg) translateY(50vh) translateX(${sway}px) scale(0.95); }
              80% { transform: ${flip} rotate(${
            rotate + 240
          }deg) translateY(80vh) translateX(-${sway}px) scale(1.05); }
              100% { transform: ${flip} rotate(${
            rotate + 360
          }deg) translateY(100vh) scale(0.8); opacity: 0; }
            }
          `}</style>
        </React.Fragment>
      );
    });
    return <>{petals}</>;
  }

  return (
    <>
      {/* Date input and validation UI */}
      {!dateValid && (
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "linear-gradient(135deg, #fce4ec, #f3e5f5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // p: 3,
            gap: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          <FallingPetals />
          <Typography
            variant="h4"
            color="#880e4f"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Enter Your DOB 🎉
          </Typography>
          <form
            onSubmit={handleDateSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <input
              type="date"
              value={dateInput}
              onChange={handleDateChange}
              style={{
                fontSize: 18,
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #c2185b",
                marginBottom: 8,
              }}
              required
            />
            <Button type="submit" variant="contained" color="secondary">
              Submit
            </Button>
          </form>
          {dateError && (
            <Box
              sx={{
                mt: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                background: "linear-gradient(90deg,#fffde4,#ffe0b2 80%)",
                boxShadow: "0 2px 8px #ffe0b2",
                animation: "shake 0.5s, bounceIn 0.7s",
                fontSize: 18,
                position: "relative",
              }}
            >
              <span style={{ fontSize: 28, marginRight: 8 }}>🎂</span>
              <Typography
                component="span"
                sx={{ fontWeight: 700, color: "#e91e63", fontSize: 18 }}
              >
                Ni Birthday niku gurthu ledha?:
              </Typography>
              <Typography
                component="span"
                sx={{ color: "#e91e63", fontWeight: 600, mx: 1 }}
              >
                Access Denied!
              </Typography>
              <span style={{ fontSize: 22, margin: "0 8px" }}>🚫</span>
              <Typography
                component="span"
                sx={{
                  fontSize: 17,
                  color: "#6d4c41",
                  background: "#ffe0b2",
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  fontWeight: 500,
                }}
              >
                Tester Thelivi Thetalu voddhu developer laga ni DOB enter chaye 😜🎈
              </Typography>
              <style>
                {`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.7); }
          60% { opacity: 1; transform: scale(1.1); }
          80% { transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}
              </style>
            </Box>
          )}
        </Box>
      )}

      {/* Celebration UI only if date is valid */}
      {dateValid && (
        <>
          {/* Removed per-balloon confetti burst for consistency */}
          {/* Per-balloon celebration popup */}
          {balloonCelebration && (
            <div
              style={{
                position: "fixed",
                left: balloonCelebration.x - 90,
                top: balloonCelebration.y - 100,
                width: 180,
                height: 180,
                zIndex: 9999,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                animation: "pop-celebrate 1.2s cubic-bezier(.17,.67,.83,.67)",
              }}
            >
              {/* Sparkles */}
              {[...Array(7)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    left: 80 + 60 * Math.cos((i / 7) * 2 * Math.PI),
                    top: 80 + 60 * Math.sin((i / 7) * 2 * Math.PI),
                    fontSize: 22 + (i % 2) * 8,
                    color: "#ffd700",
                    opacity: 0.85,
                    filter: "drop-shadow(0 0 8px #fff8e1)",
                    animation: `sparkle-pop 1.1s ${0.1 * i}s ease-out`,
                    pointerEvents: "none",
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
                    position: "absolute",
                    left: 60 + i * 30,
                    top: 120 + i * 10,
                    fontSize: 24,
                    color: "#e91e63",
                    opacity: 0.7,
                    animation: `float-heart 1.2s ${0.2 * i}s ease-in`,
                    pointerEvents: "none",
                  }}
                >
                  💗
                </span>
              ))}
              {/* Emoji with bounce-in */}
              <span
                style={{
                  fontSize: 60,
                  filter: "drop-shadow(0 2px 12px #fff)",
                  animation: "emoji-bounce 1.1s cubic-bezier(.17,.67,.83,.67)",
                  zIndex: 2,
                }}
              >
                {balloonCelebration.emoji}
              </span>
              {/* Message with float/scale animation */}
              <span
                style={{
                  fontSize: 22,
                  color: "#c2185b",
                  background: "rgba(255,255,255,0.97)",
                  borderRadius: 14,
                  padding: "8px 20px",
                  marginTop: 10,
                  fontWeight: 700,
                  boxShadow: "0 2px 12px #e1bee7",
                  animation: "msg-float 1.1s cubic-bezier(.17,.67,.83,.67)",
                  zIndex: 2,
                }}
              >
                {balloonCelebration.message}
              </span>
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
              numberOfPieces={4000}
              recycle={false}
            />
          )}
          <Box
            sx={{
              minHeight: "auto", // remove forced height
              bgcolor: "linear-gradient(135deg, #fce4ec, #f3e5f5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start", // start from top
              p: 3,
              gap: 2, // reduce gap between children
              position: "relative",
              zIndex: 1,
              overflow: "visible",
            }}
          >
            <FallingPetals />
            {showConfetti && <Confetti recycle={false} numberOfPieces={50} />}

            <Typography
              variant="h3"
              color="#880e4f"
              sx={{ fontWeight: "bold", mt: 1, mb: 1 }}
            >
              🎉 Happy Birthday Champ ! 🎉
            </Typography>

            {blastedCount < friendAge ? (
              <Typography
                variant="h6"
                color="#4a148c"
                textAlign="center"
                sx={{ maxWidth: 400 }}
              >
                Pop your current age ballons to see the secret message! 🎈
              </Typography>
            ) : (
              <>
                <Typography
                  variant="h5"
                  color="#1cd738ff"
                  sx={{
                    fontWeight: "600",
                    textAlign: "center",
                    mb: 1,
                    maxWidth: 720,
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
                    lineHeight: 1.45,
                    mx: 'auto',
                    whiteSpace: 'normal',
                  }}
                >
                  Happy Birthday to my favourite Human ❤️
                  <br />
                  You've walked through storms with quiet strength,
                  carried light even on your darkest days, and never stopped
                  believing in the beauty of tomorrow. Your kindness, resilience,
                  and unwavering spirit inspire me every day. May this year
                  bring you calm mornings, gentle nights, and people who make you feel safe to be your true self.
                  You're growing beautifully, at your own pace, in your own time.
                  Keep shining, keep dreaming, and keep being the incredible person you are.
                  Never forget, you are rare, you are valued, and you are deeply loved more than you'll ever know. 💖😉
                </Typography>
                <Typography variant="h5" color="#880e4f" sx={{ mb: 1 }}>
                  Happy Birthday, Potti Budamkayee! 💖
                </Typography>
                {calendarMonth < birthdayMonthIndex && dateValid && (
                  <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={4000}
                    gravity={0.25}
                    wind={0.01}
                    opacity={0.85}
                    colors={[
                      "#ff69b4",
                      "#ffd700",
                      "#00bfff",
                      "#32cd32",
                      "#ff6347",
                      "#e91e63",
                      "#fff",
                      "#4a148c",
                      "#880e4f"
                    ]}
                    style={{ position: "fixed", top: 0, left: 0, zIndex: 9999 }}
                  />
                )}
                <FlipCalendarReal
                  birthdayMonthIndex={birthdayMonthIndex}
                  birthdayDate={birthdayDate}
                  currentMonth={calendarMonth}
                  setCurrentMonth={setCalendarMonth}
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 18,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                    backdropFilter: "blur(8px)",
                    border: "2px solid #fff",
                    overflow: "hidden",
                    minHeight: 200,
                    minWidth: 280,
                    width: '100%',
                    maxWidth: 420,
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={reset}
                  sx={{ mt: 2 }}
                >
                  Celebrate Again
                </Button>
              </>
            )}

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
                position: "relative",
                minHeight: 180,
              }}
            >
              {Array.from({ length: friendAge }).map((_, i) =>
                !balloonsBlasted[i] ? (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      width: 56,
                      height: 180,
                      position: "relative",
                      animation: `balloon-float 3.5s ${
                        0.2 * i
                      }s ease-in-out infinite`,
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
          </Box>
        </>
      )}
    </>
  );
}

export default App;
