import React, { Fragment, useContext, useState, useEffect } from "react";
import AppContext from "../../AppContext";
import {
  IQuoteItems,
  IInvoice,
  ICart,
  ICartItem,
  ITermsCondition,
} from "../../services/type.interface";
import MSLogo from "../../assets/images/microsoft-store-logo.jpg";
import { numberCurrency } from "../../helpers/common";
export interface IQuotesForm {
  cartId?: string;
  totalGST: number;
}

const Print = ({ cartId, totalGST }: IQuotesForm) => {
  const GlobalStore: any = useContext(AppContext);
  const {
    productIDNONE,
    AccoutNumber,
    LvtAuthorisedbuyer,
    Address1City,
    Address1Country,
    Address1Postalcode,
    Address1Stateorprovince,
    Address1Line1,
    PhoneNumber,
    ContactId,
    prodService,
    Address1Composite,
    quoteService,
    User,
    setStep,
    entityName,
    Terms,
    setIsDownloadReady,
  } = GlobalStore;
  const [myCarts, setMyCarts] = useState<ICart>(null);
  const [fromDate, setfromDate] = useState<string>();
  const [toDate, setToDate] = useState<string>();
  const [carts, setCart] = useState<ICartItem[]>(null);
  const [subTotal, setSubTotal] = useState<number>(0.0);
  const [myProdList, setmyProdList] = useState<any>();

  const getSubTotal = (items: ICartItem[]) => {
    let subTotal = 0.0;
    items?.forEach((item) => {
      subTotal +=
        item?.lvt_priceincludinggst * item?.lvt_qty ||
        item?.lvt_priceincludinggst_base * item?.lvt_qty;
    });
    setSubTotal(subTotal);
  };

  useEffect(() => {
    //console.log("Card Id: " + cartId);
    if (cartId) {
      prodService
        .GetCartsById(cartId)
        .then((res) => {
          //console.log("get Active carts by id result is ", res);
          setCart(res[0].cartItems);
          OrganizeProductList(res[0].cartItems);
          setMyCarts(res[0]);
          getSubTotal(res[0].cartItems);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [cartId]);

  useEffect(() => {
    if (myCarts) {
      setStep(4);
      const _today = new Date(myCarts.createdon);
      const _fromDate = getFormattedDate(_today);
      const _toDate = getFormattedDate(
        new Date(_today.setDate(_today.getDate() + 30))
      );

      setfromDate(_fromDate);
      setToDate(_toDate);
    }
  }, [myCarts]);

  const getFormattedDate = (date: any) => {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return month + "/" + day + "/" + year;
  };

  const OrganizeProductList = (carts) => {
    setmyProdList(
      carts.map(
        (quote) =>
          !quote.lvt_name.toLowerCase().includes("none") && (
            <Fragment>
              <tr>
                <td width="30" style={{ textAlign: "center" }}>
                  {quote?.lvt_qty}
                </td>
                <td width="250">{quote?.lvt_Product?.lvt_name}</td>
                <td width="100">{quote?.lvt_Product?.lvt_sku}</td>
                <td width="100" className="align-right"></td>
                <td width="100" className="align-right">
                  {quote?.lvt_priceexcludinggst
                    ? numberCurrency(quote?.lvt_priceexcludinggst)
                    : numberCurrency(quote?.lvt_priceexcludinggst_base)}
                </td>
                <td width="100" className="align-right">
                  {quote?.lvt_gstvalue
                    ? numberCurrency(
                        quote?.lvt_qty * parseFloat(quote?.lvt_gstvalue)
                      )
                    : numberCurrency(
                        quote?.lvt_qty * parseFloat(quote?.lvt_gstvalue_base)
                      )}
                </td>
                <td width="100" className="align-right">
                  {quote?.lvt_priceincludinggst
                    ? numberCurrency(
                        quote?.lvt_priceincludinggst * quote?.lvt_qty
                      )
                    : numberCurrency(
                        quote?.lvt_priceincludinggst_base * quote?.lvt_qty
                      )}
                </td>
              </tr>
            </Fragment>
          )
      )
    );

    setIsDownloadReady(true);
  };

  return (
    <div
      className="printable-quote form-container"
      id={"quoteform-" + cartId}
      style={{ padding: "80px" }}
    >
      <div className="header-form print">
        <table className="top-table">
          <tr>
            <td valign="top" height="100">
              <div className="print-header-logo">
                <img src={MSLogo} alt="Microsoft Logo" />
                <b>Microsoft Store</b>
              </div>
              <div className="print-header-location">
                {Address1Line1} <br />
                {Address1Stateorprovince} {Address1City} {Address1Postalcode}{" "}
                <br />
                {Address1Country}
              </div>
            </td>

            <td valign="top">
              <div className="print-customer-top-info">
                <div className="name">{User?.displayName}</div>
                <div className="quote-number">
                  {myCarts && myCarts?.lvt_cartnumber}
                </div>
              </div>

              <div className="header-dates">
                <table className="print-grid-table">
                  <tr>
                    <td className="align-right">
                      <span className="date">EFFECTIVE TO: {fromDate}</span>{" "}
                    </td>{" "}
                  </tr>
                  <tr>
                    <td className="align-right">
                      <span className="date">EFFECTIVE TO: {toDate}</span>{" "}
                    </td>{" "}
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>

        <div className="table-space"></div>

        <table className="detail-table print-grid-table">
          <tr>
            <td
              width="50%"
              className="noborder"
              style={{ paddingRight: "20px" }}
            >
              <table>
                <tr>
                  <td width="150" height="100" valign="top">
                    Company Name:
                  </td>
                  <td valign="top">{entityName}</td>
                </tr>
                <tr>
                  <td width="150">Account Number:</td>
                  <td>{AccoutNumber}</td>
                </tr>
                <tr>
                  <td width="150">Contact Email:</td>
                  <td>{User?.mail}</td>
                </tr>
                <tr>
                  <td width="150">Phone:</td>
                  <td>{PhoneNumber}</td>
                </tr>
                <tr>
                  <td width="150">Authorized buyer:</td>
                  <td>{LvtAuthorisedbuyer}</td>
                </tr>
                <tr>
                  <td width="150">Customer PO#</td>
                  <td>{myCarts?.lvt_customerpo}</td>
                </tr>
              </table>
            </td>

            <td valign="top" className="noborder">
              <table>
                <tr>
                  <td height="100" valign="top">
                    Bill To
                    <p>{Address1Composite}</p>
                  </td>
                  <td valign="top">
                    Ship To
                    <p>{Address1Composite}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div className="table-space"></div>

        <table className="comments-table print-grid-table">
          <tr>
            <td width="200" valign="top" height="100">
              Comments
            </td>
            <td valign="top">{myCarts && myCarts?.lvt_comments}</td>
          </tr>
        </table>

        <div className="table-space"></div>
        <table className="print-grid-table">
          <tr>
            <th style={{ textAlign: "center", minWidth: "50px" }}>QTY</th>
            <th>PRODUCT NAME</th>
            <th>SKU</th>
            <th>MSRP</th>
            <th>UNIT PRICE</th>
            <th>GST</th>
            <th>LINE TOTAL</th>
          </tr>
          {myProdList}
          <tr>
            <td colSpan={5} rowSpan={5} className="noborder">
              <div className="print-footer-items">
                <div className="signoff">
                  {" "}
                  <b>Customer Sign Off</b>{" "}
                </div>
                <div className="printed">
                  {" "}
                  <b>Printed Name:</b>{" "}
                  <span className="namev">{User?.displayName}</span>{" "}
                </div>
                <div className="date">
                  {" "}
                  <b>Date:</b> <span className="datev">{fromDate}</span>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="total-label align-right noborder">FEE/CHARGES </td>{" "}
            <td className="total-label align-right" colSpan={2}>
              {" "}
              $0.00{" "}
            </td>
          </tr>
          <tr>
            <td className="total-label align-right noborder">GST </td>{" "}
            <td className="total-label align-right" colSpan={2}>
              {" "}
              {numberCurrency(totalGST)}{" "}
            </td>
          </tr>
          <tr>
            <td className="total-label align-right noborder">TOTAL </td>{" "}
            <td className="total-label align-right" colSpan={2}>
              {numberCurrency(subTotal)}
            </td>
          </tr>
        </table>
        {Terms && Terms.length > 0 && (
          <div className="terms-condition-container">
            {Terms?.map((term: ITermsCondition) => (
              <Fragment>
                <div className="terms-condition-header">
                  <h4 className="title">{term.lvt_name}</h4>
                </div>
                <div
                  className="term-condition"
                  dangerouslySetInnerHTML={{
                    __html: term.lvt_contractconditions,
                  }}
                />
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Print;
