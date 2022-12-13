import React, { useContext, useEffect, useState } from "react";
import { IProductEntity } from "../../services/type.interface";
import Image from "../common/Image";
import { getURLParam } from "../../helpers/common";
import { numberCurrency } from "../../helpers/common";
import styled from "styled-components";
const ACCESSORIES = 2;
const DEVICES = 1;

const ProductCardComponent = ({
  prodService,
  ProductType,
  product,
  Navigate,
  MSFTToken,
  isExPrice = true,
}: {
  ProductType;
  prodService: any;
  product: IProductEntity;
  Navigate: any;
  MSFTToken: string;
  isExPrice?: boolean;
}) => {
  if (!product) return null;

  const [isAccessories, setIsAccessories] = useState<boolean>(
    ProductType === ACCESSORIES ? true : false
  );
  const [type, setType] = useState<number>(
    parseInt(`${getURLParam("type") || 1}`)
  );

  const clickProduct = () => {
    Navigate(
      `/product/detail?itemId=${product.lvt_pricelistitemid}&prodId=${product.lvt_productid}&type=${type}`
    );
  };

  const clickAddToCart = () => {
    prodService.AddItemToCart(product).then((result) => {
      Navigate(`/cart/mycart`);
    });
  };

  const clickConfigure = () => {
    Navigate(
      `/productConfig/${product.lvt_productid}?itemId=${product.lvt_pricelistitemid}&prodId=${product.lvt_productid}`
    );
  };

  const limitText = (text, limit = 25) => {
    text = `${text}`; //just to be on safe side
    if (text && text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };

  return (
    <ProdCard>
      <div className="category-item new">
        <div className="category-content">
          <div className="category-item-img" onClick={() => clickProduct()}>
            {product._lvt_productinformation_value ? (
              <Image
                productId={product._lvt_productinformation_value}
                MSFTToken={MSFTToken}
                type="productInfoFamily"
              />
            ) : (
              <Image productId={product.lvt_productid} MSFTToken={MSFTToken} />
            )}
            <span className="new-item">New</span>
          </div>
          <div className="category-item-title">
            <h3>
              {isAccessories
                ? product?.lvt_name
                : product?.lvt_ProductInformation?.lvt_name}
            </h3>
          </div>

          <div className="category-item-specs">
            {isAccessories &&
            (product?.price || product?.lvt_unitpriceexgst) ? (
              <span className="acc-price text-bold">
                {numberCurrency(
                  isExPrice ? product?.lvt_unitpriceexgst : product?.price
                )}{" "}
                {isExPrice ? "ex. GST" : "in. GST"}
              </span>
            ) : null}
            {product.lvt_ProductInformation && (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    product.lvt_ProductInformation.lvt_devicegroupdescription,
                }}
              ></div>
            )}
            {isAccessories && product?.lvt_accessorydescription ? (
              <div
                style={{ marginTop: "20px" }}
                dangerouslySetInnerHTML={{
                  __html: product?.lvt_accessorydescription,
                }}
              ></div>
            ) : null}
          </div>
        </div>
        <div className="category-item-btn">
          <a
            aria-label={"Learn more about " + product?.lvt_name}
            onClick={() => clickProduct()}
          >
            <div>Learn more {">"}</div>
          </a>

          {isAccessories ? (
            <a onClick={() => clickAddToCart()}>
              <div>+ Add To Cart</div>
            </a>
          ) : (
            <a onClick={() => clickConfigure()}>
              <div>+ Configure Now</div>
            </a>
          )}
        </div>
      </div>
    </ProdCard>
  );
};
export default ProductCardComponent;

const ProdCard = styled.div`
  height: 100%;
  position: relative;
  display: block;
  box-shadow: 0 3px 6px rgb(0 0 0 / 15%);
  border-radius: 4px;
`;
