import React, { useEffect, useState, useCallback } from "react";
import bridge from "@vkontakte/vk-bridge";
import io from "socket.io-client";

import Wheel from "./features/Wheel";
import Toolbar from "./features/Toolbar";
import Winners from "./features/Winners";
import Congrats from "./features/Congrats";

import "./App.css";

const SOCKET_SERVER = "https://wheel-of-fortune-api.onrender.com";

const App = () => {
  const sections = ["Jackpot", "250", "400", "10", "100", "150", "200", "750"];
  const defaultUser = {
    id: 1,
    name: "Tony Stark",
    avatar: "",
  };

  const [user, setUser] = useState(defaultUser);
  const [winners, setWinners] = useState([]);
  const [prize, setPrize] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);

  const [socket, setSocket] = useState(() => io(SOCKET_SERVER));

  const addWinner = useCallback(
    (section) => {
      const prize = sections[section];
      setPrize(prize);
      setShowCongrats(true);
      socket.emit("winner", {
        name: user.name,
        avatar: user.avatar,
        prize,
      });
    },
    [winners]
  );

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("winners:init", (response) => {
        setWinners(response.winners.reverse());
      });
    });
    socket.on("disconnect", () => {
      setTimeout(() => {
        setSocket(io(SOCKET_SERVER));
      }, 3000);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  useEffect(async () => {
    const user = await bridge.send("VKWebAppGetUserInfo");
    setUser({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      avatar: user.photo_100,
    });
  }, []);

  useEffect(() => {
    socket.on("winner", (winner) => {
      setWinners([winner, ...winners]);
    });

    return () => {
      socket.off("winner");
    };
  }, [winners]);

  return (
    <div className="app">
      <div className="app__header">
        <h1>Wheel of fortune</h1>
      </div>

      <div className="app__container">
        <div className="app__playground">
          <Wheel sections={sections} />
          <Toolbar socket={socket} userId={user.id} onSpin={addWinner} />
        </div>
        <Winners winners={winners} />
      </div>
      {showCongrats && (
        <Congrats
          prize={prize}
          onClick={() => {
            setShowCongrats(false);
          }}
        />
      )}
    </div>
  );
};

export default App;
