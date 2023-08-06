import { Link, useOutletContext } from "react-router-dom";
import { isReviewDone } from "../../utils";
export async function loader() {
  // const data = await isReviewDone(
  //   "ropMjqXwfPUpip6oeoY0",
  //   "pSmIFIxhUKa3w1vEelrB"
  // );
  // console.log(data);
  return null;
}

export default function Process() {
  const items = useOutletContext();
  const containers = items.map((item) => {
    const itemList = JSON.parse(item.itemList);
    return itemList.map((listItem) => (
      <div className="coffee-wrapper history-coffee-container">
        <div className="coffee-Img-and-rating">
          <div className="coffeeImg--backgorund"></div>
          <img className="coffeeImg" src={listItem.img} />
        </div>

        <div className="about-coffee">
          <h3>{listItem.item}</h3>
          <p className="about-coffee--description">{listItem.desc}</p>
        </div>

        <div className="coffee-price">
          <p className="coffee-price--current">${listItem.price}</p>
          <small>x{listItem.quantity}</small>
        </div>
        <Link to={`/receipt/${item.id}`} className="history--coffee--link">
          Tracking order
        </Link>
      </div>
    ));
  });
  return (
    <>
      {items.length ? (
        <div>{containers}</div>
      ) : (
        <div className="notfound--wrapper history-coffee-container--no-process">
          <h1>Nothing in Process</h1>
          <img src="/gifs/coffee-glass.gif" alt="" />
        </div>
      )}
    </>
  );
}
