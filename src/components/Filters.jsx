import { NavLink, useSearchParams } from "react-router-dom";

const SEARCHPARAMS = {
  RATING: "rating",
  PRICE: "price",
  PROMO: "promo",
};

export default function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();

  function generateSearchParams(key, value) {
    const query = new URLSearchParams(searchParams);
    if (query.has(key)) query.delete(key);
    else query.set(key, value);
    return `?${query.toString()}`;
  }

  return (
    <div className="filters">
      <NavLink
        to={() => setSearchParams({})}
        className={searchParams.size ? "filter--active" : ""}
      >
        <img src="/icons/filter.svg" /> Clear Filter
      </NavLink>
      <NavLink
        to={generateSearchParams(SEARCHPARAMS.RATING, "4.5+")}
        className={
          searchParams.has(SEARCHPARAMS.RATING) ? "filter--active" : ""
        }
      >
        <img src="/icons/star.svg" /> Rating 4.5+
      </NavLink>
      <NavLink
        to={generateSearchParams(SEARCHPARAMS.PRICE, "lowtohigh")}
        className={searchParams.has(SEARCHPARAMS.PRICE) ? "filter--active" : ""}
      >
        <img src="/icons/dollar-sign.svg" />{" "}
        {searchParams.has(SEARCHPARAMS.PRICE) ? "Low to high" : "Price"}
      </NavLink>
      <NavLink
        to={generateSearchParams(SEARCHPARAMS.PROMO, "true")}
        className={searchParams.has(SEARCHPARAMS.PROMO) ? "filter--active" : ""}
      >
        <img src="/icons/discount.svg" /> Promo
      </NavLink>
    </div>
  );
}
