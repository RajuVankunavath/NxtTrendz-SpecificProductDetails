// Write your code here
import Cookies from 'js-cookie'
import {Component} from 'react'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    similarProductData: [],
    productData: {},
    count: 1,
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getProductItemsDetailsFromApi()
  }

  onClickIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onClickDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  getDetails = data => ({
    id: data.id,
    imageUrl: data.image_url,
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    price: data.price,
    rating: data.rating,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  onClickProductRoute = () => {
    const {history} = this.props
    history.replace('/products')
  }

  getProductItemsDetailsFromApi = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()

      const updatedData = this.getDetails(data)
      const similarProduct = data.similar_products.map(eachData =>
        this.getDetails(eachData),
      )
      this.setState({
        productData: updatedData,
        similarProductData: similarProduct,
        apiStatus: apiStatusConstant.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderAuthFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
        className="failure-logo"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <button
        className="failure-button"
        type="button"
        onClick={this.onClickProductRoute}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderAuthLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  getSimilarProduct = () => {
    const {similarProductData} = this.state
    return (
      <div className="main-container">
        <h1 className="heading">Similar Product</h1>
        <div className="similar-product-container">
          <ul className="similar-unordered-list-container">
            {similarProductData.map(eachData => (
              <SimilarProductItem
                key={eachData.id}
                similarDataDetails={eachData}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderAuthProductItemListViewe = () => {
    const {productData, count} = this.state
    console.log(productData)
    const {
      imageUrl,
      brand,
      title,
      totalReviews,
      rating,
      description,
      price,
      availability,
    } = productData

    return (
      <>
        <div className="product-main-item-container">
          <img src={imageUrl} alt="product" className="product-items-image" />
          <div>
            <div className="items-container">
              <h1 className="heading">{title}</h1>
              <p className="price">RS {price}/-</p>
              <div className="review-star-container">
                <div className="star-container">
                  <p className="rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="start"
                    className="star-logo"
                  />
                </div>
                <p className="price">{totalReviews} Reviews</p>
              </div>

              <p className="description">{description}</p>
              <p className="price">Available: {availability} </p>
              <p className="price">Brand :{brand}</p>
            </div>
            <div className="minus-plus-container">
              <button
                className="button-plus"
                type="button"
                data-testid="minus"
                onClick={this.onClickDecrement}
              >
                <BsDashSquare />
              </button>
              <p className="count">{count}</p>
              <button
                data-testid="plus"
                className="button-plus"
                type="button"
                onClick={this.onClickIncrement}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.getSimilarProduct()}
      </>
    )
  }

  renderAuthMainView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderAuthProductItemListViewe()
      case apiStatusConstant.inProgress:
        return this.renderAuthLoadingView()
      case apiStatusConstant.failure:
        return this.renderAuthFailure()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-items-container">
          {this.renderAuthMainView()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
