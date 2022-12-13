import React, { useContext, useState, useEffect } from "react";
import { ICart } from "../../services/type.interface";
import AppContext from "../../AppContext";
import ListItems from "./list/ListItems";
import { getURLParam, numberCurrency } from "../../helpers/common";
import Loading from "../common/Loading";
import EmptyComponent from "../common/emptyComponent";
import Footer from "../common/footer/footer";

const Cart = () => {
  const GlobalStore: any = useContext(AppContext);
  const {
    myCarts,
    cartInfo,
    Navigate,
    prodService,
    Audience,
    MSFTToken,
    setStep,
    PluginRoute,
    productIDCONTACT,
  } = GlobalStore;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [carts, setCart] = useState<ICart[]>(null);
  const [lastComment, setLastComment] = useState<string>(null);
  const [from, setFrom] = useState<string>(getURLParam("from") || "");
  const [itemId, setItemId] = useState<string>(getURLParam("itemId") || "");
  const [prodId, setProdId] = useState<string>(getURLParam("prodId") || "");
  const [txtContact, setTxtContact] = useState<string>("");
  const [submitCartLoading, setSubmitCartLoading] = useState<boolean>(false);

  const clickUpdateCart = () => {};

  const generateQuote = () => {
    if (submitCartLoading === false && cartInfo.count > 0) {
      //can submit only once
      //console.log(carts);
      Navigate("/quote/quoteform");
    }
  };

  const onChangeComment = (e) => {
    var val = `${e.target.value}`;
    if (val !== lastComment) {
      setLastComment(val);
      prodService.UpdateCartComment(val).then((result) => {
        //console.log("saved comment ---->", val);
      });
    }
  };

  const GoBackToProduct = () => {
    Navigate(
      from === "product"
        ? `/product/detail?itemId=${itemId}&prodId=${prodId}`
        : `/products?aud=${Audience}`
    );
  };

  const clickEmptyCart = () => {
    prodService.EmptyCarts().then((result) => {
      setTxtContact("");
    });
  };

  useEffect(() => {
    //console.log("mycarts", myCarts);
    if (myCarts && myCarts?.length > 0) {
      setTxtContact(myCarts[0].lvt_comments);
      for (let i = 0; i < myCarts?.length; i++) {
        const cart = myCarts[i].cartItems.find((item) => {
          return item.lvt_Product.lvt_name.toLowerCase().includes("contact");
        });
        if (cart) {
          //console.log("cart: ", cart);
          if (cart.lvt_name) {
            let comment = "";
            for (let i = 0; i < myCarts?.length; i++) {
              if (myCarts[i]?.lvt_comments) {
                const itemArr = myCarts[i]?.lvt_comments?.split(cart.lvt_name);
                if (itemArr.length > 1) {
                  comment = myCarts[i].lvt_comments;
                  i = myCarts.length;
                } else {
                  comment =
                    myCarts[i].lvt_comments != " "
                      ? myCarts[i].lvt_comments
                      : cart.lvt_name;
                  i = myCarts.length;
                }
              } else {
                comment = cart.lvt_name;
                i = myCarts.length;
              }
            }
            setTxtContact(comment);
          }
          i = myCarts?.length;
        }
      }
    }

    setCart(myCarts);
    setLastComment(
      `${(myCarts && myCarts.length > 0 && myCarts[0].lvt_comments) || ""}`
    );
    setStep(3);
  }, [myCarts]);

  return (
    <div className="MyCartSection">
      <div className="MyCartContainer">
        <div className="ItemsListContainer">
          <div className="Header">
            <div className="title">
              <h1>Your Cart</h1>
            </div>
            {carts && carts?.length > 0 && (
              <div className="QuantityPrice">
                <div className="Quantity">
                  <b>QTY</b>
                </div>
                <div className="Price">
                  <div>
                    <b>Price (ex. GST)</b>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="MyCartBody">
            {isLoading && <Loading />}

            {carts && carts?.length > 0 ? (
              carts.map((cart) => (
                <ListItems
                  prodService={prodService}
                  MSFTToken={MSFTToken}
                  cartItem={cart}
                />
              ))
            ) : (
              <EmptyComponent
                componentName="cart"
                linkUrl={PluginRoute + "/products"}
                linkText={"Continue shopping."}
              />
            )}
          </div>
        </div>
        <div className="CalculatingPrice">
          <div className="CalculatingPriceContainer">
            <div className="SummaryContainer">
              <div className="Title">
                <h2>Order Summary</h2>
              </div>

              <div className="Items">
                <div className="subTitle">Cart Number:</div>
                <div className="right-value">{cartInfo.code}</div>
              </div>

              <div className="Items Items-count">
                <div className="subTitle count">
                  Items<span>: </span>
                </div>
                <div className="right-value">{cartInfo.count}</div>
              </div>

              <div className="Items">
                <div className="subTitle">Delivery:</div>
                <div className="right-value">Free</div>
              </div>

              <div className="Items">
                <div className="subTitle">Estimated Tax:</div>
                <div className="right-value">
                  {numberCurrency(cartInfo.tax)}
                </div>
              </div>

              <div className="Items mobile subtotal">
                <div className="subTitle">Subtotal:</div>
                <div className="right-value">
                  {numberCurrency(cartInfo.subtotal)}
                </div>
              </div>

              <div className="Items textarea">
                <textarea
                  onMouseLeave={(e) => onChangeComment(e)}
                  defaultValue={txtContact}
                  placeholder="Add any comments necessary for your purchase order"
                ></textarea>
              </div>

              <div className="GenerateBtn">
                {submitCartLoading ? (
                  <Loading />
                ) : (
                  <button
                    className={cartInfo.count > 0 ? "" : "disabled"}
                    onClick={generateQuote}
                  >
                    Generate Quote<span> / Submit Order</span>
                  </button>
                )}
              </div>
            </div>
            <div className="SummaryBottomContainer">
              <div className="additional-btn">
                <p>
                  <button onClick={() => clickEmptyCart()}>Empty Cart</button>
                </p>
                <p>
                  <button onClick={() => GoBackToProduct()}>
                    Continue Shopping
                  </button>
                </p>
              </div>
              {/* <p className="contact">Need help?</p>
              <p>Call 1800 267 785</p> */}
            </div>
          </div>
        </div>
      </div>

      <div className="cart-footer">
        <Footer />
      </div>
    </div>
  );
};

export default Cart;
