import { useState, useEffect } from "react";

import InfoItem from "../components/InfoItem";
import Button from "../components/Button";
import ScreenSpinner from "../components/ScreenSpinner";
import { spinWheel } from "../services/canvas/drawWheel";

import "./Toolbar.css";

const Toolbar = ({ socket, userId, onSpin }) => {
  const [jackpot, setJackpot] = useState(0);
  const [balance, setBalance] = useState(0);
  const [enableButton, setEnableButton] = useState(false);
  const [runningWheel, setRunningWheel] = useState(false);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit("jackpot:init", (response) => {
      setJackpot(response.jackpot);
    });
    socket.emit("balance:init", userId, (response) => {
      setBalance(response.balance);
      setEnableButton(true);
    });

    socket.on("jackpot", (jackpot) => {
      setJackpot(jackpot);
    });
    socket.on("balance", (balance) => {
      setBalance(balance);
    });

    return () => {
      socket.off("jackpot");
      socket.off("balance");
    };
  }, [socket, userId]);

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
            if (!socket || runningWheel) {
              return;
            }
            setRunningWheel(true);
            socket.emit("bet", userId, async (response) => {
              if (!response.ok) {
                // блокирует основной поток в браузере до закрытия окна
                // лучше сделать отдельное модульное окно
                alert("Недостаточно средств! Пополните баланс");
                return;
              }

              setBalance(response.balance);
              const winSection = await spinWheel();
              setRunningWheel(false);
              onSpin(winSection);
            });
          }}
        />
      )}
    </div>
  );
};

export default Toolbar;
