import { Suspense } from "react";
import { ApplicationRouter } from "./router/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClientConfig } from "./config/react_query";

function App() {
  return (
    <Suspense
      fallback={<>Cargando contenido. Por favor espere un momento...</>}>
      <QueryClientProvider client={QueryClientConfig}>
        <ApplicationRouter />
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
