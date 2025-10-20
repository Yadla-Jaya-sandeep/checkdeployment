import React ,{useEffect, useState} from "react";
import "./Balloon.css";

export default function Balloon({ id, onBlast }) {
  const [blasting, setBlasting] = React.useState(false);
  const balloonRef = React.useRef(null);

  function handleClick() {
    if (blasting) return;
    setBlasting(true);
    const rect=balloonRef.current.getBoundingClientRect();
    onBlast(id, {x: rect.left + rect.width / 2, y: rect.top + rect.height / 2});
    setTimeout(() => {}, 1000);
  }

  return (
    <div className={`balloon ${blasting ? "blast" : ""}`} ref={balloonRef} onClick={handleClick}>
      🎈
    </div>
  );
}
