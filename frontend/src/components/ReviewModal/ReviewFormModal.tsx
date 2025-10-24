import React, { useState } from "react";
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
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10">
      <div className="bg-[#272730] rounded-lg p-8 shadow-lg w-[520px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>
        <div className="flex items-center mb-4">
          <img
            src={album.strAlbumThumb}
            alt={album.strAlbum}
            className="w-16 h-16 rounded mr-4"
          />
          <div>
            <div className="text-lg font-bold text-[#FEF4EA]">
              {album.strAlbum}
            </div>
            <div className="text-[#FEF4EA]">{album.strArtist}</div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none cursor-pointer"
              >
                <FaStar
                  size={32}
                  className={
                    (hover || rating) >= star
                      ? "text-[#E16A71]"
                      : "text-[#FEF4EA]"
                  }
                />
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add your review..."
          className="w-full h-24 p-2 rounded bg-[#6B818C] text-[#FEF4EA] mb-4 resize-none"
        />
        <button
          // #todo: salvar a review no banco de dados
          onClick={() => onSubmit({ rating, description })}
          className="cursor-pointer w-full bg-[#8078a5] text-[#FEF4EA] py-2 rounded-full hover:bg-[#9a8fc1]"
          disabled={rating === 0 || description.trim() === ""}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
