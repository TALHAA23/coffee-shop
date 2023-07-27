import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import BoradingSlide1 from "./pages/onboarding/BoardingSlide1";
import BoradingSlide2 from "./pages/onboarding/BoardingSlide2";
import BoradingSlide3 from "./pages/onboarding/BoardingSlide3";
import BoardingLayout from "./components/BoardingLayout";
import Registration, {
  action as registrationAction,
} from "./pages/registration/Registration";
import Login, { action as loginAction } from "./pages/login/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";

export default function App() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="onboarding" element={<BoardingLayout />}>
          <Route index element={<BoradingSlide1 />} />
          <Route path="2" element={<BoradingSlide2 />} />
          <Route path="3" element={<BoradingSlide3 />} />
        </Route>

        <Route path="/">
          <Route
            path="registration"
            element={<Registration />}
            action={registrationAction}
          />
          <Route path="login" element={<Login />} action={loginAction} />
        </Route>

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={routes} />;
}
