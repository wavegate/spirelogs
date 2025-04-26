import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./stores/store";
import CardComponent from "./components/CardComponent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CardComponent />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
}

export default App;
