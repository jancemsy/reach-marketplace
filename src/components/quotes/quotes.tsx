import React, { useContext, useEffect, useState } from "react";
import Footer from "../common/footer/footer";
import AppContext from "../../AppContext";
import { IInvoice } from "../../services/type.interface";
import "./quotes.css";
import { getURLParam } from "../../helpers/common";
import { Navigate, useLocation } from "react-router-dom";
import EmptyComponent from "../common/emptyComponent";
import { numberCurrency } from "../../helpers/common";

import Form from "../quotesForm/QuotesForm";
import Loading from "../common/Loading";
import { Icon } from "office-ui-fabric-react";

const CART_HEADER_ACTIVE_REASON_PENDING = 857860002;
const CART_HEADER_ACTIVE_REASON_SAVED = 857860003;
const CART_HEADER_INACTIVE_REASON_COMPLETED = 857860001;
const CART_HEADER_INACTIVE_REASON_DELETED = 857860000;

const QuotesComponent = () => {
  const GlobalStore: any = useContext(AppContext);
  const { prodService, setStep, Navigate, PluginRoute } = GlobalStore;
  const [quotes, setQuotes] = useState<IInvoice[]>(null);
  const [current, setCurrent] = useState<string>("pending");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  let location = useLocation();

  useEffect(() => {
    setStep(4);

    if (prodService) {
      const _current = getURLParam("filter") || "pending";
      setCurrent(_current);
      //console.log("HI im here ", _current);
      prodService.GetAllQuotes().then((result) => {
        //console.log("all quotes ", result);
        if (result) {
          setQuotes(
            result
              .filter(
                (item) =>
                  (_current === "submitted" &&
                    item.statuscode ===
                      CART_HEADER_INACTIVE_REASON_COMPLETED) ||
                  (_current === "pending" &&
                    (item.statuscode === CART_HEADER_ACTIVE_REASON_PENDING ||
                      item.statuscode === CART_HEADER_ACTIVE_REASON_SAVED))
              )
              .map((item) => ({ ...item, isExpanded: false, isLoaded: false }))
              .reverse()
          );
        }

        setIsLoading(false);
      });
    }
  }, [prodService, location]);

  const clickSubmit = (item, index) => {
    //console.log("clicking", `.submit-${item.lvt_shoppingbasketid}`);

    let delay = 0;
    if (!item.isExpanded) {
      clickExpanded(item, index);
      delay = 1000;
    }

    setTimeout(() => {
      //make sure the view is ready before executing this. ??
      const button: any = document.querySelectorAll(
        `.submit-${item.lvt_shoppingbasketid}`
      )[0];
      button.click();
    }, delay);
  };

  const clickEmail = (item, index) => {
    //const button: any = document.querySelectorAll(`.download-${item.lvt_shoppingbasketid}`)[0];
    //button.click();
  };

  const clickDownload = (item, index) => {
    let delay = 0;
    if (!item.isLoaded) {
      clickLoaded(item, index);
      delay = 1000;
    }

    setTimeout(() => {
      //make sure the view is ready before executing this. ??
      const button: any = document.querySelectorAll(
        `.download-${item.lvt_shoppingbasketid}`
      )[0];
      button.click();
    }, delay);
  };

  const getFormattedDate = (_date: any) => {
    const date = new Date(_date);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return month + "/" + day + "/" + year;
  };

  const clickLoaded = (item, index) => {
    const _quotes = quotes;
    _quotes[index].isLoaded = true;
    setQuotes([..._quotes]);
  };

  const clickExpanded = (item, index) => {
    //console.log("clickExpanded 1");
    const _quotes = quotes;
    //console.log("clickExpanded 2");
    _quotes[index].isExpanded = !item.isExpanded;

    //console.log("clickExpanded 13");
    if (!item.isLoaded) {
      //console.log("clickExpanded 14");
      _quotes[index].isLoaded = true;
      //console.log("clickExpanded 15");
    }

    //console.log("clickExpanded 16");

    //console.log("clickExpanded", _quotes);
    setQuotes([..._quotes]);
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  const clickToggle = (index) => {
    const target0: any = document.querySelectorAll(
      ".dropdown-icon-" + index
    )[0];
    const target: any = document.querySelectorAll(".dropdown-" + index)[0];

    if (target.classList.contains("opened")) {
      target.classList.remove("opened");
      target0.classList.remove("opened");
    } else {
      target.classList.add("opened");
      target0.classList.add("opened");
    }
  };

  const onClickDownload = (id: string) => {
    prodService.getQuoteFile(id).then((res) => {
      const href = URL.createObjectURL(res);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "test123.pdf"); //or any other extension
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(res);
    });
  };

  return (
    <div className="all-quotes">
      <div className="heading-title">My {current} Quotes</div>
      <div className="heading-items">
        <div
          className={current === "pending" ? "active item" : "item"}
          onClick={() => Navigate("/myquotes?filter=pending")}
        >
          Pending Quotes
        </div>
        <div
          className={current === "submitted" ? "active item" : "item"}
          onClick={() => Navigate("/myquotes?filter=submitted")}
        >
          Submitted Quotes
        </div>
      </div>

      {quotes && quotes.length > 0 ? (
        quotes.map((item: IInvoice, index) => (
          <div
            className={
              "result-grid  " +
              (item.statuscode === CART_HEADER_INACTIVE_REASON_COMPLETED
                ? "submitted"
                : "pending")
            }
          >
            <div className="item">
              <div className="left">
                <div className="item-id">{item.lvt_cartnumber}</div>
                <div className="item-date">
                  Date Created: {getFormattedDate(item.createdon)}
                </div>
                <div className="item-unit">
                  Amount of Units: {item.lvt_item_count}
                </div>
                <div className="item-total">
                  Total value: {numberCurrency(item.lvt_total_amount)}
                </div>
              </div>

              <div className="right">
                <div
                  className="item-view border-right"
                  onClick={() => clickExpanded(item, index)}
                >
                  {item.isExpanded ? "Close" : "View"}
                </div>
                <div
                  className={
                    current === "pending"
                      ? "item-download border-right"
                      : "item-download"
                  }
                  onClick={() => clickDownload(item, index)}
                >
                  Download
                </div>
                <div
                  className="item-email"
                  style={{ display: "none" }}
                  onClick={() => clickEmail(item, index)}
                >
                  Email
                </div>
                <button
                  onClick={() => onClickDownload(item.lvt_shoppingbasketid)}
                >
                  Test Download
                </button>
                {current === "pending" && (
                  <div
                    className="item-submit"
                    onClick={() => clickSubmit(item, index)}
                  >
                    Submit
                  </div>
                )}

                <div className={"mobile dropdown-icon dropdown-icon-" + index}>
                  {" "}
                  <Icon
                    iconName="CollapseMenu"
                    onClick={() => clickToggle(index)}
                  ></Icon>
                </div>
                <div className={"mobile dropdown-content dropdown-" + index}>
                  {current === "pending" ? (
                    <>
                      <div
                        onClick={() => {
                          clickExpanded(item, index);
                          clickToggle(index);
                        }}
                      >
                        View
                      </div>
                      <div
                        onClick={() => {
                          clickEmail(item, index);
                          clickToggle(index);
                        }}
                      >
                        Email
                      </div>
                      <div
                        onClick={() => {
                          clickSubmit(item, index);
                          clickToggle(index);
                        }}
                      >
                        Submit
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          clickExpanded(item, index);
                          clickToggle(index);
                        }}
                      >
                        View
                      </div>
                      <div
                        onClick={() => {
                          clickEmail(item, index);
                          clickToggle(index);
                        }}
                      >
                        Email
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className={
                item.isExpanded
                  ? "myquotes-invoice-container"
                  : "myquotes-invoice-container hide"
              }
            >
              {item.isLoaded && <Form cartId={item.lvt_shoppingbasketid} />}
            </div>
          </div>
        ))
      ) : (
        <EmptyComponent
          componentName={current + " quote"}
          linkUrl={PluginRoute + "/products"}
          linkText={"Continue shopping."}
        />
      )}
      {/*<Footer></Footer> */}
    </div>
  );
};

export default QuotesComponent;
