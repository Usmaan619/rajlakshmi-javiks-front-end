import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthRoutes from "./Routes/routes.jsx";
import { CartProvider } from "./Component/Context/UserContext.jsx";

function App() {
  
  return (
    <>
      <ToastContainer />
      <CartProvider>
          <AuthRoutes />
      </CartProvider>
    </>
  );
}

export default App;
