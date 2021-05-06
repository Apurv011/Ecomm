import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";
import StripeCheckout from "react-stripe-checkout";

function Checkout() {
  let history = useHistory();

  const [cartItems, setCartItems] = useState([]);
  const [count, setCount] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/cart/")
      .then((res) => {
        setCartItems(res.data.cart);
        setCount(res.data.count);
      })
      .catch((error) => console.log(error));
  });

  var itemsPrice = 0;
  itemsPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

  function handleChange(event) {
    setPaymentMethod(event.target.value);
  }

  function showSuccess() {
    axios.delete("http://localhost:5000/cart/").then((res) => {
      console.log(res);
    });
    setCartItems([]);
    history.push("/success");
  }

  async function handleToken(token) {
    var response = await axios.post("http://localhost:5000/orders/checkout", {
      token,
      itemsPrice,
    });

    if (response.data.status === "success") {
      axios.delete("http://localhost:5000/cart/").then((res) => {
        console.log(res);
      });
      setCartItems([]);
      history.push("/success");
    } else {
      alert("Error!");
    }
  }

  return (
    <body>
      <div className="container ch-container">
        <div className="py-4 text-center">
          <img
            className="d-block mx-auto mb-4"
            src="images/Logo.PNG"
            height="100px"
            alt=""
          />
        </div>
        <div>
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span>
              <strong>Your cart</strong>
            </span>
            <span className="badge badge-dark badge-pill">{count}</span>
          </h4>
          <ul className="list-group mb-3 sticky-top">
            {cartItems.map((cartItems, index) => {
              return (
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                  <div>
                    <h6 className="my-0">{cartItems.name}</h6>
                    <small className="text-muted">
                      Quantity: {cartItems.quantity}
                    </small>
                  </div>
                  <span className="text-muted">
                    ₹ {cartItems.quantity * cartItems.price}
                  </span>
                </li>
              );
            })}
            <li className="list-group-item d-flex justify-content-between">
              <strong>Total</strong>
              <strong>₹ {itemsPrice}</strong>
            </li>
          </ul>
        </div>
        <form style={{ borderColor: "#000000" }} className="payment-option">
          <h4 className="mb-3">
            <p>Select Payment Method</p>
          </h4>
          <div className="form-check">
            <input
              onChange={handleChange}
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="exampleRadios3"
              value="option1"
            />
            <label className="form-check-label" for="exampleRadios2">
              Cash On Delivery
            </label>
          </div>
          <div className="form-check">
            <input
              onChange={handleChange}
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="exampleRadios2"
              value="option2"
            />
            <label className="form-check-label" for="exampleRadios2">
              Pay With Card
            </label>
          </div>
        </form>
        <div style={{ marginTop: "40px" }}>
          {paymentMethod === "option2" && (
            <div style={{ paddingBottom: "140px" }}>
              <StripeCheckout
                stripeKey={process.env.REACT_APP_STRIPE_KEY}
                token={handleToken}
                billingAddress
                shippingAddress
                amount={itemsPrice}
              >
                <button type="button" class="btn btn-outline-dark btn-lg">
                  Pay Now
                </button>
              </StripeCheckout>
            </div>
          )}
          {paymentMethod === "option1" && (
            <div style={{ paddingBottom: "20px" }}>
              <form
                style={{ borderColor: "#000000" }}
                className="payment-option"
              >
                <div className="mb-3">
                  <label
                    for="email"
                    style={{ color: "#000000" }}
                    className="form-label"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter Email"
                  />
                </div>
                <div className="mb-3">
                  <label
                    for="contact"
                    style={{ color: "#000000" }}
                    className="form-label"
                  >
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="email"
                    className="form-control"
                    placeholder="Enter Number"
                  />
                </div>
                <div className="mb-3">
                  <label
                    for="address"
                    className="form-label"
                    style={{ color: "#000000" }}
                  >
                    Address
                  </label>
                  <textarea
                    name="deliveryAddress"
                    rows="3"
                    type="text"
                    id="address"
                    className="form-control text-break"
                    placeholder="Address"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label style={{ color: "#000000" }} className="form-label">
                    Amount to be paid:
                  </label>
                  <input
                    type="text"
                    name="total"
                    value={itemsPrice}
                    className="form-control"
                  />
                </div>
                <button
                  type="button"
                  onClick={showSuccess}
                  className="btn btn-outline-dark btn-lg"
                >
                  Place Your Order!
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </body>
  );
}

export default Checkout;
