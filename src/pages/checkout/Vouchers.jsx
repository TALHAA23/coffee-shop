import { vouchers } from "../Constants";

import { Link, useLocation, useNavigate } from "react-router-dom";
import Voucher from "../../components/Voucher";
import { useState } from "react";
export default function Vouchers() {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const currentSpend = state.spending;

  function changeVoucher(discount) {
    setSelectedVoucher(discount);
  }

  function backToCheckout() {
    navigate("..", {
      state: {
        ...state,
        discount: selectedVoucher?.disc,
        upto: selectedVoucher?.upto,
      },
    });
  }

  const voucherEl = vouchers.map((voucher) => (
    <Voucher
      {...voucher}
      spending={currentSpend}
      changeVoucher={changeVoucher}
    />
  ));
  return (
    <div className="checkout-wrapper productDetailsWrapper ">
      <div className="productDetails--header">
        <Link to=".." relative="path">
          <img src="/icons/arrow-left.svg" />
        </Link>
        Vouchers
      </div>
      {voucherEl}

      <button className="button bottomRightButton" onClick={backToCheckout}>
        Confirm
      </button>
    </div>
  );
}
