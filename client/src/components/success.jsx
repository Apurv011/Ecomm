import React from "react";
import "./success.css";

function success() {
  return (
    <body>
      <div className="mm">
        <i className="checkmark">✓</i>
      </div>
      <div>
        <h1 className="vv">
          Success
          <br />
          Thank you for shopping with us.
        </h1>
        <p className="pp">
          We have received your order.
          <br />
          It will reach you shortly.
          <br />
          <br />
          <a href="/products/Laptop" type="button" class="btn btn-success">
            Continue Shopping
          </a>
        </p>
      </div>
    </body>
  );
}

export default success;
