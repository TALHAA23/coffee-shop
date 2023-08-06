import {
  defer,
  useLoaderData,
  Await,
  useSearchParams,
  Link,
  useOutletContext,
  useLocation,
} from "react-router-dom";
import { Suspense } from "react";
import Product from "../../components/Product";
import Filters from "../../components/Filters";
import { useFilter } from "../../hooks/FiltersProvider";
import { getProducts } from "../../utils";
import { Loading } from "../../components/LoadingComponent";

export function loader({ request }) {
  const url = new URL(request.url).pathname.split("/")[1];
  const coffeePromise = getProducts(url || "coffee");
  return defer({ coffeePromise });
}

export default function Coffee() {
  const dataPromise = useOutletContext();
  const location = useLocation();
  const { filters } = useFilter();

  function renderCoffees(coffees) {
    const productOrigin = location.pathname.split("/")[1] || "coffee";
    let displayedCoffee = coffees.filter(
      (coffee) => coffee.origin == productOrigin
    );
    if (filters.includes("rating"))
      displayedCoffee = displayedCoffee.filter(
        (coffee) => coffee.rating >= 4.5
      );
    if (filters.includes("promo"))
      displayedCoffee = displayedCoffee.filter(
        (coffee) => coffee.price.salePrice > 0
      );

    if (filters.includes("price"))
      displayedCoffee = displayedCoffee.sort(
        (a, b) => a.price.originalPrice - b.price.originalPrice
      );

    const coffeeElements = displayedCoffee.map((coffee) => (
      <Product key={coffee.id} {...coffee} />
    ));
    return coffeeElements;
  }
  return (
    <>
      <Filters />
      <Suspense fallback={<Loading />}>
        <Await resolve={dataPromise}>{renderCoffees}</Await>
      </Suspense>
    </>
  );
}
