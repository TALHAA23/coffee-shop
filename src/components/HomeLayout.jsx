import {
  NavLink,
  Outlet,
  defer,
  useLoaderData,
  useSearchParams,
  Await,
} from "react-router-dom";
import { Suspense } from "react";
import Nav from "./Nav";
import Promo from "./Promo";
import Filters from "./Filters";
import { getProducts, getOrderById } from "../utils";
import { getSignedInUser } from "../auth";

import FiltersProvider from "../hooks/FiltersProvider";

export async function loader() {
  const orderNumber = localStorage.getItem("orderNumber");
  const orderinfoPromise = getOrderById(orderNumber);
  const coffeePromise = getProducts();
  return defer({ orderinfoPromise, coffeePromise });
}

export default function HomeLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const restoreParams = searchParams.toString();
  const dataPromise = useLoaderData();
  function popOrderConfirmation(orderInfo) {
    if (!orderInfo) return null;
    localStorage.removeItem("orderNumber");
    return (
      <div className="order-confirmation--popup">
        <div className="confirmation-popup--orderDetails">
          <h5>{orderInfo.quantity} item(s)</h5>
          <p>{orderInfo.title}</p>
        </div>
        <div className="confirmation-popup--orderCost">
          ${parseFloat(orderInfo.total)} <img src="/icons/shopping-bag.svg" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense>
        <Await resolve={dataPromise.orderinfoPromise}>
          {popOrderConfirmation}
        </Await>
      </Suspense>

      <header className="homeHeader">
        <Nav />
        <div className="promos-wrapper">
          <Promo />
        </div>

        <div className="layout-nav">
          <NavLink
            to={`/?${restoreParams}`}
            className={({ isActive }) =>
              isActive ? "solidUnderLine" : "lightUnderLine"
            }
          >
            Coffee
            <div className="layout-nav--underline--solid layout-nav--underline--light"></div>
          </NavLink>
          <NavLink
            to={`non-coffee?${restoreParams}`}
            className={({ isActive }) =>
              isActive ? "solidUnderLine" : "lightUnderLine"
            }
          >
            Non Coffee
            <div className="layout-nav--underline--solid layout-nav--underline--light"></div>
          </NavLink>
          <NavLink
            to={`/pastry?${restoreParams}`}
            className={({ isActive }) =>
              isActive ? "solidUnderLine" : "lightUnderLine"
            }
          >
            Pastry
            <div className="layout-nav--underline--solid layout-nav--underline--light"></div>
          </NavLink>
        </div>
      </header>
      <main>
        <FiltersProvider>
          <Outlet context={dataPromise.coffeePromise} />
        </FiltersProvider>
      </main>
    </>
  );
}
