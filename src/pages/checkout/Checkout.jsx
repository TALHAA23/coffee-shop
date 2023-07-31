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
import { getOrderById } from "../../utils";

export function action() {}
export async function loader() {
  // const orderDetailsPromise = await getOrderById("1c4FfFztv3mDjbCp8cbP");
  return null;
}

export default function Checkout() {
  // const orderInfo = useLoaderData();

  const PERITEMCOST = 20;
  const [counter, setCounter] = useState(
    parseInt(localStorage.getItem("itemCount")) || 2
  );
  const [currentCost, setCurrentCost] = useState(PERITEMCOST * counter);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickupTime, setPickupTime] = useState();
  const { state } = useLocation();
  const discount = state?.discount || null;
  const discountUpto = state?.upto.toFixed(2);
  const discountAmount = ((discount / 100) * PERITEMCOST * counter).toFixed(2);
  const controlDiscount =
    discountAmount > discountUpto ? discountUpto : discountAmount;

  useEffect(() => {
    localStorage.setItem("itemCount", counter);
    setCurrentCost(PERITEMCOST * counter - controlDiscount);
  }, [counter, discount]);

  function incrementCount() {
    setCounter((prevCount) => prevCount + 1);
  }
  function decrementCount() {
    if (counter - 1 == 0) return;
    setCounter((prevCount) => prevCount - 1);
  }

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

        <CheckoutProduct
          counter={counter}
          cost={PERITEMCOST}
          increCount={incrementCount}
          decreCount={decrementCount}
        />

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
              spending: PERITEMCOST * counter,
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
                    ({counter} item{counter > 1 && "s"})
                  </small>
                </div>
                <p>${PERITEMCOST * counter}</p>
              </div>
              {discount && (
                <div className="paymentSummary--voucher">
                  <p>voucher</p>
                  <p>-{controlDiscount}</p>
                </div>
              )}
              <div className="paymentSummary-total">
                <h4>Total</h4>
                <h4>${currentCost}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="productDetails--footer">
          <div className="productDetails--footer--price">
            <small>Total</small>
            <h3>${currentCost}</h3>
          </div>
          <button className="button">Check out</button>
        </div>
      </div>
    </>
  );
}
