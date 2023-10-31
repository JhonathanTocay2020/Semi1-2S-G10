import React, { useState, useEffect, useRef } from "react";
import './Chatbot.css';
import ScrollToBottom from "react-scroll-to-bottom";
import config from "../../config.js";
function Chatbot() {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {

        if (currentMessage !== "") {
            const messageData = {
                author: 1,
                message: currentMessage,
                name: 'Tú',
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes()
            }
            setCurrentMessage("")
            setMessageList((list) => [...list, messageData]);

            //Aqui se envia el mensaje y se obtiene la respuesta
            const data = {
                message: messageData.message
            }


            config.requestOptionsPOST.body = JSON.stringify(data)
            fetch(`${config.apiUrl}/Chatbot`, config.requestOptionsPOST)
                .then(response => {
                    if (!response.ok) {
                        console.error(response);
                        console.log("Error")
                    }
                    return response.json();
                })
                .then((data) => {


                    const messageDataRes = {
                        author: 2,
                        message: data["respuesta"],
                        name: 'Chatbot',
                        time:
                            new Date(Date.now()).getHours() +
                            ":" +
                            new Date(Date.now()).getMinutes()
                    }
        
                    setMessageList((list) => [...list, messageDataRes]);
                    console.log(data.mensaje);
                })
                .catch((error) => {
                    console.error(error.message)
                    ShowMsg('danger', 'Error con el chatbot: ' + error.message);
                });


            //--------------------------------------------------
        }

    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent) => {
                        return <div className="message" id={1 === messageContent.author ? "you" : "other"}>
                            <div>
                                <div className="message-content">
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.time}</p>
                                    <p id="author">{messageContent.name}</p>
                                </div>
                            </div>
                        </div>
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Hola!"
                    onChange={(event) => {
                        setCurrentMessage(event.target.value)
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chatbot