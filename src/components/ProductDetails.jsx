import {
  Form,
  defer,
  useLoaderData,
  Await,
  Link,
  useActionData,
  useNavigation,
  useLocation,
  Navigate,
  redirect,
} from "react-router-dom";
import { getProductById } from "../utils";
import { Suspense, useEffect, useState } from "react";
import { TOPPING } from "../pages/Constants";
import { saveOrder } from "../utils";
import { useUser } from "../hooks/UserProvider";

export function loader({ params }) {
  const productId = params.id;
  const productDetailsPromise = getProductById(productId);
  return defer({ productDetailsPromise });
}

export async function action({ request }) {
  const formData = await request.formData();
  // const id = formData.get("id");
  const title = formData.get("title");
  const desc = formData.get("desc");
  const total = formData.get("total");
  const quantity = formData.get("quantity");
  const imgSrc = formData.get("imgSrc");
  const PERITEMCOST = formData.get("PERITEMCOST");
  const orderInfo = {
    // id,
    auth: useUser(),
    PERITEMCOST,
    imgSrc,
    title,
    desc,
    total,
    quantity,
  };

  try {
    const orderNumber = await saveOrder(orderInfo).then((res) => res);
    localStorage.setItem("orderNumber", orderNumber);
    throw redirect("/");
  } catch (err) {
    return err;
  }
}

export default function ProductDetails() {
  const actionResponse = useActionData();
  const { state } = useLocation();

  const navigation = useNavigation();
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
        {actionResponse && (
          <p className="form-success order-form-state">
            {actionResponse.message}
          </p>
        )}
        {navigation.state == "submitting" && (
          <p className="form--waiting order-form-state">Please Wait...</p>
        )}
        <div className="productDetails--header">
          <Link to={`..?${state?.search}`} relative="path">
            <img src="/icons/arrow-left.svg" />
          </Link>
          Customize Order
        </div>
        <div className="productDetails--imgBg">
          <img src={props.imgUrl} alt="" />
        </div>

        <Form method="post" className="orderForm">
          <div className="orderForm--aboutProduct">
            <h4 className="orderForm--sectionTitle">{props.origin}</h4>
            <div className="aboutProduct--title-price">
              <h3>{props.title}</h3>
              <h3>${currentCost?.toFixed(2)}</h3>
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
                <input type="radio" name="varient" id="ice" value="ice" />
                <label htmlFor="ice">Ice</label>
                <input type="radio" name="varient" id="hot" value="hot" />
                <label htmlFor="hot">Hot</label>
              </div>
            </div>

            <div className="orderForm--inputwrapper customize--radio">
              <p>Size</p>
              <div className="orderForm--option">
                <input type="radio" name="size" id="regular" value="regular" />
                <label htmlFor="regular">Regular</label>
                <input type="radio" name="size" id="medium" value="medium" />
                <label htmlFor="medium">Medium</label>
                <input type="radio" name="size" id="large" value="large" />
                <label htmlFor="large">Large</label>
              </div>
            </div>

            <div className="orderForm--inputwrapper customize--radio">
              <p>Suger</p>
              <div className="orderForm--option">
                <input
                  type="radio"
                  name="suger"
                  id="suger-normal"
                  value="normal"
                />
                <label htmlFor="suger-normal">Normal</label>
                <input type="radio" name="suger" id="suger-less" value="less" />
                <label htmlFor="suger-less">Less</label>
              </div>
            </div>

            <div className="orderForm--inputwrapper customize--radio">
              <p>Ice</p>
              <div className="orderForm--option">
                <input type="radio" name="ice" id="ice-normal" value="normal" />
                <label htmlFor="ice-normal">Normal</label>
                <input type="radio" name="ice" id="ice-less" value="less" />
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
                  name="extra-expressa"
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
                  name="cincau"
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
                  name="coffee-jelly"
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
                  name="chocolate-ice-cream"
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
                maxLength="100"
              ></textarea>
            </div>
          </div>

          <div className="productDetails--footer">
            <div className="productDetails--footer--price">
              <small>Total</small>
              <h3>${currentCost?.toFixed(2)}</h3>
            </div>
            <button
              className="button"
              disabled={navigation.state == "submitting" ? true : false}
            >
              {navigation.state == "submitting"
                ? "Adding Order..."
                : "Add Order"}
            </button>
          </div>

          <div className="hiddenInputs">
            {/* <input hidden readOnly type="text" name="id" value="11111" /> */}
            <input
              hidden
              readOnly
              type="text"
              name="imgSrc"
              value={props.imgUrl}
            />
            <input
              hidden
              readOnly
              type="number"
              name="PERITEMCOST"
              value={productPrice + totalToppingCost}
            />
            <input
              hidden
              readOnly
              type="number"
              name="total"
              value={currentCost || 0}
            />
            <input
              hidden
              readOnly
              type="number"
              name="topping"
              value={totalToppingCost}
            />
            <input
              hidden
              readOnly
              type="number"
              name="quantity"
              value={counter}
            />
            <input
              hidden
              readOnly
              type="text"
              name="title"
              value={props.title}
            />
            <input hidden readOnly type="text" name="desc" value={props.desc} />
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
