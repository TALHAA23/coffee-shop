import {
  Link,
  defer,
  useLoaderData,
  Await,
  useNavigate,
} from "react-router-dom";
import { getReceiptById } from "../../utils";
import { Suspense } from "react";
import { FullScreenLoading } from "../../components/LoadingComponent";

export function loader({ params }) {
  const receiptId = params.id;
  const receiptPromise = getReceiptById(receiptId);
  return defer({ receiptPromise });
}

export default function Receipt() {
  const dataPromise = useLoaderData();
  const navigate = useNavigate();

  function renderReceipt(receiptData) {
    const itemList = JSON.parse(receiptData.itemList);

    const itemListElement = itemList.map((item) => (
      <div>
        <div>
          <h4>{item.item}</h4>
          <p>{item.desc}</p>
        </div>
        <p>
          <b>x{item.quantity}</b>
        </p>
      </div>
    ));

    return (
      <div className="checkout-wrapper">
        <div className="productDetails--header">
          <Link to="/" relative="path">
            <img src="/icons/arrow-left.svg" />
          </Link>
          Receipt Order
        </div>
        <div className="receipt">
          <div className="receipt--header">
            <img
              className="receipt--header--tick"
              src="/other-images/green-tick.png"
            />
            <h2>Thank You</h2>
            <p>Your transaction was successful</p>
          </div>
          <div className="receipt--about">
            <div>
              <h4>ID Transaction</h4>
              <p>{receiptData.id}</p>
            </div>
            <div>
              <h4>Date</h4>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <h4>Time</h4>
              <p>{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          <hr />
          <div className="receipt--data">
            <h4>Item</h4>
            {itemListElement}
            <hr />
            <div className="receipt--payment-summary">
              <h4>Payment Summary</h4>
              <div>
                <h5>Price</h5>
                <p>${receiptData.price}</p>
              </div>
              <div>
                <h5>Voucher</h5>
                <p>{receiptData.voucher}</p>
              </div>
              <div>
                <h4>Total</h4>
                <h4>$23.00</h4>
              </div>
              <div>
                <h4>Payment Method</h4>
                <p>{receiptData.paymentMethod}</p>
              </div>
              <div>
                <h4>
                  Pick Up <small>(estimate)</small>
                </h4>
                <p>
                  {new Date(
                    parseInt(receiptData.estimate)
                  ).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          className="button receipt--track-order"
          onClick={() =>
            navigate("track", {
              state: {
                itemList,
                estimate: receiptData.estimate,
                receiptId: receiptData.id,
              },
            })
          }
        >
          Track Order
        </button>
      </div>
    );
  }

  return (
    <Suspense fallback={<FullScreenLoading />}>
      <Await resolve={dataPromise.receiptPromise}>{renderReceipt}</Await>
    </Suspense>
  );
}
