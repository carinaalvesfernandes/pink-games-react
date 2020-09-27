import React from "react";
import "./MemoryCard.css";

function MemoryCard({ image, isFlipped, onClick }) {
  let className = "memory-card";
  if (isFlipped) {
    className = className + " " + image + " image";
  }
  return <div className={className} onClick={onClick}></div>;
}

export default MemoryCard;
