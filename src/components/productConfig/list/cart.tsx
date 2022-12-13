import React, { useState, useEffect, Fragment } from "react";
import { numberCurrency } from "../../../helpers/common";

interface CartProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  isEditable?: boolean;
  showQuantityPrice: boolean;
  quantity: number;
  price: number;
  id?: string;
  onChangeQuantity?: (
    quantity: number,
    totalprice: number,
    id?: string
  ) => void;
  onChangeCount?: number;
}

const Cart = ({
  isEditable = true,
  showQuantityPrice,
  quantity,
  price,
  id,
  onChangeQuantity,
  onChangeCount,
  children,
}: CartProps) => {
  const [myprice, setMyPrice] = useState<number>(0);
  const [myquantity, setMyQuantity] = useState<number>(1);
  const [mytotalprice, setMyTotalPrice] = useState<number>(0);
  const [errorTxt, setErrorTxt] = useState<string>("");

  const onMyChangeQuantity = (e) => {
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex

    if (e.target.value === "" || re.test(e.target.value)) {
      //console.log("Count: ", e.target.value);
      setMyTotalPrice(
        myprice * (e.target.value ? parseInt(e.target.value) : 1)
      );
      setMyQuantity(e.target.value);
      onChangeQuantity(
        e.target.value ? parseInt(e.target.value) : 1,
        myprice,
        id
      );
    }
  };

  useEffect(() => {
    //console.log("I am here cart");
    setMyPrice(price);
    setMyQuantity(quantity);
    setMyTotalPrice(price * quantity);
  }, [
    price,
    quantity,
    onChangeCount, // This will trigger the reload of the cart list
  ]);
  return (
    <div className="msft-cart-list">
      <div className="msft-cart-container">{children}</div>
      <div className="quality-price">
        {showQuantityPrice && (
          <Fragment>
            <div className="quantity">
              {isEditable ? (
                <input
                  value={myquantity}
                  onChange={(e) => onMyChangeQuantity(e)}
                />
              ) : (
                <span
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "none",
                    width: "57px",
                    height: "20px",
                    textAlign: "center",
                    fontSize: "15px",
                    fontWeight: "normal",
                  }}
                >
                  {myquantity}
                </span>
              )}
              {errorTxt && <span className="error">{errorTxt}</span>}
            </div>
            <div className="price">{numberCurrency(mytotalprice)}</div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Cart;
