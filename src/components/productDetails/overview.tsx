import React, { useEffect, useState, useContext, Fragment } from "react";
import { useFetchProducts } from "../../services/useQueries";
import { IProductEntity } from "../../services/type.interface";
import AppContext from "../../AppContext";
import icon1 from "../../assets/images/icon1.png";
import icon2 from "../../assets/images/icon2.png";
import icon3 from "../../assets/images/icon3.png";
import icon4 from "../../assets/images/icon4.png";
import manager from "../../assets/images/manager.jpg";
import Collection from "../../assets/images/collection.jpg";
import { BrowserRouter as Router, NavLink } from "react-router-dom";

const OverviewComponent = ({
  product,
  isAccessories,
}: {
  product: IProductEntity;
  isAccessories: boolean;
}) => {
  useEffect(() => {
    //console.log(product);
  }, []);

  const limitText = (text, limit = 25) => {
    text = `${text}`; //just to be on safe side
    if (text && text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };

  return (
    <Fragment>
      {isAccessories && (
        <div className="msft-item-over-title">
          <h1>{product?.lvt_overview_title}</h1>
          <p>{product?.lvt_productoverview}</p>
        </div>
      )}
      <div
        className="msft-item-over-title"
        dangerouslySetInnerHTML={{
          __html: product?.lvt_ProductInformation?.lvt_productgroupoverview,
        }}
      ></div>

      <div className="row">
        {!isAccessories && (
          <>
            {!product?.lvt_ProductInformation?.lvt_producttitle1 &&
              !product?.lvt_ProductInformation?.lvt_producttitle2 &&
              !product?.lvt_ProductInformation?.lvt_producttitle3 &&
              !product?.lvt_ProductInformation?.lvt_producttitle4 && (
                <div>No overview data!</div>
              )}
          </>
        )}

        {!isAccessories && product?.lvt_ProductInformation?.lvt_producttitle1 && (
          <div className="column-3">
            <div className="category">
              <div className="category-img">
                <img
                  src={
                    product.lvt_ProductInformation.lvt_producticon1
                      ? "data:image/png;base64," +
                        product.lvt_ProductInformation.lvt_producticon1
                      : icon1
                  }
                />
              </div>
              <div className="category-title">
                <h3
                  className="title"
                  dangerouslySetInnerHTML={{
                    __html: product?.lvt_ProductInformation?.lvt_producttitle1,
                  }}
                />
              </div>
              <div
                className="category-description"
                dangerouslySetInnerHTML={{
                  __html:
                    product?.lvt_ProductInformation?.lvt_productdescription1,
                }}
              />
            </div>
          </div>
        )}

        {isAccessories && product.lvt_producttitle1 && (
          <div className="column-3">
            <div className="category">
              <div className="category-img">
                <img
                  src={
                    product.lvt_producticon1
                      ? "data:image/png;base64," + product.lvt_producticon1
                      : icon1
                  }
                />
              </div>
              <div className="category-title">
                <h3
                  className="title"
                  dangerouslySetInnerHTML={{
                    __html: product?.lvt_producttitle1,
                  }}
                />
              </div>
              <div
                className="category-description"
                dangerouslySetInnerHTML={{
                  __html: product?.lvt_productdescription1,
                }}
              />
            </div>
          </div>
        )}

        {!isAccessories && product?.lvt_ProductInformation?.lvt_producttitle2 && (
          <div className="column-3">
            <div className="category">
              <div className="category-img">
                <img
                  src={
                    product.lvt_ProductInformation?.lvt_producticon2
                      ? "data:image/png;base64," +
                        product.lvt_ProductInformation?.lvt_producticon2
                      : icon2
                  }
                />
              </div>
              <div
                className="category-title"
                dangerouslySetInnerHTML={{
                  __html: product?.lvt_ProductInformation?.lvt_producttitle2,
                }}
              />
              <div
                className="category-description"
                dangerouslySetInnerHTML={{
                  __html:
                    product?.lvt_ProductInformation?.lvt_productdescription2,
                }}
              />
            </div>
          </div>
        )}

        {isAccessories && product.lvt_producttitle2 && (
          <div className="column-3">
            <div className="category">
              <div className="category-img">
                <img
                  src={
                    product.lvt_producticon2
                      ? "data:image/png;base64," + product.lvt_producticon2
                      : icon2
                  }
                />
              </div>
              <div className="category-title">
                <h3
                  className="title"
                  dangerouslySetInnerHTML={{
                    __html: product?.lvt_producttitle2,
                  }}
                />
              </div>
              <div
                className="category-description"
                dangerouslySetInnerHTML={{
                  __html: product?.lvt_productdescription2,
                }}
              />
            </div>
          </div>
        )}

        {!isAccessories && product?.lvt_ProductInformation?.lvt_producttitle3 && (
          <div className="column-3">
            <div className="category">
              <div className="category-img">
                <img
                  src={
                    product.lvt_ProductInformation?.lvt_producticon3
                      ? "data:image/png;base64," +
                        product.lvt_ProductInformation?.lvt_producticon3
                      : icon3
                  }
                />
              </div>
              <div className="category-title">
                <h3
                  className="title"
                  dangerouslySetInnerHTML={{
                    __html: product?.lvt_ProductInformation?.lvt_producttitle3,
                  }}
                />
              </div>
              <div
                className="category-description"
                dangerouslySetInnerHTML={{
                  __html:
                    product?.lvt_ProductInformation?.lvt_productdescription3,
                }}
              />
            </div>
          </div>
        )}

        {isAccessories && product.lvt_producttitle3 && (
          <div className="column-3">
            <div className="category">
              <div className="category-img">
                <img
                  src={
                    product.lvt_producticon3
                      ? "data:image/png;base64," + product.lvt_producticon3
                      : icon3
                  }
                />
              </div>
              <div className="category-title">
                <h3
                  className="title"
                  dangerouslySetInnerHTML={{
                    __html: product?.lvt_producttitle3,
                  }}
                />
              </div>
              <div
                className="category-description"
                dangerouslySetInnerHTML={{
                  __html: product?.lvt_productdescription3,
                }}
              />
            </div>
          </div>
        )}

        {!isAccessories && product?.lvt_ProductInformation?.lvt_producttitle4 && (
          <div className="column-3">
            <div className="category">
              <div className="category-img">
                <img
                  src={
                    product.lvt_ProductInformation?.lvt_producticon4
                      ? "data:image/png;base64," +
                        product.lvt_ProductInformation?.lvt_producticon4
                      : icon4
                  }
                />
              </div>
              <div className="category-title">
                <h3
                  className="title"
                  dangerouslySetInnerHTML={{
                    __html: product?.lvt_ProductInformation?.lvt_producttitle4,
                  }}
                />
              </div>
              <div
                className="category-description"
                dangerouslySetInnerHTML={{
                  __html:
                    product?.lvt_ProductInformation?.lvt_productdescription4,
                }}
              />
            </div>
          </div>
        )}

        {isAccessories && product.lvt_producttitle4 && (
          <div className="column-3">
            <div className="category">
              <div className="category-img">
                <img
                  src={
                    product.lvt_producticon5
                      ? "data:image/png;base64," + product.lvt_producticon5
                      : icon4
                  }
                />
              </div>
              <div className="category-title">
                <h3
                  className="title"
                  dangerouslySetInnerHTML={{
                    __html: product?.lvt_producttitle4,
                  }}
                />
              </div>
              <div
                className="category-description"
                dangerouslySetInnerHTML={{
                  __html: product?.lvt_productdescription4,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};
export default OverviewComponent;
