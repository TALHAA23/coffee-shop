import { defer, useLoaderData, Await, useSearchParams } from "react-router-dom";
import { Suspense, useEffect } from "react";
import Product from "../../components/Product";
import { getProducts } from "../../utils";
export function loader() {
  const coffeePromise = getProducts("coffee");
  return defer({ coffeePromise });
}

export default function Coffee() {
  const [searchParams, setSearchParmas] = useSearchParams();
  const dataPromise = useLoaderData();
  const [ratingFilter, priceFilter, promoFilter] = [
    searchParams.get("rating"),
    searchParams.get("price"),
    searchParams.get("promo"),
  ];

  function renderCoffees(coffees) {
    if (ratingFilter)
      coffees = coffees.filter(
        (coffee) => coffee.rating >= parseFloat(ratingFilter)
      );
    if (promoFilter)
      coffees = coffees.filter((coffee) => coffee.price.salePrice > 0);

    if (priceFilter)
      coffees = coffees.sort(
        (a, b) => a.price.originalPrice - b.price.originalPrice
      );

    const coffeeElements = coffees.map((coffee) => <Product {...coffee} />);
    return coffeeElements;
  }
  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Await resolve={dataPromise.coffeePromise}>{renderCoffees}</Await>
      </Suspense>
    </>
  );
}
