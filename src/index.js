import React from "react";
import ReactDOM from "react-dom";
//import bridge from "@vkontakte/vk-bridge";
import App from "./App";

import "./style.css";

// Init VK Mini App
//bridge.send("VKWebAppInit");

// FBInstant.player будет инициализирован после реализации promise от FBInstant.startGameAsync
// Требуется синхронизация с useEffect в App
// window.onload = function () {
//   // Init Facebook Instant Games SDK
//   FBInstant.initializeAsync().then(
//     // This indicates that the game has finished initial loading and is ready to start
//     FBInstant.startGameAsync().then(() => {
//       console.log(
//         "userId from 'startGameAsync' promise",
//         FBInstant.player.getID()
//       );
//     })
//   );
// };

ReactDOM.render(<App />, document.getElementById("root"));
// if (process.env.NODE_ENV === "development") {
//   import("./eruda").then(({ default: eruda }) => {}); //runtime download
// }
