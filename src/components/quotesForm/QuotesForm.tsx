import React, { useEffect, useState, useContext, Fragment } from "react";
import AppContext from "../../AppContext";
import MSLogo from "../../assets/images/ms-logo-2.png";
import { D365BaseUrl } from "../../helpers/request";
import Loading from "../common/Loading";
import QuoteForm from "./Form";
import FormComponent from "./FormComponent";
import { ICart, ICartItem } from "../../services/type.interface";
import html2pdf from "html2pdf.js";
import Upload from "../common/input/upload";
import { usePluginSettings } from "@reach/core";
import Mydownload from "./Download";

export interface IQuotesForm {
  cartId?: string;
  isSubmit?: boolean;
}

const QuotesForm = ({ cartId, isSubmit }: IQuotesForm) => {
  //const [quotes, setQuotes] = useState<IQuoteItems[]>(null);
  const { uploadSizeLimit } = usePluginSettings<{ uploadSizeLimit: number }>();
  const { maxFiles } = usePluginSettings<{ maxFiles: number }>();
  const [submitCartLoading, setSubmitCartLoading] = useState<boolean>(false);
  const [testUrl, settestUrl] = useState<string>("");
  const [show, setShow] = useState<boolean>(isSubmit);
  const [hasSubmited, setHasSubmited] = useState<boolean>(false);
  const [myCarts, setMyCarts] = useState<ICart>(null);
  //let wrapperRef = useRef(null);
  let WrapperRef: any;
  const [carts, setCart] = useState<ICartItem[]>(null);
  const [subTotal, setSubTotal] = useState<number>(0.0);
  const [totalGST, settotalGST] = useState<number>(0.0);
  const [iframeHeight, setIframeHeight] = useState<number>(0.0);
  const [widthPercentage, setWidthPercentage] = useState<number>(0.0);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [myfiles, setMyFiles] = useState<any>();
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [stepsOnUpload, setStepOnUpload] = useState<number>(0);
  const [uploadError, setuploadError] = useState<string>("");
  const [customerPO, setCustomerPO] = useState<string>("");
  const [POError, setPOError] = useState<string>("");
  const [Condition, setCondition] = useState<string>("");

  const [MyBlob, setBlob] = useState<string>();

  const GlobalStore: any = useContext(AppContext);
  const { MSFTToken, prodService, Navigate, User, IsDownloadReady, Terms } =
    GlobalStore;
  let opt = {
    margin: 0,
    filename: "myfile.pdf",
    image: { type: "jpeg", quality: 0.85 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  useEffect(() => {
    const resolution = window.innerHeight;
    setIframeHeight(resolution);
  }, []);

  useEffect(() => {
    //console.log("My Cart ID: ", cartId);
    if (cartId) {
      prodService
        .GetCartsById(cartId)
        .then((res) => {
          //console.log("GetCartsById: ", cartId, res);
          //collect all carts items and put it inside one cartiems
          let cartsitems = [];
          res.forEach((element: ICart) => {
            cartsitems = cartsitems.concat(element.cartItems);
          });

          setCart(cartsitems);
          setMyCarts(res[0]);
          getSubTotal(cartsitems);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [cartId]);

  const getSubTotal = (items: ICartItem[]) => {
    let subTotal = 0.0;
    let totalgst = 0.0;
    items?.forEach((item) => {
      if (!item.lvt_name.toLowerCase().includes("none")) {
        subTotal +=
          item?.lvt_priceincludinggst * item?.lvt_qty ||
          item?.lvt_priceincludinggst_base * item?.lvt_qty;
        totalgst += item?.lvt_gstvalue
          ? parseFloat(item?.lvt_gstvalue) * item?.lvt_qty
          : 0 || item?.lvt_gstvalue_base
          ? parseFloat(item?.lvt_gstvalue_base) * item?.lvt_qty
          : 0;
      }
    });
    setSubTotal(subTotal);
    settotalGST(totalgst);
  };

  const onSubmit = () => {
    setIsUpload(false);
    setShow(true);
  };

  const onProceed = () => {
    if (myfiles?.length > 0) {
      setIsUpload(true);
      setStepOnUpload(1);
      //setShowUpload(false);
      //setShow(true);
    } else {
      setuploadError("Please upload your quote file.");
    }
  };

  const onNavigateToQuoteList = () => {
    Navigate("/myquotes?filter=submitted");
  };

  const clickSaveCarts = () => {
    prodService.SaveCarts(cartId).then((result) => {
      Navigate("/myquotes?filter=pending");
    });
  };

  const EmailSubmit = () => {
    setSubmitCartLoading(true);
    setHasSubmited(false);

    if (myfiles?.length > 0) {
      importFile(myfiles)
        .then((r) => {})
        .catch((err) => console.log(err));
    }

    uploadFilePDF().then((r) => {
      setSubmitCartLoading(false);
    });
  };

  const completeCarts = () => {
    if (customerPO) {
      setSubmitCartLoading(true);
      setHasSubmited(false);

      if (myfiles?.length > 0) {
        importFile(myfiles)
          .then((r) => {})
          .catch((err) => console.log(err));
      }

      uploadFilePDF().then((r) => {
        prodService.CompleteCarts(cartId, customerPO).then((result) => {
          if (result) {
            setSubmitCartLoading(false);
            setHasSubmited(true);
            //onNavigateToQuoteList();
          } else {
            //error here. Handle here...
            setSubmitCartLoading(false);
          }
        });
      });
    } else {
      setPOError("Customer PO # is required.");
      setSubmitCartLoading(false);
    }
  };

  const OnSubmitMessage = () => {
    return (
      <div
        className="margin-bottom-20"
        dangerouslySetInnerHTML={{ __html: Condition }}
      />
    );
  };

  const HasSubmitedMessage = () => {
    return (
      <Fragment>
        <p>
          Thank you for your order submission. A Microsoft representative will
          contact you shortly via email to confirm your order
        </p>
      </Fragment>
    );
  };

  function makeRequest(
    method,
    fileName,
    url,
    bytes,
    firstRequest,
    offset,
    count,
    fileBytes
  ) {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.open(method, url);
      if (firstRequest)
        request.setRequestHeader("x-ms-transfer-mode", "chunked");
      request.setRequestHeader("x-ms-file-name", fileName);

      if (!firstRequest) {
        request.setRequestHeader(
          "Content-Range",
          "bytes " +
            offset +
            "-" +
            (offset + count - 1) +
            "/" +
            fileBytes.length
        );
        request.setRequestHeader("Content-Type", "application/octet-stream");
      }
      request.setRequestHeader("Authorization", `Bearer ${MSFTToken}`);
      request.onload = resolve;
      request.onerror = reject;
      if (!firstRequest) request.send(bytes);
      else request.send();
    });
  }

  const storeFile = (event) => {
    setuploadError("");
    setMyFiles(event);
  };

  const importFile = (event) => {
    return new Promise((resolve) => {
      setSubmitCartLoading(true);
      if (event) {
        event.forEach((file) => {
          const arrayBuffer = file;
          const reader = new FileReader();
          reader.onload = function () {
            var arrayBuffer = this.result;
            var array = new Uint8Array(arrayBuffer as ArrayBuffer);
            var url =
              D365BaseUrl() +
              "/api/data/v9.2/lvt_shoppingbaskets(" +
              cartId +
              ")/lvt_customerpofile";
            makeRequest(
              "PATCH",
              file.name,
              url,
              null,
              true,
              null,
              null,
              null
            ).then(function (s) {
              fileChunckUpload(s, file.name, array);
              resolve(true);
            });
          };
          reader.readAsArrayBuffer(arrayBuffer);
        });
      }
    });
  };

  const uploadFilePDF = () => {
    return new Promise((resolve) => {
      //const canvas = document.getElementsByTagName("canvas")[0];
      //const canvas = WrapperRef;
      //var url = canvas.toDataURL();
      var fileName = "Quote-" + myCarts.lvt_cartnumber + ".pdf";
      var element = document.getElementById("quoteform-" + cartId);
      let newOpt = opt;
      newOpt.margin = 1;
      var worker = html2pdf()
        .set(newOpt)
        .from(element)
        .output("blob", fileName);

      worker
        .then((res) => {
          var arrayBuffer = res;
          var reader = new FileReader();

          reader.onload = function () {
            var arrayBuffer = this.result;
            var array = new Uint8Array(arrayBuffer as ArrayBuffer);
            var url =
              D365BaseUrl() +
              "/api/data/v9.2/lvt_shoppingbaskets(" +
              cartId +
              ")/lvt_quotepdf";
            makeRequest(
              "PATCH",
              fileName,
              url,
              null,
              true,
              null,
              null,
              null
            ).then(function (s) {
              fileChunckUpload(s, fileName, array);
              resolve(true);
            });
          };
          reader.readAsArrayBuffer(arrayBuffer);
        })
        .catch((err) => {
          console.log("PDF error. ", err.message);
        });
    });
  };

  async function fileChunckUpload(response, fileName, fileBytes) {
    var req = response.target;
    var url = req.getResponseHeader("location");
    var chunkSize = parseInt(req.getResponseHeader("x-ms-chunk-size"));
    var offset = 0;
    while (offset <= fileBytes.length) {
      var count =
        offset + chunkSize > fileBytes.length
          ? fileBytes.length % chunkSize
          : chunkSize;
      var content = new Uint8Array(count);
      for (var i = 0; i < count; i++) {
        content[i] = fileBytes[offset + i];
      }
      response = await makeRequest(
        "PATCH",
        fileName,
        url,
        content,
        false,
        offset,
        count,
        fileBytes
      );
      req = response.target;
      if (req.status === 206) {
        // partial content, so please continue.
        offset += chunkSize;
      } else if (req.status === 204) {
        // request complete.
        break;
      } else {
        // error happened.
        // log error and take necessary action.
        break;
      }
    }
  }
  const onDownloadPdf = () => {
    setSubmitCartLoading(true);
    const element = document.getElementById("quoteform-" + cartId);
    var worker = html2pdf()
      .set(opt)
      .from(element)
      .output("blob", "Quote-" + myCarts.lvt_cartnumber + ".pdf");

    worker
      .then((res) => {
        const fileURL = window.URL.createObjectURL(res);
        //settestUrl(fileURL);
        //console.log("fileURL: ", fileURL);
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.target = "_self";
        alink.download = "Quote-" + myCarts.lvt_cartnumber + ".pdf";
        alink.rel = "noopener";
        alink.click();
      })
      .catch((err) => {
        console.log("PDF error. ", err.message);
      });

    setTimeout(() => {
      setSubmitCartLoading(false);
    }, 2000);
  };

  const onHandleResize = () => {
    const resolution = window.innerWidth;
    if (resolution < 801) {
      const mytotal = resolution / 800;
      const getPercentage = mytotal * 100 - 16;
      setWidthPercentage(getPercentage);
    } else {
      setWidthPercentage(85);
    }
  };

  const open = () => {};

  useEffect(() => {
    onHandleResize();
    window.addEventListener("resize", onHandleResize.bind(this));
  }, []);

  useEffect(() => {
    if (carts && myCarts && cartId && IsDownloadReady) {
      const myterm = Terms?.find((term) => {
        return term.lvt_name === "Quote Terms and Conditions";
      });
      setCondition(myterm.lvt_acceptancecondition);
      const element = document.getElementById("quoteform-" + cartId);
      var worker = html2pdf()
        .set(opt)
        .from(element)
        .output("blob", "Quote-" + myCarts.lvt_cartnumber + ".pdf");

      worker
        .then((res) => {
          const fileURL = window.URL.createObjectURL(res);
          setBlob(fileURL);
        })
        .catch((err) => {
          console.log("PDF error. ", err.message);
        });
    }
  }, [carts, myCarts, cartId, IsDownloadReady]);

  if (!myCarts) return <Loading></Loading>;

  return (
    <div className="form-container">
      <div className="header-form">
        {testUrl && (
          <a href={testUrl} target="_self" download>
            Click me to download!
          </a>
        )}
        <h1 className="title">Your Quote</h1>

        <div className="quotebtncontainer">
          {submitCartLoading ? (
            <Loading />
          ) : (
            <Fragment>
              <button className="default btn" onClick={() => clickSaveCarts()}>
                Save For Later
              </button>
              {IsDownloadReady ? (
                <Fragment>
                  <button
                    onClick={onDownloadPdf}
                    className={`mobile-none primary btn download-${cartId} `}
                  >
                    Download PDF
                  </button>
                  {/*
                  test purposes
                      <a
                    download="test.pdf"
                    href="https://org55974cc1.crm6.dynamics.com/api/data/v9.0/lvt_shoppingbaskets(d2433078-944e-ed11-bba3-002248933c9b)/lvt_quotepdf/$value"
                    target="_blank"
                  >
                    File
                  </a>
                    */}

                  <button
                    onClick={EmailSubmit}
                    className={`mobile-view primary btn download-${cartId} `}
                  >
                    Email
                  </button>
                </Fragment>
              ) : (
                <Loading />
              )}

              <button
                className={`primary btn submit-${cartId} `}
                onClick={onSubmit}
              >
                Submit Order
              </button>
            </Fragment>
          )}
        </div>

        {show ? (
          <div className="reach-modal-section">
            <div className="reach-modal-container">
              <div className="reach-inner-container">
                <div className="header">
                  <img src={MSLogo} alt={"microsoft-logo"} />
                </div>
                <div className={"body" + (hasSubmited ? " submitted" : "")}>
                  {hasSubmited ? <HasSubmitedMessage /> : <OnSubmitMessage />}
                  {OnSubmitMessage && (
                    <div className="cpo-container">
                      {submitCartLoading ? (
                        <Loading />
                      ) : !hasSubmited ? (
                        <Fragment>
                          <div className="cpo-input">
                            <label>
                              Customer PO # <span className="error">*</span>
                            </label>
                            <input
                              className="msft-input"
                              onChange={(e) => {
                                setPOError("");
                                setCustomerPO(e.target.value);
                              }}
                              placeholder="Customer PO#"
                            />
                            {POError && (
                              <span className="error">{POError}</span>
                            )}
                          </div>
                          <div className="cpo-upload">
                            <label>Upload PO File</label>
                            <Upload
                              type={"small"}
                              open={open}
                              onFileChange={storeFile}
                              maxSize={uploadSizeLimit}
                              maxFiles={maxFiles}
                            />
                            {myfiles?.length > 0 && (
                              <div className="upload-list-container">
                                {myfiles?.map((file) => (
                                  <div key={file.path}>{file.path}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </Fragment>
                      ) : null}
                    </div>
                  )}
                </div>
                <div
                  className={"modal-btn" + (hasSubmited ? " submitted" : "")}
                >
                  {hasSubmited ? (
                    <button
                      className="cancel btn nav"
                      onClick={onNavigateToQuoteList}
                    >
                      View your submitted orders here
                    </button>
                  ) : (
                    <Fragment>
                      {submitCartLoading ? (
                        <Loading />
                      ) : (
                        <Fragment>
                          <button
                            className="primary btn submit-quote"
                            onClick={() => completeCarts()}
                          >
                            Accept and Submit Order
                          </button>
                          <button
                            className="cancel btn"
                            onClick={() => setShow(false)}
                          >
                            Cancel
                          </button>
                        </Fragment>
                      )}
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div style={{ display: "none" }}>
          {cartId && <FormComponent totalGST={totalGST} cartId={cartId} />}
        </div>
        <div className="pdf-form-content">
          <div
            className="pdf-form-container"
            style={{
              height: "970px",
              zoom: widthPercentage.toString() + "%",
            }}
          >
            {cartId && totalGST && subTotal && carts && IsDownloadReady ? (
              <QuoteForm
                carts={carts}
                myCarts={myCarts}
                subTotal={subTotal}
                totalGST={totalGST}
                cartId={cartId}
              />
            ) : (
              //<Mydownload iframeSrc={MyBlob} />
              <Loading />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotesForm;
