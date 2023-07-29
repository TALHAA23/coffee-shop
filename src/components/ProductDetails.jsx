import { Form, defer, useLoaderData, Await } from "react-router-dom";
import { getProductById } from "../utils";
import { Suspense, useEffect, useState } from "react";
import { TOPPING } from "../pages/Constants";

export function loader({ params }) {
  const productId = params.id;
  const productDetailsPromise = getProductById(productId);
  return defer({ productDetailsPromise });
}

export default function ProductDetails() {
  const dataPromise = useLoaderData();
  const [counter, setCounter] = useState(1);
  const [currentCost, setCurrentCost] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [totalToppingCost, setTotalToppingCost] = useState(0);

  function incrementCount() {
    setCounter((prevCount) => prevCount + 1);
    setCurrentCost((prevCost) => prevCost + productPrice + totalToppingCost);
  }
  function decrementCount() {
    if (counter - 1 == 0) return;
    setCounter((prevCount) => prevCount - 1);
    setCurrentCost((prevCost) => prevCost - productPrice - totalToppingCost);
  }

  function handleChangeInPrice(event) {
    const { value, checked } = event.target;
    const currenToppingCost = parseFloat(value);

    if (checked) {
      setCurrentCost((prevCost) => prevCost + currenToppingCost * counter);
      setTotalToppingCost(
        (prevToppingCost) => prevToppingCost + currenToppingCost
      );
    } else {
      setCurrentCost((prevCost) => prevCost - currenToppingCost * counter);
      setTotalToppingCost(
        (prevToppingCost) => prevToppingCost - currenToppingCost
      );
    }
  }

  function renderProductDetails(props) {
    useEffect(() => {
      setCurrentCost(props.price.salePrice || props.price.originalPrice);
      setProductPrice(props.price.salePrice || props.price.originalPrice);
    }, []);
    return (
      <div className="productDetailsWrapper">
        <div className="productDetails--header">
          <img src="/icons/arrow-left.svg" /> Customize Order
        </div>
        <div className="productDetails--imgBg">
          <img src={props.imgUrl} alt="" />
        </div>

        <Form className="orderForm">
          <div className="orderForm--aboutProduct">
            <h4 className="orderForm--sectionTitle">{props.origin}</h4>
            <div className="aboutProduct--title-price">
              <h3>{props.title}</h3>
              <h3>{`$${currentCost}`}</h3>
            </div>
            <div className="aboutProduct--desc-counter">
              <p>{props.desc} </p>
              <div className="counter">
                <div className="counter--button" onClick={decrementCount}>
                  -
                </div>
                <div className="counter--display">{counter}</div>
                <div className="counter--button" onClick={incrementCount}>
                  +
                </div>
              </div>
            </div>
            <div className="aboutProducts--rating">
              <div className="aboutProducts--rating--detials">
                <img src="/icons/star-yellow.svg" /> <b>{props.rating}</b>{" "}
                <span>(23)</span>
                <span className="dot-divider"></span>{" "}
                <span>Rating and reviews</span>
              </div>
              <div className="aboutProducts--rating--button">
                <img src="/icons/chevron-right.svg" />
              </div>
            </div>
          </div>
          <div className="orderForm--customize">
            <h4 className="orderForm--sectionTitle">Customize</h4>
            <div className="orderForm--inputwrapper customize--radio">
              <p>Varinet</p>
              <div className="orderForm--option">
                <input type="radio" name="varient" id="ice" />
                <label htmlFor="ice">Ice</label>
                <input type="radio" name="varient" id="hot" />
                <label htmlFor="hot">Hot</label>
              </div>
            </div>

            <div className="orderForm--inputwrapper customize--radio">
              <p>Size</p>
              <div className="orderForm--option">
                <input type="radio" name="size" id="regular" />
                <label htmlFor="regular">Regular</label>
                <input type="radio" name="size" id="medium" />
                <label htmlFor="medium">Medium</label>
                <input type="radio" name="size" id="large" />
                <label htmlFor="large">Large</label>
              </div>
            </div>

            <div className="orderForm--inputwrapper customize--radio">
              <p>Suger</p>
              <div className="orderForm--option">
                <input type="radio" name="suger" id="suger-normal" />
                <label htmlFor="suger-normal">Normal</label>
                <input type="radio" name="suger" id="suger-less" />
                <label htmlFor="suger-less">Less</label>
              </div>
            </div>

            <div className="orderForm--inputwrapper customize--radio">
              <p>Ice</p>
              <div className="orderForm--option">
                <input type="radio" name="ice" id="ice-normal" />
                <label htmlFor="ice-normal">Normal</label>
                <input type="radio" name="ice" id="ice-less" />
                <label htmlFor="ice-less">Less</label>
              </div>
            </div>
          </div>

          <div className="orderForm--topping">
            <h4 className="orderForm--sectionTitle">Topping</h4>

            <div className="orderForm--inputwrapper">
              <p>Extra Expressa</p>
              <div className="orderForm--option">
                <label htmlFor="extra-expressa">{`$${TOPPING.ExtraExpressa}`}</label>
                <input
                  type="checkbox"
                  id="extra-expressa"
                  value={TOPPING.ExtraExpressa}
                  onChange={(e) => handleChangeInPrice(e)}
                />
              </div>
            </div>

            <div className="orderForm--inputwrapper">
              <p>Cincau</p>
              <div className="orderForm--option">
                <label htmlFor="cincau">{`$${TOPPING.Cincau}`}</label>
                <input
                  type="checkbox"
                  id="cincau"
                  value={TOPPING.Cincau}
                  onChange={(e) => handleChangeInPrice(e)}
                />
              </div>
            </div>
            <div className="orderForm--inputwrapper">
              <p>Coffee Jelly</p>
              <div className="orderForm--option">
                <label htmlFor="coffee-jelly">{`$${TOPPING.CoffeeJelly}`}</label>
                <input
                  type="checkbox"
                  id="coffee-jelly"
                  value={TOPPING.CoffeeJelly}
                  onChange={(e) => handleChangeInPrice(e)}
                />
              </div>
            </div>
            <div className="orderForm--inputwrapper">
              <p>Chocolate Ice Cream</p>
              <div className="orderForm--option">
                <label htmlFor="chocolate-ice-cream">{`$${TOPPING.ChocolateIceCream}`}</label>
                <input
                  type="checkbox"
                  id="chocolate-ice-cream"
                  value={TOPPING.ChocolateIceCream}
                  onChange={(e) => handleChangeInPrice(e)}
                />
              </div>
            </div>
          </div>
          <div className="orderForm--notes">
            <div className="orderForm--inputwrapper">
              <p>Notes</p>
              <textarea
                name="notes"
                placeholder="optional"
                cols="10"
                rows="10"
              ></textarea>
            </div>
          </div>

          <div className="productDetails--footer">
            <div className="productDetails--footer--price">
              <small>Total</small>
              <h3>{`$${currentCost}`}</h3>
            </div>
            <button>Add Order</button>
          </div>
        </Form>
      </div>
    );
  }
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Await resolve={dataPromise.productDetailsPromise}>
        {renderProductDetails}
      </Await>
    </Suspense>
  );
}
