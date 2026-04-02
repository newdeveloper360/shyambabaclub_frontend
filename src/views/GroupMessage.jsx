import React, { useEffect, useState } from "react";
import "../assets/css/Global.css";
import { getGroupMemberMessages } from "../repository/ChatRepository";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner";

const GroupMessage = () => {
    let { appData } = useSelector((state) => state.appData.appData);
    let [groupMemberMessages, setGroupMemberMessages] = useState([]);
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Group Message | Morvi Nnandan";
        const fetchGroupMemberMessages = async () => {
            try {
                setLoading(true);
                let { data } = await getGroupMemberMessages();

                if (data.error) {
                    toast.error(data.message);
                } else {
                    setGroupMemberMessages(data.response.data);
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchGroupMemberMessages();
    }, []);

  return (    
      <div className="chat-wrapper">
        {loading &&
            <div className='flex justify-center items-center h-[100dvh]'>
                <Spinner />
            </div>
        }
        
      <div className="card msgcard">
        <div className="card-body">
          <div className="chat-log">
            {groupMemberMessages.map((message) => (
              <div className={`chat-log_item flex items-center`}>

                {message.image && (
                <div className="chat-log_img me-1">
                    <a href={`${appData?.base_domain}/public${message.image}`} target="_blank" rel="noreferrer">
                        <img src={`${appData?.base_domain}/public${message.image}`} alt="Group Message" />
                    </a>
                </div>
                )}

                <div>
                    {/* <hr className="my-1 py-0 col-8 opacity-line" /> */}
                    <div className="chat-log_message">
                    <p>{message.message}</p>
                    </div>

                    {/* <hr className="my-1 py-0 col-8 opacity-line" /> */}

                    <div className="chat-log_time m-0 p-0 flex flex-col items-end justify-center">
                        <div>
                            <span>{moment(message.created_at).format("hh:mm A")}</span>
                            {message.link && (
                                <span className="ml-1 link">
                                    <a href={message.link} target="_blank" rel="noreferrer">
                                        <i className="fas fa-link"></i>
                                    </a>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GroupMessage;