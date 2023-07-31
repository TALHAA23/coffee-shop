import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Error from "./components/Error";

import BoradingSlide1 from "./pages/onboarding/BoardingSlide1";
import BoradingSlide2 from "./pages/onboarding/BoardingSlide2";
import BoradingSlide3 from "./pages/onboarding/BoardingSlide3";
import BoardingLayout from "./components/BoardingLayout";

import Registration, {
  action as registrationAction,
} from "./pages/registration/Registration";
import Login, { action as loginAction } from "./pages/login/Login";

import HomeLayout, {
  loader as homeLayoutLoader,
} from "./components/HomeLayout";
import Coffee, { loader as coffeeLoader } from "./pages/Home/Coffee";

import ProductDetails, {
  loader as productDetailsLoader,
  action as productDetailsAction,
} from "./components/ProductDetails";

import Checkout, {
  loader as checkoutLoader,
  action as checkoutAction,
} from "./pages/checkout/Checkout";
import PaymentMethod from "./pages/checkout/PaymentMethod";
import Vouchers from "./pages/checkout/Vouchers";

export default function App() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/">
          <Route path="onboarding" element={<BoardingLayout />}>
            <Route index element={<BoradingSlide1 />} />
            <Route path="2" element={<BoradingSlide2 />} />
            <Route path="3" element={<BoradingSlide3 />} />
          </Route>

          <Route
            path="registration"
            element={<Registration />}
            action={registrationAction}
          />
          <Route path="login" element={<Login />} action={loginAction} />
        </Route>

        <Route path="/" element={<HomeLayout />} loader={homeLayoutLoader}>
          <Route
            index
            element={<Coffee />}
            loader={coffeeLoader}
            errorElement={<Error />}
          />
          <Route
            path="non-coffee"
            element={<Coffee />}
            loader={coffeeLoader}
            errorElement={<Error />}
          />
          <Route
            path="pastry"
            element={<Coffee />}
            loader={coffeeLoader}
            errorElement={<Error />}
          />
        </Route>
        <Route
          path="/:id"
          element={<ProductDetails />}
          loader={productDetailsLoader}
          action={productDetailsAction}
        />
        <Route
          path="/non-coffee/:id"
          element={<ProductDetails />}
          loader={productDetailsLoader}
          action={productDetailsAction}
        />
        <Route
          path="/pastry/:id"
          element={<ProductDetails />}
          loader={productDetailsLoader}
          action={productDetailsAction}
        />

        <Route path="/checkout">
          <Route
            index
            element={<Checkout />}
            loader={checkoutLoader}
            action={checkoutAction}
          />
          <Route path="payment-method" element={<PaymentMethod />} />
          <Route path="vouchers" element={<Vouchers />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={routes} />;
}
