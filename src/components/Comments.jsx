import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const Comments = ({ token }) => {
  const [connection, setConnection] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/commentsHub`, {
        accessTokenFactory: () => token, // optional: if you secure SignalR
      })
      .withAutomaticReconnect()
      .build();

    connect.start()
      .then(() => {
        console.log("Connected to SignalR hub");

        connect.on("ReceiveComment", (comment) => {
          setComments((prev) => [...prev, comment]);
        });
      })
      .catch(console.error);

    setConnection(connect);

    return () => {
      connect.stop();
    };
  }, [token]);

  const sendComment = async () => {
    if (connection && newComment.trim()) {
      try {
        await connection.invoke("SendComment", 0, newComment); // Replace 0 with actual userId if needed
        setNewComment("");
      } catch (err) {
        console.error("Error sending comment:", err);
      }
    }
  };

  return (
    <div className="mt-4">
      <h3>Live Comments</h3>
      <ul className="list-group mb-3">
        {comments.map((c, i) => (
          <li key={i} className="list-group-item">
            <strong>User {c.userId}:</strong> {c.comment}
          </li>
        ))}
      </ul>
      <div className="input-group">
        <input
          className="form-control"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button className="btn btn-primary" onClick={sendComment}>Send</button>
      </div>
    </div>
  );
};

export default Comments;
