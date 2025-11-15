import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Bounce, ToastContainer, toast } from "react-toastify";
import api from "./services/api/api";
import Feed from "./pages/Feed/Feed";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { AlbumSearchModal } from "./components/ReviewModal/AlbumSearchModal";
import { ReviewFormModal } from "./components/ReviewModal/ReviewFormModal";
import { useState } from "react";
import { SearchResults } from "./pages/Search/SearchResults";
import CreatePostModal from "./components/CreatePostModal/CreatePostModal";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { ArtistPage } from "./pages/Artist/ArtistPage";
import { AlbumPage } from "./pages/Album/AlbumPage";
import { ExplorePage } from "./pages/Explore/ExplorePage";
import SelectTags from "./pages/SelectTags/SelectTags";
import Marketplace from "./pages/Marketplace/Marketplace";
import { GroupPage } from "./pages/Group/Group";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";

function App() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);

  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/select-tags";

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {!hideLayout && (
        <>
          <Header />
          <Sidebar
            onReviewClick={() => setShowReviewModal(true)}
            onPostClick={() => setShowPostModal(true)}
          />
        </>
      )}
      <main className={!hideLayout ? "pt-26" : ""}>
        <Routes>
          <Route path="/" element={<Navigate to="/feed" />} />
          <Route
            path="/feed"
            element={
              <Feed
                onOpenPostModal={() => setShowPostModal(true)}
                onOpenReviewModal={() => setShowReviewModal(true)}
              />
            }
          />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/select-tags" element={<SelectTags />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/groups/:groupId" element={<GroupPage />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      {showPostModal && (
        <CreatePostModal onClose={() => setShowPostModal(false)} />
      )}
      {showReviewModal && !selectedAlbum && (
        <AlbumSearchModal
          onSelect={(album) => {
            setSelectedAlbum(album);
          }}
          onClose={() => setShowReviewModal(false)}
        />
      )}
      {showReviewModal && selectedAlbum && (
        <ReviewFormModal
          album={selectedAlbum}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedAlbum(null);
          }}
          onSubmit={async (review) => {
            try {
              const token = localStorage.getItem("token");
              if (!token) {
                toast.error("You must be signed in to submit a review.");
                return;
              }

              await api.post(
                `/api/reviews/${selectedAlbum.idAlbum}`,
                {
                  reviewText: review.description,
                  reviewRating: review.rating,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              toast.success("Review submitted successfully!");
              setShowReviewModal(false);
              setSelectedAlbum(null);
            } catch (error: any) {
              if (error.response?.status === 400) {
                toast.error(
                  error.response.data?.message ||
                    "You have already reviewed this album."
                );
              } else {
                console.error("Submit review error:", error);
                toast.error("Failed to submit review.");
              }
            }
          }}
        />
      )}
    </>
  );
}

export default App;
