import { NavLink, useSearchParams } from "react-router-dom";
import { useFilter } from "../hooks/FiltersProvider";

const SEARCHPARAMS = {
  RATING: "rating",
  PRICE: "price",
  PROMO: "promo",
};

export default function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, addFilter, removeFilter } = useFilter();

  // function generateSearchParams(key, value) {
  //   const query = new URLSearchParams(searchParams);
  //   if (query.has(key)) query.delete(key);
  //   else query.set(key, value);
  //   return `?${query.toString()}`;
  // }

  return (
    <div className="filters">
      <button
        onClick={() => addFilter("clear")}
        className={filters.length ? "filter--active" : ""}
        disabled={filters.length ? false : true}
      >
        <img src="/icons/filter.svg" /> Clear Filter
      </button>
      <button
        onClick={() => {
          if (filters.includes(SEARCHPARAMS.RATING))
            removeFilter(SEARCHPARAMS.RATING);
          else addFilter(SEARCHPARAMS.RATING);
        }}
        className={
          filters.includes(SEARCHPARAMS.RATING) ? "filter--active" : ""
        }
      >
        <img src="/icons/star.svg" /> Rating 4.5+
      </button>
      <button
        onClick={() => {
          if (filters.includes(SEARCHPARAMS.PRICE))
            removeFilter(SEARCHPARAMS.PRICE);
          else addFilter(SEARCHPARAMS.PRICE);
        }}
        className={filters.includes(SEARCHPARAMS.PRICE) ? "filter--active" : ""}
      >
        <img src="/icons/dollar-sign.svg" />{" "}
        {filters.includes(SEARCHPARAMS.PRICE) ? "Low to high" : "Price"}
      </button>
      <button
        onClick={() => {
          if (filters.includes(SEARCHPARAMS.PROMO))
            removeFilter(SEARCHPARAMS.PROMO);
          else addFilter(SEARCHPARAMS.PROMO);
        }}
        className={filters.includes(SEARCHPARAMS.PROMO) ? "filter--active" : ""}
      >
        <img src="/icons/discount.svg" /> Promo
      </button>
    </div>
  );
}
