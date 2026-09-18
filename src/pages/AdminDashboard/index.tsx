import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../services/firebase/config";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

interface QnAMessage {
  id: string;
  category: string;
  message: string;
  nickname?: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const [messages, setMessages] = useState<QnAMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin");
      } else {
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (isAuthLoading) return;

    const q = query(collection(db, "qna_messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QnAMessage[];
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthLoading]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "qna_messages", id));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (isAuthLoading) return null;

  return (
    <div className="flex flex-col gap-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-display font-medium mb-4">Command Center</h1>
          <p className="text-text-secondary text-lg font-light">
            Administrative dashboard.
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="text-sm tracking-widest uppercase text-brand-accent hover:opacity-80 transition-opacity"
        >
          Logout →
        </button>
      </header>

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-display font-medium text-brand-accent">QnA Submissions</h2>
        
        {loading ? (
          <div className="text-text-secondary text-sm">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="glass-card p-12 rounded-xl text-center text-text-secondary font-light">
            No messages found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {messages.map(msg => (
              <div key={msg.id} className="glass-card p-6 rounded-xl flex flex-col gap-4 relative group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs tracking-widest uppercase text-brand-accent">
                      {msg.category}
                    </span>
                    <span className="text-sm font-medium">
                      {msg.nickname || "Anonymous"}
                    </span>
                    {msg.createdAt && (
                      <span className="text-xs text-text-tertiary">
                        {new Date(msg.createdAt.toDate()).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(msg.id)}
                    className="text-red-400 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-text-secondary font-light whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
