import { useEffect, useState } from "react";

const websocket = new WebSocket("ws://localhost:8088");

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

function App() {
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
    websocket.onmessage = function onMessage(event) {
      const data = JSON.parse(event.data);

      updateYorme(data[YORME]);
      updatePacman(data[PACMAN]);
      updatePing(data[PING]);
    };

    return () => websocket.close();
  }, []);

  const handleClickVote = (candidate = "") => {
    const payload = {
      name: candidate,
      count: 1,
    };

    return websocket.send(JSON.stringify(payload));
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

export default App;
