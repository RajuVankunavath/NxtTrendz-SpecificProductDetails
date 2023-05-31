import './index.css'

const SimilarProductItem = props => {
  const {similarDataDetails} = props
  const {imageUrl, brand, title, rating, price} = similarDataDetails
  return (
    <li className="similar-items-container">
      <img src={imageUrl} alt="similar product" className="sim-image" />
      <h1 className="title-heading">{title}</h1>
      <p className="brand">{brand}</p>
      <div className="rating-rate-container">
        <p className="price">RS {price}/-</p>
        <div className="star-count-container">
          <p className="star-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
            alt="star"
            className="star-logo"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
