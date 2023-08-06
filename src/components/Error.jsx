import { Link } from "react-router-dom";
import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError();
  return (
    <div className="notfound--wrapper">
      <h1>{error.message}</h1>
      <img src="/gifs/no-search-result.gif" />
    </div>
  );
}

export function NoCheckoutError() {
  const error = useRouteError();
  return (
    <div className="notfound--wrapper">
      <h1>{error.message}</h1>
      <img src="/gifs/no-checkout.gif" />
      <Link to="/" className="notfound--back-to-home">
        get back to order
      </Link>
    </div>
  );
}
