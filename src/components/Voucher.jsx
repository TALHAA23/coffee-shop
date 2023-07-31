export default function Voucher(props) {
  const spending = parseFloat(props.spending);
  const invalidVoucherStyle = {
    color: "red",
  };

  const discount = {
    disc: props.disc,
    upto: props.upto,
  };

  return (
    <label className="coffee-wrapper voucher">
      <div className="coffee-Img-and-rating">
        <img src="/other-images/voucher.png" />
      </div>

      <div className="about-coffee">
        <h3>{props.title} </h3>
        <p
          className="about-coffee--description"
          style={props.minimumPurchase > spending ? invalidVoucherStyle : null}
        >
          {props.desc}
        </p>
      </div>

      <div className="coffee-price">
        <input
          type="radio"
          name="voucher"
          onChange={() => props.changeVoucher(discount)}
          disabled={spending < props.minimumPurchase ? true : false}
        />
      </div>
    </label>
  );
}
