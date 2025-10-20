import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Bounce, ToastContainer } from "react-toastify";
import Feed from "./pages/Feed/Feed";
import Sidebar from "./components/Sidebar/Sidebar";
import { AlbumSearchModal } from "./components/ReviewModal/AlbumSearchModal";
import { useState } from "react";

function App() {
  const [showReviewModal, setShowReviewModal] = useState(false);

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
      <Sidebar onReviewClick={() => setShowReviewModal(true)} />
      <Routes>
        <Route path="/feed" element={<Feed />} />
      </Routes>
      {showReviewModal && (
        <AlbumSearchModal
          onSelect={album => {
            // avançar para a tela de avaliação depois
            setShowReviewModal(false);
          }}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </>
  );
}

export default App;
