import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Bounce, ToastContainer } from "react-toastify";
import Feed from "./components/Feed/Feed";

function App() {
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
      <Routes>
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </>
  );
}

export default App;
