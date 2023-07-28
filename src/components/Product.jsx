export default function Product(props) {
  return (
    <div className="coffee-wrapper">
      <div className="coffee-Img-and-rating">
        <div className="coffeeImg--backgorund"></div>
        <img className="coffeeImg" src={props.imgUrl} />
        <div className="coffee--rating">
          <img src="/icons/star-yellow.svg" />
          <span>{props.rating}</span>
        </div>
      </div>

      <div className="about-coffee">
        <h3>{props.title}</h3>
        <p className="about-coffee--description">{props.desc}</p>
      </div>

      <div className="coffee-price">
        <p className="coffee-price--current">
          {`$${props.price.salePrice || props.price.originalPrice}`}
        </p>
        {props.price.salePrice > 0 && (
          <p className="cofee-price--old">{`$${props.price.originalPrice}`}</p>
        )}
      </div>
    </div>
  );
}