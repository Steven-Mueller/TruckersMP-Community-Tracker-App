import { useEffect, useState, useRef } from "react";
import userImg from "../assets/user.png";
import steamImg from "../assets/steam.png";
import steamidIMG from "../assets/steamid.png";
import truckersImg from "../assets/truckersmp.png";
import defaultUserImg from "../assets/defaultUser.png";

export default function Player() {
  const player = useRef();
  const [playerName, setPlayerName] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [noPlayer, setNoPLayer] = useState(true);
  const defaultData = {
    playerName: "Awaiting data, nothing to show at the moment...",
    steamUrl: "Awaiting data, nothing to show at the moment...",
    steamID: "Awaiting data, nothing to show at the moment...",
    truckersMP: "Awaiting data, nothing to show at the moment...",
  };

  async function fetchData() {
    try {
      const response = await fetch(
        `https://api.truckyapp.com/v2/steam/resolveVanityUrl?username=${playerName}`,
      );
      const data = await response.json();
      if (data.response.found) {
        setPlayerData(data.response.playerInfo);
        setNoPLayer(false);
      } else {
        setNoPLayer(true);
      }
    } catch (err) {
      console.error(err);
      setNoPLayer(true);
    }
  }

  useEffect(() => {
    if (!document.title.includes("Players")) {
      document.title = "TCT - Players";
    }
    if (!document.head.innerHTML.includes("description")) {
      document.head.innerHTML +=
        '<meta name="description" content="User can search for a specific player via steam name. Shown results are steam user name, steam id with link to steam user profile, steam id and truckersMP id.">';
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-14">
      <form
        className="flex gap-3 justify-center items-start"
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
      >
        <input
          type="text"
          id="playerName"
          className="h-10 text-xl text-center font-bold bg-white/30 border border-black shadow-lg shadow-white/15"
          placeholder="Type in player name..."
          ref={player}
        />
        <button
          className="border p-2 bg-red-600/40 border-black rounded-lg hover:bg-yellow-700/70 active:scale-90 shadow-lg shadow-white/15"
          onClick={() => setPlayerName(player.current.value)}
        >
          SEARCH
        </button>
      </form>
      <div className="flex justify-center mt-10 gap-0 shadow-lg shadow-white/15 border-4 border-white/25 rounded-xl border-double">
        <img
          src={noPlayer ? defaultUserImg : playerData && playerData.avatarfull}
          alt="avatar"
          className="rounded-l-lg border-2 border-white/15"
          height={400}
          width={400}
        />
        <div className="flex flex-col items-center justify-center">
          <table className="h-full text-center border-hidden">
            <tbody>
              <tr>
                <th>
                  <img src={userImg} alt="person" height={100} width={100} />
                </th>
                <td className={noPlayer ? "noData" : "data"}>
                  {noPlayer
                    ? defaultData.playerName
                    : playerData && playerData.personaname}
                </td>
              </tr>
              <tr>
                <th>
                  <img src={steamImg} alt="steam" height={100} width={100} />
                </th>
                <td className={noPlayer ? "noData" : "data"}>
                  {noPlayer
                    ? defaultData.steamUrl
                    : playerData && (
                        <a
                          className="playerLink text-green-500 hover:underline hover:text-red-400"
                          href={playerData.profileurl}
                          target="_blank"
                        >
                          {playerData.profileurl}
                        </a>
                      )}
                </td>
              </tr>
              <tr>
                <th>
                  <img
                    src={steamidIMG}
                    alt="steamid"
                    height={100}
                    width={100}
                  />
                </th>
                <td className={noPlayer ? "noData" : "data"}>
                  {noPlayer
                    ? defaultData.steamID
                    : playerData && playerData.steamid}
                </td>
              </tr>
              <tr>
                <th>
                  <img
                    src={truckersImg}
                    alt="TruckersMP"
                    height={100}
                    width={100}
                  />
                </th>
                <td className={noPlayer ? "noData" : "data"}>
                  {noPlayer
                    ? defaultData.truckersMP
                    : playerData && playerData.truckersMPUser}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
