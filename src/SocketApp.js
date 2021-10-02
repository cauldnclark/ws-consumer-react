import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function Candidate({ name = "", votes = 0, handleClick = () => {} }) {
  return (
    <h2>
      <button onClick={handleClick} type="button">
        {name.toUpperCase()}:
      </button>
      <span style={{ marginLeft: 5 }}>{votes}</span>
    </h2>
  );
}

function SocketApp() {
  const [yorme, updateYorme] = useState(0);
  const [pacman, updatePacman] = useState(0);
  const [ping, updatePing] = useState(0);

  const YORME = "yorme";
  const PACMAN = "pacman";
  const PING = "ping";

  const candidateVoteHandlers = [
    { vote: yorme, name: YORME },
    { vote: pacman, name: PACMAN },
    { vote: ping, name: PING },
  ];

  useEffect(() => {
    console.log("bbb");
    socket.on("connect", () => {
      console.log("Connected to websocket server");
    });

    socket.on("events", (data) => {
      updateYorme(data[YORME]);
      updatePacman(data[PACMAN]);
      updatePing(data[PING]);
    });

    return () => {
      console.log("closing");
      return socket.close();
    };
  }, []);

  const handleClickVote = (candidate = "") => {
    const payload = {
      name: candidate,
      count: 1,
    };

    return socket.emit("vote", payload);
  };

  return (
    <>
      <h1>Websocket React Consumer</h1>
      {candidateVoteHandlers.map((item) => (
        <Candidate
          key={item.name}
          name={item.name}
          votes={item.vote}
          handleClick={() => handleClickVote(item.name)}
        />
      ))}
    </>
  );
}

export default SocketApp;
