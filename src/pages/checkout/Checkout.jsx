import {
  Form,
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import CheckoutProduct from "../../components/CheckoutProduct";
import { useEffect, useState } from "react";
import { TimePicker } from "react-ios-time-picker";
import { getCheckoutsById } from "../../utils";

export function action() {}
export async function loader() {
  const checkouts = await getCheckoutsById("11111");
  return checkouts;
}

export default function Checkout() {
  const checkouts = useLoaderData();
  const [currentCost, setCurrentCost] = useState(0);
  const [itemCounter, setItemCounter] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickupTime, setPickupTime] = useState();
  const { state } = useLocation();
  const discount = state?.discount || null;
  const discountUpto = state?.upto?.toFixed(2);
  const discountAmount = (discount / 100) * currentCost;
  const controlDiscount =
    discountAmount > discountUpto ? discountUpto : discountAmount;
  const finalCost = currentCost - controlDiscount;

  const checkoutElements = checkouts.map((checkout) => {
    useEffect(() => {
      setItemCounter(
        (prevItemCount) => prevItemCount + parseInt(checkout.quantity)
      );
    }, []);
    return (
      <CheckoutProduct
        {...checkout}
        changeCost={setCurrentCost}
        changeItemCount={setItemCounter}
      />
    );
  });

  function displayTimePicker() {
    setShowTimePicker((prevDisplay) => !prevDisplay);
  }

  function changePickupTime(event) {
    setPickupTime(event.target.value);
  }

  return (
    <>
      <div className="checkout-wrapper productDetailsWrapper ">
        <div className="productDetails--header">
          <Link to=".." relative="path">
            <img src="/icons/arrow-left.svg" />
          </Link>
          Checkout
        </div>

        {checkoutElements}

        <div className="checkout-sections">
          <h4 className="checkout-sections--headerText">
            When Do You Want Your Order?
          </h4>
          <small>*we are open form 8:00 - 20:00</small>
          <hr />

          <div className="checkout-time">
            <label htmlFor="asap">
              <p>As Soon as Possible</p>
              <small>Now - 10 Minutes</small>
            </label>
            <input type="radio" id="asap" name="checkout-time" />
          </div>

          <div className="checkout-time">
            <label htmlFor="later" onClick={displayTimePicker}>
              <p>Later</p>
              <small>{pickupTime || "Schedule Pick Up"}</small>
            </label>
            {showTimePicker && (
              <TimePicker
                pickerDefaultValue={`${new Date().getHours()}:${new Date().getMinutes()}`}
                onChange={(value) => setPickupTime(value)}
                onSave={() => setShowTimePicker(false)}
              />
            )}
            <input type="radio" id="later" name="checkout-time" />
          </div>
          <hr />

          <Link
            to="payment-method"
            state={{ ...state, search: searchParams.toString() }}
            className="checkout--payment-method"
          >
            <div>
              <p>Payment Method</p>
              <small>{state?.payment || "COD"}</small>
            </div>
            <img src="/icons/chevron-right.svg" />
          </Link>
          <hr />

          <Link
            to="vouchers"
            state={{
              ...state,
              spending: currentCost,
              search: searchParams.toString(),
            }}
            className="checkout--voucher"
          >
            <div>
              <p>Voucher</p>
              <small>
                {" "}
                {discount ? `Discount ${discount}%` : "No Voucher Added"}
              </small>
            </div>
            <img src="/icons/chevron-right.svg" />
          </Link>
          <hr />

          <div className="checkout--payment-summary">
            <p>Payment Summary</p>
            <div className="payment-summery--details">
              <div className="paymentSummary--charges">
                <div>
                  <p>price</p>
                  <small>
                    ({itemCounter} item{itemCounter > 1 && "s"})
                  </small>
                </div>
                <p>${currentCost.toFixed(2)}</p>
              </div>
              {discount && (
                <div className="paymentSummary--voucher">
                  <p>voucher</p>
                  <p>-{controlDiscount}</p>
                </div>
              )}
              <div className="paymentSummary-total">
                <h3>Total</h3>
                <h3>${finalCost.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="productDetails--footer">
          <div className="productDetails--footer--price">
            <small>Total</small>
            <h3>${finalCost.toFixed(2)}</h3>
          </div>
          <button className="button">Check out</button>
        </div>
      </div>
    </>
  );
}
