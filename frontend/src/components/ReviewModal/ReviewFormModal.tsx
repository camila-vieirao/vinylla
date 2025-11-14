import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface ReviewFormModalProps {
  album: {
    idAlbum: string;
    strAlbum: string;
    strArtist: string;
    strAlbumThumb: string;
  };
  onClose: () => void;
  onSubmit: (review: { rating: number; description: string }) => void;
}

export function ReviewFormModal({
  album,
  onClose,
  onSubmit,
}: ReviewFormModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#080b16] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Review</p>
            <p className="text-xl font-semibold">Share your thoughts</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full border border-white/10 p-2 text-lg text-white/70 transition hover:border-white/40 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <img
              src={album.strAlbumThumb}
              alt={album.strAlbum}
              className="h-16 w-16 rounded-xl object-cover"
            />
            <div>
              <p className="text-lg font-semibold">{album.strAlbum}</p>
              <p className="text-sm text-white/60">{album.strArtist}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Rate this record</p>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="cursor-pointer rounded-full p-1 transition hover:scale-110 focus:outline-none"
                >
                  <FaStar
                    size={34}
                    className={
                      (hover || rating) >= star ? "text-[#ff7ca3]" : "text-white/30"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Tell the community</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What stood out on this spin?"
              className="mt-3 h-32 w-full resize-none bg-transparent text-base text-white placeholder-white/40 focus:outline-none"
            />
          </div>

          <button
            onClick={() => onSubmit({ rating, description })}
            className="cursor-pointer w-full rounded-full bg-gradient-to-r from-[#7c5bff] to-[#ff6ec4] py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:opacity-90 disabled:opacity-40"
            disabled={rating === 0 || description.trim() === ""}
          >
            Submit review
          </button>
        </div>
      </div>
    </div>
  );
}
