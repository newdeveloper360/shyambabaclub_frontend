import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getDepositMessages, getWithdrawMessages } from "../repository/ChatRepository";
import { toast } from "react-toastify";

const FloatingMenu = () => {
  let location = useLocation();
  const [lastVisitedHelp, setLastVisitedHelp] = useState(() => {
    return localStorage.getItem('lastVisitedHelp') || null;
  });
  const [messageCount, setMessagesCount] = useState(0);

  let items = [
    {
      text: "Home",
      link: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
    },
    {
      text: "Play",
      link: "/play",
      icon: (
        <img
          src={require("../assets/imgs/game.png")}
          alt="Play"
          className="w-6 h-6"
        />
      ),
    },
    {
      text: "Wallet",
      link: "/wallet",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
          />
        </svg>
      ),
    },
    {
      text: "Help",
      link: "/help",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
      ),
    },
  ];

  const style = {
    marginLeft: "3px",
    borderRadius: "2px",
    padding: "0px 3px",
    background: "red",
    fontSize: "8px",
    color: "#fff",
    fontWeight: "bold",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depositRes = await getDepositMessages();
        let depositMessages = [];
        if (!depositRes.data.error) {
          depositMessages = depositRes?.data?.response?.chat?.messages || [];
        } else {
          toast.error(depositRes.data.message);
        }

        const withdrawRes = await getWithdrawMessages();
        let withdrawMessages = [];
        if (!withdrawRes.data.error) {
          withdrawMessages = withdrawRes?.data?.response?.chat?.messages || [];
        } else {
          toast.error(withdrawRes.data.message);
        }

        // Combine both message arrays
        const allMessages = [...depositMessages, ...withdrawMessages];

        // Count only messages after lastVisitedHelp
        let newMessages = allMessages;
        if (lastVisitedHelp) {
          newMessages = allMessages.filter(msg => {
            const msgTime = new Date(msg.created_at);
            const lastSeen = new Date(lastVisitedHelp);
            return msgTime > lastSeen;
          });
        }

        setMessagesCount(newMessages.length);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if(localStorage.getItem('authToken')) {
      fetchData();
    }
  }, [lastVisitedHelp]);
  
  return (
    <div className="absolute z-10 flex items-center p-2 bg-white border rounded-md shadow-md shadow-black/20 border-black/5 left-2 right-2 bottom-2 justify-evenly">
      {items.map((item, idx) => (
        <Link
          to={item.link || "#"}
          key={`FloatingMenuItem${idx}`}
          className={`flex w-11 h-11 flex-col ${location.pathname === item.link ? 'bg-primary/50' : ''} items-center  rounded-md py-0.5 px-1 hover:bg-primary/50`}

          onClick={() => {
            if (item.text === 'Help') {
              const now = new Date().toISOString();
              setLastVisitedHelp(now);
              localStorage.setItem('lastVisitedHelp', now);
              setMessagesCount(0); 
            }
          }}
        >
          {item.icon}
          <span className="mt-auto text-xs font-bold">{item.text}
          {item.text === 'Help' && messageCount > 0 && (
            <small style={style}>{messageCount}</small>
          )}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default FloatingMenu;
