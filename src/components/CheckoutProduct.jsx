export default function CheckoutProduct() {
  // same as Product just few classes for different style
  return (
    <div className="checkout-coffee-wrapper coffee-wrapper">
      <div className="coffee-Img-and-rating">
        <div className="coffeeImg--backgorund"></div>
        <img className="coffeeImg" src="/coffee-images/caffe-mocha.png" />
      </div>

      <div className="about-coffee">
        <h3>Coffee title</h3>
        <p className="about-coffee--description">
          this is a long desc that you are reading huuh
        </p>
        <div className="checkout--edit">
          <img src="/icons/edit.svg" />
          <p className="checkout--edit--text">Edit</p>
        </div>
      </div>

      <div className="coffee-price">
        <p className="coffee-price--current">23.32</p>
        <small>x1</small>
        <div className="checkout--trash-and-counter">
          <img src="/icons/trash.svg" />
          <div className="counter checkout--counter">
            <div className="counter--button">-</div>
            <div className="counter--display">23</div>
            <div className="counter--button">+</div>
          </div>
        </div>
      </div>
    </div>
  );
}
