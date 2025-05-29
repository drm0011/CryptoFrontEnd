import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let connection = null;
let noteCallback = null;

export const initSignalR = (token) => {
    console.log("SignalR token:", token); 
    connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/commentsHub`, {
        accessTokenFactory: () => token,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
  
    connection.on("ReceiveComment", (note) => {
      if (noteCallback) noteCallback(note);
    });
  
    return connection
      .start()
      .then(() => console.log("SignalR connected"))
      .catch((err) => console.error("SignalR connection failed: ", err));
  };
  
  export const onNoteReceived = (callback) => {
    noteCallback = callback;
  };
  
  export const sendNoteSignal = async (userId, coinId, note) => {
    if (connection && connection.state === "Connected") {
      await connection.invoke("SendComment", userId, coinId, note);
    }
  };
  
  export const stopSignalRConnection = async () => {
    if (connection) {
      await connection.stop();
      connection = null;
    }
  };
