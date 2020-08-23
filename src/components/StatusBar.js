import React from "react";
import Button from "react-bootstrap/Button";
import "./StatusBar.css";

// det går att skriva (props) istället för {status} men då skriver man props.status
function StatusBar({ status, onRestart, onShowLeaderboard }) {
  // status is a prop
  return (
    <div className="status-bar">
      <p className="status">{status}</p>
      <Button variant="light" className="button" onClick={onRestart}>
        Restart
      </Button>
      <Button variant="light" className="button" onClick={onShowLeaderboard}>
        Leaderboard
      </Button>
    </div>
  );
}

export default StatusBar;
