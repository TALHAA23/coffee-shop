import { NavLink, Outlet, useParams, useSearchParams } from "react-router-dom";
import Nav from "./Nav";
import Promo from "./Promo";
import Filters from "./Filters";

export default function HomeLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const restoreParams = searchParams.toString();

  return (
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

      <Filters />

      <main>
        <Outlet />
      </main>
    </header>
  );
}
