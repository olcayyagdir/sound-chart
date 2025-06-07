import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PieChart.module.css";

const CommentSection = ({ employeeId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      if (!employeeId) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/employees/${employeeId}/comments`
        );
        setComments(res.data);
      } catch (err) {
        console.error("Yorumlar alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const commentToSend = {
      employeeId: employeeId,
      text: newComment,
    };

    console.log("🎯 Gönderilen veri:", commentToSend);

    try {
      const res = await axios.post(
        `https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/employees/${employeeId}/comments`,
        commentToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Sunucudan gelen yanıt:", res.data);
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("❌ Yorum gönderilemedi:", err);
      if (err.response) {
        console.error("🔍 Sunucu cevabı:", err.response.data);
      }
    }
  };

  return (
    <div className={styles.commentSection}>
      <h4>Comments</h4>

      {loading ? (
        <p style={{ color: "#888" }}>Loading comments...</p>
      ) : (
        <ul className={styles.commentList}>
          {comments.map((c, i) => (
            <li key={c.id || i}>{c.text}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <textarea
          className={styles.commentInput}
          placeholder="Write a Comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit" className={styles.commentButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
