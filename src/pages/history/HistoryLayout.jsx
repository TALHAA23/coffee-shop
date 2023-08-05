import {
  Link,
  NavLink,
  Outlet,
  defer,
  useLoaderData,
  Await,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { Suspense } from "react";
import { getAllReceipt } from "../../utils";

export function loader() {
  const receiptsPromise = getAllReceipt("myorder1");
  return defer({ receiptsPromise });
}

export default function HistoryLayout() {
  const dataPromise = useLoaderData();
  const { pathname } = useLocation();

  function renderOutlet(receipts) {
    const underProcessOrder = [];
    const doneOrder = [];

    receipts.forEach((receipt) => {
      const now = new Date();
      let deliveryTime = new Date(parseInt(receipt.estimate)).getTime();
      const timeCalculation = (deliveryTime - now.getTime()) / 60000;

      if (timeCalculation < 0) doneOrder.push(receipt);
      else underProcessOrder.push(receipt);
    });

    const contextData =
      pathname.split("/").length == 2 ? underProcessOrder : doneOrder;

    return (
      <div className="history--containers">
        <Outlet context={contextData} />
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="productDetails--header">
        <Link to=".." relative="path">
          <img src="/icons/arrow-left.svg" />
        </Link>
        History
      </div>
      <div className="history">
        <div className="history--layout">
          <NavLink
            to="/history"
            end
            className={({ isActive }) =>
              isActive ? "solidUnderLine" : "lightUnderLine"
            }
          >
            Process
            <div className="layout-nav--underline--solid layout-nav--underline--light"></div>
          </NavLink>
          <NavLink
            to="done"
            className={({ isActive }) =>
              isActive ? "solidUnderLine" : "lightUnderLine"
            }
          >
            Done
            <div className="layout-nav--underline--solid layout-nav--underline--light"></div>
          </NavLink>
        </div>
        <Suspense fallback={<h1>Loading</h1>}>
          <Await resolve={dataPromise.receiptsPromise}>{renderOutlet}</Await>
        </Suspense>
      </div>
    </div>
  );
}
