import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api/api";
import avatarFallback from "../../assets/borabill_avatar.jpeg";

type ChatMessage = {
  id: number;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  other: boolean;
};

const indieChat: ChatMessage[] = [
  {
    id: 1,
    sender: "Luna",
    avatar: "https://i.pravatar.cc/50?img=12",
    text: "Just dug up a 2001 pressing of The Strokes. Anyone else still spin this?",
    time: "18:42",
    other: true,
  },
  {
    id: 2,
    sender: "Miguel",
    avatar: "https://i.pravatar.cc/50?img=24",
    text: "Yes! Pair it with the new Wet Leg EP—amazing contrast.",
    time: "18:44",
    other: true,
  },
  {
    id: 3,
    sender: "Tamar",
    avatar: "https://i.pravatar.cc/50?img=33",
    text: "Dropping a link to my shoegaze mix, feedback welcome.",
    time: "18:47",
    other: true,
  },
  {
    id: 4,
    sender: "Camila",
    avatar: "https://i.pravatar.cc/50?img=46",
    text: "I'm looking for a good shoegaze album to listen to.",
    time: "18:49",
    other: false,
  },
  {
    id: 5,
    sender: "Leo",
    avatar: "https://i.pravatar.cc/50?img=44",
    text: "Anyone in here going to Primavera next month?",
    time: "18:49",
    other: true,
  },
];

export const GroupPage: React.FC = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [user, setUser] = useState<any>(null);

  const isIndie = groupId === "indie";
  const chatMessages = useMemo(() => (isIndie ? indieChat : []), [isIndie]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#05060b] text-white sm:pl-32">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <button
          type="button"
          className="text-sm uppercase tracking-[0.4em] text-white/60 transition hover:text-white"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {isIndie ? (
          <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
            <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Group</p>
                <h1 className="text-3xl font-semibold">Indie Underground</h1>
              </div>
              <p className="text-sm text-white/70">
                A place for collectors to share their favorite shoegaze, dream pop, and late-night discoveries.
              </p>
              <div className="grid grid-cols-2 gap-3 text-center text-sm">
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="text-xl font-semibold">18.4k</p>
                  <p className="text-white/60 text-xs">Members</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3">
                  <p className="text-xl font-semibold">542</p>
                  <p className="text-white/60 text-xs">Online</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {["shoegaze", "dreampop", "livevinyl"].map((tag) => (
                  <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-white/70">
                    #{tag}
                  </span>
                ))}
              </div>
            </aside>

            <section className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="mb-4 text-sm uppercase tracking-[0.4em] text-white/60">Today</div>
              <div
                className="flex-1 space-y-4 overflow-y-auto pr-2"
                style={{ maxHeight: "60vh", scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.3) transparent" }}
              >
                {chatMessages.map((message) => {
                  const displayName = message.other ? message.sender : user?.name || "You";
                  const displayAvatar = message.other
                    ? message.avatar
                    : user?.profilePicture
                      ? `http://localhost:3000/uploads/profile/${user.profilePicture}`
                      : avatarFallback;

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 rounded-2xl p-3 ${
                        message.other ? "bg-white/5" : "bg-gradient-to-r from-[#7c5bff]/30 to-[#ff6ec4]/30"
                      }`}
                    >
                      <img src={displayAvatar} alt={displayName} className="h-10 w-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold">{displayName}</span>
                          <span className="text-white/50">{message.time}</span>
                        </div>
                        <p className="text-sm text-white/80">{message.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Say something to the group…"
                  className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none"
                />
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                  disabled
                >
                  Send
                </button>
              </div>
            </section>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70 shadow-2xl backdrop-blur">
            This group chat is coming soon.
          </div>
        )}
      </div>
    </div>
  );
};
