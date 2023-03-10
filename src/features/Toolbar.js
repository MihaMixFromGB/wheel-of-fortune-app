import { useState, useEffect } from "react";

import InfoItem from "../components/InfoItem";
import Button from "../components/Button";
import ScreenSpinner from "../components/ScreenSpinner";
import { spinWheel } from "../services/canvas/drawWheel";

import "./Toolbar.css";

const Toolbar = ({ socketRef, userId, onSpin }) => {
  const [jackpot, setJackpot] = useState(0);
  const [balance, setBalance] = useState(0);
  const [enableButton, SetEnableButton] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }
    socket.on("connect", () => {
      socket.emit("jackpot:init", (response) => {
        setJackpot(response.jackpot);
      });
      socket.emit("balance:init", userId, (response) => {
        setBalance(response.balance);
      });
      SetEnableButton(true);
    });

    socket.on("jackpot", (jackpot) => {
      setJackpot(jackpot);
    });

    return () => {
      socket.off("connect");
      socket.off("jackpot");
    };
  }, [socketRef, userId]);

  return (
    <div className="toolbar">
      <InfoItem label={"jackpot"} value={jackpot} />
      <InfoItem label={"balance"} value={balance} />
      {!enableButton ? (
        <ScreenSpinner />
      ) : (
        <Button
          label="SPIN WHEEL"
          onClick={() => {
            const socket = socketRef.current;
            socket.emit("bet", userId, async (response) => {
              if (!response.ok) {
                // блокирует основной поток в браузере до закрытия окна
                // лучше сделать отдельное модульное окно
                alert("Недостаточно средств! Пополните баланс");
                return;
              }

              setBalance(response.balance);
              const winSection = await spinWheel();
              onSpin(winSection);
            });
          }}
        />
      )}
    </div>
  );
};

export default Toolbar;
