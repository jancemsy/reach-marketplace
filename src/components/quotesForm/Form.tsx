import React, { Fragment, useContext, useState, useEffect } from "react";
import AppContext from "../../AppContext";
import {
  ICart,
  ICartItem,
  ITermsCondition,
} from "../../services/type.interface";
import MSLogo from "../../assets/images/microsoft-store-logo.jpg";
import Loading from "../common/Loading";
import { numberCurrency } from "../../helpers/common";

export interface IQuotesForm {
  cartId?: string;
  myCarts: ICart;
  carts: ICartItem[];
  subTotal: number;
  totalGST: number;
}

const Form = ({ cartId, myCarts, carts, subTotal, totalGST }: IQuotesForm) => {
  const GlobalStore: any = useContext(AppContext);
  const {
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
  } = GlobalStore;

  const [fromDate, setfromDate] = useState<string>();
  const [toDate, setToDate] = useState<string>();

  useEffect(() => {
    //console.log("product myCarts: ", myCarts);
  }, []);

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

  if (!myCarts) return <Loading></Loading>;

  /*var node: any = document.getElementById(`my-node-${cartId}`);
  htmlToImage
    .toCanvas(node)
    .then(function (canvas) {
      var imagecontainer: any = document.getElementById(
        `image-container-${cartId}`
      );
      imagecontainer?.appendChild(canvas);
      //node.style.display = "none";
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
    });*/

  return (
    <>
      <div id={"image-container-" + cartId} className="image-container"></div>
      <div id={"my-node-" + cartId} className="my-node">
        <div
          className="form-container-inner"
          style={{ paddingBottom: "100px" }}
        >
          <div className="header-form">
            <table className="top-table">
              <tr>
                <td valign="top" height="100" style={{ minWidth: "350px" }}>
                  <div className="header-logo">
                    <img src={MSLogo} alt="Microsoft Logo" />
                    <b>Microsoft Store</b>
                  </div>
                  <div className="header-location">
                    {Address1Line1} <br />
                    {Address1Stateorprovince} {Address1City}{" "}
                    {Address1Postalcode} <br />
                    {Address1Country}
                  </div>
                </td>
                <td valign="top" style={{ minWidth: "300px" }}>
                  <div className="customer-top-info">
                    <div className="name">{User?.displayName}</div>
                    <div className="quote-number">
                      {myCarts?.lvt_cartnumber}
                    </div>
                  </div>
                  <div className="header-dates">
                    <table>
                      <tr>
                        <td className="align-right">
                          <span className="date">
                            EFFECTIVE FROM: {fromDate}
                          </span>{" "}
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
            <table className="detail-table">
              <tr>
                <td
                  width="50%"
                  className="noborder"
                  style={{ paddingRight: "20px" }}
                >
                  <table>
                    <tr>
                      <td width="200" height="100" valign="top">
                        Company Name:
                      </td>
                      <td valign="top" width="200">
                        {entityName}
                      </td>
                    </tr>
                    <tr>
                      <td width="200">Account Number:</td>
                      <td width="200">{AccoutNumber}</td>
                    </tr>
                    <tr>
                      <td width="200">Contact Email:</td>
                      <td width="200">{User?.mail}</td>
                    </tr>
                    <tr>
                      <td width="200">Phone:</td>
                      <td width="200">{PhoneNumber}</td>
                    </tr>
                    <tr>
                      <td width="200">Authorized buyer:</td>
                      <td width="200">{LvtAuthorisedbuyer}</td>
                    </tr>
                    <tr>
                      <td width="200">Customer PO#</td>
                      <td width="200">{myCarts?.lvt_customerpo}</td>
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
            <table className="comments-table">
              <tr>
                <td width="200" valign="top" height="100">
                  Comments
                </td>
                <td valign="top" width="300">
                  {myCarts?.lvt_comments}
                </td>
              </tr>
            </table>

            <div className="table-space"></div>
            <table className="grid-table">
              <tr>
                <th style={{ textAlign: "center", minWidth: "50px" }}>QTY</th>
                <th style={{ minWidth: "200px" }}>PRODUCT NAME</th>
                <th className="mobile-none">SKU</th>
                <th className="align-right mobile-none">MSRP</th>
                <th className="align-right mobile-none">UNIT PRICE</th>
                <th className="align-right mobile-none">GST</th>
                <th className="align-right mobile-none">LINE TOTAL</th>

                <th
                  className="align-right mobile-view"
                  colSpan={2}
                  style={{ minWidth: "150px" }}
                >
                  UNIT PRICE
                </th>
                <th
                  className="align-right mobile-view"
                  colSpan={2}
                  style={{ minWidth: "130px" }}
                >
                  GST
                </th>
                <th
                  className="align-right mobile-view"
                  colSpan={2}
                  style={{ minWidth: "115px" }}
                >
                  LINE TOTAL
                </th>
              </tr>
              {carts &&
                carts.map(
                  (quote) =>
                    !quote.lvt_name.toLowerCase().includes("none") && (
                      <Fragment>
                        <tr>
                          <td style={{ textAlign: "center", minWidth: "70px" }}>
                            {quote?.lvt_qty}
                          </td>
                          <td style={{ minWidth: "200px" }}>
                            {quote?.lvt_Product?.lvt_name}
                          </td>
                          <td className="mobile-none">
                            {quote?.lvt_Product?.lvt_sku}
                          </td>
                          <td className="align-right mobile-none"></td>
                          <td className="align-right mobile-none">
                            {quote?.lvt_priceexcludinggst
                              ? numberCurrency(quote?.lvt_priceexcludinggst)
                              : numberCurrency(
                                  quote?.lvt_priceexcludinggst_base
                                )}
                          </td>
                          <td className="align-right mobile-none">
                            {quote?.lvt_gstvalue
                              ? numberCurrency(
                                  quote?.lvt_qty *
                                    parseFloat(quote?.lvt_gstvalue)
                                )
                              : numberCurrency(
                                  quote?.lvt_qty *
                                    parseFloat(quote?.lvt_gstvalue_base)
                                )}
                          </td>
                          <td className="align-right mobile-none">
                            {quote?.lvt_priceincludinggst
                              ? numberCurrency(
                                  quote?.lvt_priceincludinggst * quote?.lvt_qty
                                )
                              : numberCurrency(
                                  quote?.lvt_priceincludinggst_base *
                                    quote?.lvt_qty
                                )}
                          </td>

                          <td
                            className="align-right mobile-view"
                            colSpan={2}
                            style={{ minWidth: "150px" }}
                          >
                            {quote?.lvt_priceexcludinggst
                              ? numberCurrency(quote?.lvt_priceexcludinggst)
                              : numberCurrency(
                                  quote?.lvt_priceexcludinggst_base
                                )}
                          </td>
                          <td
                            className="align-right mobile-view"
                            colSpan={2}
                            style={{ minWidth: "130px" }}
                          >
                            {quote?.lvt_gstvalue
                              ? numberCurrency(
                                  quote?.lvt_qty *
                                    parseFloat(quote?.lvt_gstvalue)
                                )
                              : numberCurrency(
                                  quote?.lvt_qty *
                                    parseFloat(quote?.lvt_gstvalue_base)
                                )}
                          </td>
                          <td
                            className="align-right mobile-view"
                            colSpan={2}
                            style={{ minWidth: "200px" }}
                          >
                            {quote?.lvt_priceincludinggst
                              ? numberCurrency(
                                  quote?.lvt_priceincludinggst * quote?.lvt_qty
                                )
                              : numberCurrency(
                                  quote?.lvt_priceincludinggst_base *
                                    quote?.lvt_qty
                                )}
                          </td>
                        </tr>
                      </Fragment>
                    )
                )}
              <tr>
                <td colSpan={5} rowSpan={5} className="noborder">
                  <div className="footer-items">
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
                <td className="total-label align-right noborder">FEES </td>{" "}
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
      </div>
    </>
  );
};

export default Form;
