import React, { useEffect, useState, useContext, Fragment } from "react";
import { IProductEntity } from "../../services/type.interface";
import AppContext from "../../AppContext";
import Image from "../common/Image";
import OverviewComponent from "./overview";
import TechComponent from "./tech";
import Footer from "../common/footer/footer";
import Modal from "../common/modal/Modal";
import { Icon } from "office-ui-fabric-react";
import { numberCurrency } from "../../helpers/common";

export interface IProductDetails {
  id: any;
}

const productDetails = ({ id }: IProductDetails) => {
  const [isAccessories, setIsAccessories] = useState<boolean>(false);
  const [product, setProduct] = useState<IProductEntity>();
  const [productStep, setProductStep] = useState<number>(1);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const GlobalStore: any = useContext(AppContext);
  const { prodService, Navigate, MSFTToken } = GlobalStore;

  const clickAddToCart = () => {
    prodService.AddItemToCart(product).then((result: any) => {
      Navigate(`/cart/mycart`);
    });
  };

  const clickConfigure = () => {
    Navigate(
      `/productConfig/${product?.lvt_productid}?itemId=${product?.lvt_pricelistitemid}&prodId=${product?.lvt_productid}&from=product`
    );
  };

  const limitText = (text: string, limit = 25) => {
    text = `${text}`; //just to be on safe side
    if (text && text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };

  const onClickModalClose = (bol: boolean) => {
    setShowGallery(false);
  };

  useEffect(() => {
    if (id != "" && !product) {
      prodService.GetProduct(id).then((_product: IProductEntity) => {
        setIsAccessories(!_product.lvt_ProductInformation ? true : false); //only devices has product information
        setProduct(_product);
      });
    }
  }, [id]);

  if (!product) {
    return null;
  }

  return (
    <div className="msft-item-details">
      {showGallery && (
        <Modal isDisplay={showGallery} onClickClose={onClickModalClose}>
          <Image
            type="productInfoGallery"
            productId={product._lvt_productinformation_value}
            MSFTToken={MSFTToken}
          />
        </Modal>
      )}
      <div className="msft-item-container">
        <Fragment>
          <div className="msft-item-header">
            <div className="msft-img-slider">
              {product._lvt_productinformation_value ? (
                <Fragment>
                  <Image
                    productId={product._lvt_productinformation_value}
                    MSFTToken={MSFTToken}
                    type="productInfoFamily"
                  />
                  {product?.lvt_ProductInformation?.lvt_productviewgallery && (
                    <div className="view-gallery">
                      <button
                        className="gallery-btn"
                        onClick={() => setShowGallery(true)}
                      >
                        <Icon iconName="Camera" />
                        View Gallery
                      </button>
                    </div>
                  )}
                </Fragment>
              ) : (
                <Image
                  productId={product.lvt_productid}
                  MSFTToken={MSFTToken}
                />
              )}
            </div>
            <div className="msft-short-description">
              <div className="top">
                <h1 className="title">
                  {product?.lvt_ProductInformation?.lvt_name ||
                    product?.lvt_name}
                </h1>
                {isAccessories ? (
                  <div
                    className="short-desc"
                    dangerouslySetInnerHTML={{
                      __html: product?.lvt_accessorydescription,
                    }}
                  ></div>
                ) : (
                  <div
                    className="short-desc"
                    dangerouslySetInnerHTML={{
                      __html:
                        product?.lvt_ProductInformation?.lvt_devicegroupdetails,
                    }}
                  ></div>
                )}
              </div>
              <div className="bottom">
                <p className="start-price">
                  Starting from <b>{numberCurrency(product?.price)} ex. GST</b>
                </p>
                <div className="msft-item-configure-btn">
                  {isAccessories ? (
                    <button onClick={() => clickAddToCart()}>
                      <div>Add to cart</div>
                    </button>
                  ) : (
                    <button onClick={() => clickConfigure()}>
                      <div>Build your device</div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="msft-item-tabs">
            <div className="divider"></div>
            <div className="msft-item-tab-container">
              <button
                className={productStep === 1 ? "active" : ""}
                onClick={() => setProductStep(1)}
              >
                Overview
              </button>
              <button
                className={productStep === 2 ? "active" : ""}
                onClick={() => setProductStep(2)}
              >
                Tech Specs
              </button>
            </div>
          </div>
          <div className="msft-item-over-details">
            {productStep === 1 ? (
              <Fragment>
                <OverviewComponent
                  product={product}
                  isAccessories={isAccessories}
                ></OverviewComponent>

                {/*<Footer></Footer> */}
              </Fragment>
            ) : productStep === 2 ? (
              !isAccessories && product._lvt_productinformation_value ? (
                <TechComponent
                  product={product}
                  isAccessories={isAccessories}
                ></TechComponent>
              ) : isAccessories && product ? (
                <TechComponent
                  product={product}
                  isAccessories={isAccessories}
                ></TechComponent>
              ) : (
                <div style={{ paddingTop: "25px" }}>
                  No Product Information!
                </div>
              )
            ) : null}
          </div>
        </Fragment>
      </div>
    </div>
  );
};

export default productDetails;
