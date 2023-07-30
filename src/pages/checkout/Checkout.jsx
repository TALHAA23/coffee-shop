import { Link } from "react-router-dom";
import CheckoutProduct from "../../components/CheckoutProduct";

export default function Checkout() {
  return (
    <div className="checkout-wrapper productDetailsWrapper ">
      <div className="productDetails--header">
        <Link to=".." relative="path">
          <img src="/icons/arrow-left.svg" />
        </Link>
        Checkout
      </div>

      <CheckoutProduct />

      <div className="checkout-sections">
        <h4 className="checkout-sections--headerText">
          When Do You Want Your Order?
        </h4>
        <small>*we are open form 8:00 - 20:00</small>

        <div className="checkout-time">
          <label htmlFor="asap">
            <p>As Soon as Possible</p>
            <small>Now - 10 Minutes</small>
          </label>
          <input type="radio" id="asap" name="checkout-time" />
        </div>

        <div className="checkout-time">
          <label htmlFor="later">
            <p>Later</p>
            <small>Schedule Pick Up</small>
          </label>
          <input type="radio" id="later" name="checkout-time" />
        </div>

        <div className="checkout--payment-method">
          <div>
            <p>Payment Method</p>
            <small>cash on delivery</small>
          </div>
          <img src="/icons/chevron-right.svg" />
        </div>
        <div className="checkout--voucher">
          <div>
            <p>Voucher</p>
            <small>no voucher added</small>
          </div>
          <img src="/icons/chevron-right.svg" />
        </div>

        <div className="checkout--payment-summary">
          <p>Payment Summary</p>
          <div className="payment-summery--details">
            <div className="paymentSummary--charges">
              <div>
                <p>price</p>
                <small>(1 Item)</small>
              </div>
              <p>$23.34</p>
            </div>
            <div className="paymentSummary--voucher">
              <p>voucher</p>
              <p>-5.00</p>
            </div>
            <div className="paymentSummary-total">
              <h4>Total</h4>
              <h4>$23.90</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="productDetails--footer">
        <div className="productDetails--footer--price">
          <small>Total</small>
          <h3>$23.24</h3>
        </div>
        <button className="button">Check out</button>
      </div>
    </div>
  );
}
