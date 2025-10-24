import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Bounce, ToastContainer } from "react-toastify";
import Feed from "./pages/Feed/Feed";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import { AlbumSearchModal } from "./components/ReviewModal/AlbumSearchModal";
import { ReviewFormModal } from "./components/ReviewModal/ReviewFormModal";
import { useState } from "react";
import { SearchResults } from "./pages/Search/SearchResults";

function App() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

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
      <Header />
      <Sidebar onReviewClick={() => setShowReviewModal(true)} />
      <Routes>
        <Route path="/feed" element={<Feed />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
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
