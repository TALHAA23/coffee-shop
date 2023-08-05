import {
  Form,
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
  defer,
  Await,
  redirect,
  useNavigation,
} from "react-router-dom";
import { Suspense } from "react";
import { useUser } from "../../hooks/UserProvider";
import CheckoutProduct from "../../components/CheckoutProduct";
import { useEffect, useState } from "react";
import { TimePicker } from "react-ios-time-picker";
import { getMyCheckouts } from "../../utils";
import { saveReceipt } from "../../utils";

export async function action({ request }) {
  const formData = await request.formData();
  const price = formData.get("price");
  // const deliveryTime = formData.get("deliveryTime");
  const estimate = formData.get("estimateTime");
  const paymentMethod = formData.get("payment-method");
  const voucher = formData.get("voucher");
  const itemList = formData.get("itemList");
  const total = formData.get("total");

  const data = {
    price,
    // deliveryTime,
    estimate,
    paymentMethod,
    voucher,
    itemList,
    total,
  };
  await new Promise((res) => setTimeout(res, 3000));

  const orderNumber = await saveReceipt(data);
  throw redirect(`/receipt/${orderNumber}`);
  return null;
}
export function loader() {
  const checkoutPromise = getMyCheckouts("33333");
  return defer({ checkoutPromise });
}

export default function Checkout() {
  const dataPromise = useLoaderData();
  const { state } = useLocation();
  const navigation = useNavigation();
  const [currentCost, setCurrentCost] = useState(0);
  const [itemCounter, setItemCounter] = useState(0);
  const [itemList, setitemList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const tenMinFromNow = new Date().setMinutes(new Date().getMinutes() + 10);
  const [pickupTime, setPickupTime] = useState(tenMinFromNow);
  const [deliveryEstimation, setDeliveryEstimation] = useState();
  const discount = state?.discount || null;
  const discountUpto = state?.upto?.toFixed(2);
  const discountAmount = (discount / 100) * currentCost;
  const controlDiscount =
    discountAmount > discountUpto ? discountUpto : discountAmount;
  const finalCost = currentCost - controlDiscount;

  useEffect(() => {
    if (pickupTime == "later") setDeliveryEstimation(tenMinFromNow);
    else setDeliveryEstimation(pickupTime);
  }, [pickupTime]);

  function renderCheckouts(checkouts) {
    const checkoutElements = checkouts.map((checkout) => {
      useEffect(() => {
        setItemCounter(
          (prevItemCount) => prevItemCount + parseInt(checkout.quantity)
        );
        setitemList((prevList) => [
          ...prevList,
          {
            productId: checkout.productId,
            item: checkout.title,
            desc: checkout.desc,
            quantity: checkout.quantity,
            img: checkout.imgSrc,
            price: checkout.PERITEMCOST,
          },
        ]);
      }, []);
      return (
        <CheckoutProduct
          {...checkout}
          changeCost={setCurrentCost}
          changeItemCount={setItemCounter}
        />
      );
    });
    return checkoutElements;
  }

  function displayTimePicker() {
    setShowTimePicker((prevDisplay) => !prevDisplay);
  }

  function schedulePickup(value) {
    console.log(value);
    const [hr, mint] = value.split(":");
    let time = new Date(new Date().setHours(hr));
    time = time.setMinutes(mint);
    setPickupTime(time);
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
        <Suspense fallback={<h1>Loading...</h1>}>
          <Await resolve={dataPromise.checkoutPromise}>{renderCheckouts}</Await>
        </Suspense>

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
            <input
              type="radio"
              id="asap"
              name="checkout-time"
              onClick={() => setPickupTime("later")}
            />
          </div>

          <div className="checkout-time">
            <label htmlFor="later" onClick={displayTimePicker}>
              <p>Later</p>
              <small>
                {new Date(parseInt(pickupTime)).toLocaleTimeString()}
              </small>
            </label>
            {showTimePicker && (
              <TimePicker
                pickerDefaultValue={`${new Date().getHours()}:${new Date().getMinutes()}`}
                onChange={(value) => schedulePickup(value)}
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
          <button
            disabled={itemList.length ? false : true}
            className="button"
            form="checkout-form"
            type="submit"
          >
            Check out
          </button>
        </div>
      </div>

      {navigation.state == "submitting" && (
        <p className="form--waiting order-form-state">Redirecting...</p>
      )}

      <Form id="checkout-form" method="post">
        <input hidden readOnly type="number" name="price" value={currentCost} />
        <input
          hidden
          readOnly
          type="number"
          name="voucher"
          value={controlDiscount}
        />
        <input hidden readOnly type="number" name="total" value={finalCost} />
        {/* <input
          hidden
          readOnly
          type="text"
          name="deliveryTime"
          value={pickupTime}
        /> */}
        <input
          hidden
          readOnly
          type="text"
          name="payment-method"
          value={state?.payment || "COD"}
        />
        <input
          hidden
          readOnly
          type="text"
          name="itemList"
          value={JSON.stringify(itemList)}
        />
        <input
          hidden
          readOnly
          type="text"
          name="estimateTime"
          value={deliveryEstimation}
        />
      </Form>
    </>
  );
}
