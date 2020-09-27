import React from "react";
import "./MemoryCard.css";

/*function MemoryCard({ image, isFlipped, onClick }) {
  let className = "memory-card";
  if (isFlipped) {
    className = className + " " + image + " image";
  }
  return <div className={className} onClick={onClick}></div>;
}*/

function MemoryCard({ isFlipped, image, onClick }) {
  return (
    <div className="memory-card-scene" onClick={onClick}>
      <div className={"memory-card-container " + (isFlipped ? "flipped" : "")}>
        <div className="memory-card back"></div>
        <div className={`memory-card front image ${image}`}></div>
      </div>
    </div>
  );
}

export default MemoryCard;
