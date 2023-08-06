import { useEffect, useState } from "react";
import { deleteCheckoutById } from "../utils";
import { useRef } from "react";
export default function CheckoutProduct(props) {
  const container = useRef();
  const { changeCost, changeItemCount, changeItemList, PERITEMCOST } = props;
  const [counter, setCounter] = useState(
    JSON.parse(localStorage.getItem("perItemQuantityRef"))?.[props.title] ||
      parseInt(props.quantity)
  );

  useEffect(() => {
    changeCost((prevCost) => prevCost + parseFloat(PERITEMCOST) * counter);
  }, []);

  useEffect(() => {
    changeItemList((prevList) => {
      return prevList.map((item) => ({ ...item, quantity: counter }));
    });
  }, [counter]);

  useEffect(() => {
    localStorage.setItem(
      "perItemQuantityRef",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("perItemQuantityRef")),
        [props.title]: counter,
      })
    );
  }, [counter]);

  function incrementCount() {
    setCounter((prevCount) => prevCount + 1);
    changeItemCount((prevItemCount) => prevItemCount + 1);
    changeCost((prevCost) => prevCost + parseFloat(props.PERITEMCOST));
  }
  function decrementCount() {
    if (counter - 1 == 0) return;
    setCounter((prevCount) => prevCount - 1);
    changeItemCount((prevItemCount) => prevItemCount - 1);
    changeCost((prevCost) => prevCost - parseFloat(props.PERITEMCOST));
  }

  async function deleteCheckout() {
    try {
      container.current.style.opacity = ".4";
      container.current.style.cursor = "not-allowed";
      await deleteCheckoutById(props.orderNumber);
      const newItemList = [];
      changeItemList((prevList) => {
        for (let item of prevList)
          if (item.productId != props.productId) newItemList.push(item);
        return [...newItemList];
      });
      changeCost((prevCost) => prevCost - PERITEMCOST * counter);
      container.current.remove();
    } catch (err) {
      container.current.style.opacity = "1";
      container.current.style.cursor = "pointer";
      return null;
    }
  }

  return (
    <div ref={container} className="checkout-coffee-wrapper coffee-wrapper">
      <div className="coffee-Img-and-rating">
        <div className="coffeeImg--backgorund"></div>
        <img className="coffeeImg" src={props.imgSrc} />
      </div>

      <div className="about-coffee">
        <h3>{props.title}</h3>
        <p className="about-coffee--description">{props.desc}</p>
        {/* <div className="checkout--edit">
          <img src="/icons/edit.svg" />
          <p className="checkout--edit--text">Edit</p>
        </div> */}
      </div>

      <div className="coffee-price">
        <p className="coffee-price--current">${PERITEMCOST}</p>
        <small>x{counter}</small>
        <div className="checkout--trash-and-counter">
          <img onClick={deleteCheckout} src="/icons/trash.svg" />
          <div className="counter checkout--counter">
            <div className="counter--button" onClick={decrementCount}>
              -
            </div>
            <div className="counter--display">{counter}</div>
            <div className="counter--button" onClick={incrementCount}>
              +
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
