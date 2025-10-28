import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Bounce, ToastContainer } from "react-toastify";
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
import { ArtistPage } from  "./pages/Artist/ArtistPage";
import { AlbumPage } from "./pages/Album/AlbumPage";

function App() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

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
      <Routes>
        <Route path="/feed" element={<Feed />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
      </Routes>
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
          onSubmit={(review) => {
            // Aqui você pode enviar o review para o backend
            setShowReviewModal(false);
            setSelectedAlbum(null);
          }}
        />
      )}
    </>
  );
}

export default App;
