import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const Play = () => {
  const { markets: marketsPayload } = useSelector((state) => state.markets);
  const markets = marketsPayload?.markets || [];

  const [liveNumbers, setLiveNumbers] = useState([]);
  const [bidsNumbers, setBidsNumbers] = useState([]);
  const [direction, setDirection] = useState("up");
  const [updateCount, setUpdateCount] = useState(0);
  const [showNumbers, setShowNumbers] = useState(true);

  useEffect(() => {
    if (!markets.length) return;
    setLiveNumbers(markets.map(() => getRandomNumber(1700, 2500)));
    setBidsNumbers(markets.map(() => getRandomNumber(17000, 25000)));
  }, [markets.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount >= 3) {
          setDirection(prevDirection => (prevDirection === "up" ? "down" : "up"));
          return 0;
        }
        return newCount;
      });

      setLiveNumbers(prevLiveNumbers =>
        (prevLiveNumbers || []).map(num =>
          direction === "up"
            ? num + getRandomNumber(10, 50) - getRandomNumber(0, 10)
            : num - getRandomNumber(0, 10)
        )
      );

      setBidsNumbers(prevBidsNumbers =>
        (prevBidsNumbers || []).map(num =>
          direction === "up"
            ? num + getRandomNumber(50, 250) - getRandomNumber(0, 50)
            : num - getRandomNumber(0, 50)
        )
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [direction]);

  return (
    <div className="p-3 pb-8">
      <div className="flex flex-col gap-1">
        {markets?.map((market, index) => (
          <div key={market?.name} className="p-3 text-white rounded-md bg-primary">
            {showNumbers && market?.game_on && ( 
              <div className="w-full flex justify-center gap-2 mb-1">
                <div className="px-2 rounded-md bg-orange flex justify-center items-center text-[12px]">
                  <GoDotFill size={18} color="#fff" />LIVE: {liveNumbers?.[index]}
                </div>
                <div className="px-2 rounded-md flex justify-center items-center text-[12px] text-[#fff]">
                  <GoDotFill size={18} color="#d80522" />Bids: {bidsNumbers?.[index]}
                </div>
              </div>
            )}
            <div className="flex">
              <span className="text-sm font-semibold uppercase">{market?.name}</span>
              <Link
                className={`px-2 font-semibold ml-auto py-0.5 text-xs rounded-md shadow-md ${!market?.game_on ? "bg-orange" : "bg-greenLight"
                  }`}
                to={!market?.game_on ? "#" : `/play-game?gameType=${market.name}&market_id=${market?.id}`}
              >
                {!market?.game_on ? "Time Out" : "Play Games"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Play;
