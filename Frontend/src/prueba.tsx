import { useEffect } from "react";
import axiosInstance from "./api/axios";

function App() {

  useEffect(() => {

    axiosInstance.get("/api/usuarios")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  return (
    <h1>Frontend conectado</h1>
  );
}

export default App;