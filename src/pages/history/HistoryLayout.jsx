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
import { useUserUid } from "../../hooks/UserProvider";
import { Loading } from "../../components/LoadingComponent";

export function loader({ request }) {
  const userUid = new URL(request.url).searchParams.get("auth");
  const receiptsPromise = getAllReceipt(userUid);
  return defer({ receiptsPromise });
}

export default function HistoryLayout() {
  const { userUid } = useUserUid();
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
            to={{
              pathname: "/history",
              search: userUid ? `?auth=${userUid}` : "",
            }}
            end
            className={({ isActive }) =>
              isActive ? "solidUnderLine" : "lightUnderLine"
            }
          >
            Process
            <div className="layout-nav--underline--solid layout-nav--underline--light"></div>
          </NavLink>
          <NavLink
            to={{
              pathname: "/history/done",
              search: userUid ? `?auth=${userUid}` : "",
            }}
            className={({ isActive }) =>
              isActive ? "solidUnderLine" : "lightUnderLine"
            }
          >
            Done
            <div className="layout-nav--underline--solid layout-nav--underline--light"></div>
          </NavLink>
        </div>
        <Suspense fallback={<Loading />}>
          <Await resolve={dataPromise.receiptsPromise}>{renderOutlet}</Await>
        </Suspense>
      </div>
    </div>
  );
}
