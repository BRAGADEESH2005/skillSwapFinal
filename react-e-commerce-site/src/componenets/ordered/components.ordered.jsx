import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import "./components.ordered.css";

const Ordered = ({ orderedItems, fbProducts }) => {
  return (
    <div className="ordered-container">
      <h1>Your Order Summary</h1>
      <div className="ordered-grid">
        {orderedItems.map((item) => {
          const matchingProduct = fbProducts.find((product) => product.sku === item[0]);

          return (
            <div key={uuid()} className="ordered-card">
              {matchingProduct && (
                <>
                  <div>
                    <Link to={`/dresses/${matchingProduct.sku}`}>
                      <img src={matchingProduct.image} alt={matchingProduct.name} />
                    </Link>
                    <div className="ordered-product-info">
                      <h2>{matchingProduct.name}</h2>
                      <p>${matchingProduct.price}</p>
                    </div>
                  </div>
                  <div className="ordered-quantity">
                    <p>Quantity: {item[1]}</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="ordered-button-container">
        <Link to="/" className="ordered-button">Back to Shopping</Link>
      </div>
    </div>
  );
};

export default Ordered;
