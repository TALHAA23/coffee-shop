import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserUid } from "../../hooks/UserProvider";
export default function PaymentMethod() {
  const { userUid } = useUserUid();
  const [showBanks, setShowBanks] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const { state } = useLocation();
  const navigate = useNavigate();

  function toggleBanks() {
    setShowBanks((prevState) => !prevState);
  }

  function changePaymentMethod(event) {
    const { value } = event.target;
    setPaymentMethod(value);
  }

  function backToCheckout() {
    navigate(`..?auth=${userUid}`, {
      state: { ...state, payment: paymentMethod },
    });
  }

  return (
    <div className="checkout-wrapper productDetailsWrapper ">
      <div className="productDetails--header">
        <Link to=".." relative="path">
          <img src="/icons/arrow-left.svg" />
        </Link>
        Payment Method
      </div>

      <div className="payment-methods">
        <div>
          <label htmlFor="COD">
            <div className="paymentMethod--icon-and-text">
              <img
                className="paymentMethod--icon"
                src="/icons/money-bill-1-solid.svg"
              />
              <p>Cash on delivery</p>
            </div>
          </label>

          <input
            type="radio"
            id="COD"
            name="payment-method"
            value="COD"
            onChange={(e) => changePaymentMethod(e)}
          />
        </div>
        <hr />
        <div className="paymentMethod--banks">
          <label htmlFor="bank" onClick={toggleBanks}>
            <div className="paymentMethod--icon-and-text">
              <img className="paymentMethod--icon" src="/icons/transfer.svg" />
              <p>Bank Transfer</p>
            </div>
          </label>
          <img src={`/icons/chevron-${showBanks ? "up" : "down"}.svg`} />
          <input
            hidden
            type="radio"
            id="bank"
            name="payment-method"
            value="bank-transfer"
            onChange={(e) => changePaymentMethod(e)}
          />
          <div
            className={`paymentMethod--availableBanks ${
              showBanks ? "showBanks" : ""
            }`}
          >
            <div>
              <img src="/other-images/bank-1.png" /> Bank BCA{" "}
            </div>
            <hr />
            <div>
              <img src="/other-images/bank-2.png" /> Bank Mandiri{" "}
            </div>
            <hr />
            <div>
              <img src="/other-images/bank-3.png" /> Bank BNI{" "}
            </div>
            <hr />
          </div>
        </div>
        <hr />
      </div>
      <h3 className="selected-paymentMethod">
        Payment Method: {paymentMethod}
      </h3>
      <button className="button bottomRightButton" onClick={backToCheckout}>
        Confirm
      </button>
    </div>
  );
}
