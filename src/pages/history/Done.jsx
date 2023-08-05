import {
  Link,
  defer,
  useLoaderData,
  useOutletContext,
  Await,
} from "react-router-dom";
import { Suspense } from "react";
import { getAllReviewsTo } from "../../utils";
export async function loader() {
  return defer({ reviewsPromise: getAllReviewsTo() });
}

export default function Done() {
  const dataPromise = useLoaderData();
  const items = useOutletContext();

  function renderDones(reviews) {
    return items.map((item) => {
      const itemList = JSON.parse(item.itemList);
      console.log(reviews);
      return itemList.map((listItem) => {
        const reviewDone = reviews.find(
          (review) => review.from == item.id && review.to == listItem.productId
        );
        return (
          <div className="coffee-wrapper history-coffee-container">
            <div className="coffee-Img-and-rating">
              <div className="coffeeImg--backgorund"></div>
              <img className="coffeeImg" src={listItem.img} />
            </div>

            <div className="about-coffee">
              <h3>{listItem.item}</h3>
              <p className="about-coffee--description">{listItem.desc}</p>
              <div
                className={`status status-${
                  reviewDone ? "success" : "pending"
                }`}
              >
                {reviewDone ? "Success" : "Review pending"}
              </div>
            </div>

            <div className="coffee-price">
              <p className="coffee-price--current">${listItem.price}</p>
              <small>x{listItem.quantity}</small>
            </div>
            <Link
              to="/review"
              state={{ receiptId: item.id, productId: listItem.productId }}
              className="history--coffee--link"
            >
              {reviewDone ? "Update review" : "Review"}
            </Link>
          </div>
        );
      });
    });
  }

  return (
    <>
      {items.length ? (
        <Suspense fallback="loading...">
          <Await resolve={dataPromise.reviewsPromise}>{renderDones}</Await>
        </Suspense>
      ) : (
        <h1>No Product</h1>
      )}
    </>
  );
}
