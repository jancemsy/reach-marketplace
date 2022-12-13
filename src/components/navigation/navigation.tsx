import React, { useContext, useEffect } from "react";
import { Icon } from "office-ui-fabric-react";
import AppContext from "../../AppContext";

const navigation = () => {
  const GlobalStore: any = useContext(AppContext);
  const { myCarts, cartInfo, Navigate, setStep, step } = GlobalStore;

  /*
  transfered to prodservice for global use
    useEffect(() => {
    if(myCarts?.length > 0){
      countItems();
    }
  }, [myCarts]);
  const countItems = () => {
    let newCount = 0;
    myCarts.forEach((cart: any) => {
      cart.cartItems.forEach((item) => {
        if(productIDNONE !== item._lvt_product_value){
          newCount += parseFloat(item.lvt_qty);
        }
      });
    });
    setItemCount(newCount);
  }*/

  const getTitle = () => {
    let _title = "";
    switch (step) {
      case 2:
        _title = "Select Product";
        break;
      case 3:
        _title = "Review Cart";
        break;
      case 4:
        _title = "Generate Quote";
        break;

      default:
        _title = "Select Category";
    }
    return _title;
  };

  const onNavigateToQuote = (url) => {
    if (cartInfo.cartId) Navigate(url);
  };

  const onClick = (section, step) => {
    setStep(step);
    Navigate(`/${section}`);
  };

  const clickGoback = () => {
    if (step == 4) {
      Navigate(`/cart`);
    } else if (step == 3) {
      Navigate(`/products`);
    } else {
      //if(step == 2)
      Navigate(`/`);
    }
  };

  return (
    <div className="navigation">
      <div className="navigation-mobile-container" style={{ display: "none" }}>
        <div className="navigation-mobile">
          {step !== 1 && (
            <div className="previous-btn" onClick={() => clickGoback()}>
              <Icon iconName="ChevronLeftMed" />
            </div>
          )}

          <div
            className="title-bar"
            style={step === 1 ? { marginLeft: "-8px" } : {}}
          >
            {getTitle()}
          </div>
          <div className="count-bar">{step}/4</div>
        </div>
        <div className="cart-icon">
          <button aria-label="Shopping cart" onClick={() => Navigate(`/cart`)}>
            <Icon iconName="ShoppingCart" />
            {cartInfo.count > 0 && cartInfo.count < 100 ? (
              <span className="my-cart-count">{cartInfo.count}</span>
            ) : cartInfo.count > 99 ? (
              <span className="my-cart-count limit">99+</span>
            ) : null}
          </button>
        </div>
      </div>

      <section className="navigation-desktop" aria-label={step}>
        <ul>
          <li aria-current="step">
            <a onClick={() => onClick("", 1)}>
              <div
                className={"navigation-content " + (step === 1 ? "active" : "")}
              >
                <div className="arrow-right right"></div>
                <p className="circle-line">1</p>
                <p className="text">Select category</p>
              </div>
            </a>
          </li>
          <li aria-current="step">
            <a onClick={() => onClick("products", 2)}>
              <div
                className={"navigation-content " + (step === 2 ? "active" : "")}
              >
                <div className="arrow-right left"></div>
                <p className="circle-line">2</p>
                <p className="text">Select product</p>
                <div className="arrow-right right"></div>
              </div>
            </a>
          </li>
          <li aria-current="step">
            <a onClick={() => onClick("cart", 3)}>
              <div
                className={"navigation-content " + (step === 3 ? "active" : "")}
              >
                <div className="arrow-right left"></div>
                <p className="circle-line">3</p>
                <p className="text">Review cart</p>
                <div className="arrow-right right"></div>
              </div>
            </a>
          </li>
          <li aria-current="step">
            <a onClick={() => onNavigateToQuote(`/quote/quoteform`)}>
              <div
                className={
                  "navigation-content " +
                  (step === 4 ? "active" : "") +
                  (!cartInfo.cartId ? "disable" : "")
                }
              >
                <div className="arrow-right left"></div>
                <p className="circle-line">4</p>
                <p className="text">Generate quote</p>
              </div>
            </a>
          </li>
          <div className="cart-container">
            <button
              aria-label="Shopping cart"
              onClick={() => Navigate(`/cart`)}
            >
              <Icon iconName="ShoppingCart" />
              {cartInfo.count > 0 && cartInfo.count < 100 ? (
                <span className="my-cart-count">{cartInfo.count}</span>
              ) : cartInfo.count > 99 ? (
                <span className="my-cart-count limit">99+</span>
              ) : null}
            </button>
          </div>
        </ul>
      </section>
    </div>
  );
};

export default navigation;
