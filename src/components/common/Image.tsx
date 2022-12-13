import React, { useState, useEffect } from "react";
import noimage from "../../assets/images/no-image.jpg";
import {
  GetThumbnail,
  GetThumbnailProdInfoGallery,
  GetThumbnailProdInfoFamily,
  GetThumbnailAccount,
} from "../../helpers/common";
import Loading from "./Loading";
import styled from "styled-components";
import { IProductEntity } from "../../services/type.interface";

function Image({
  productId,
  MSFTToken,
  type = "product",
}: {
  productId: string;
  MSFTToken: string;
  type?: string;
}) {
  const [isImgLoading, setIsImgLoading] = useState<boolean>(true);
  const [productImage, setActualProductImage] = useState<any>(noimage);

  const setProductImage = (image) => {
    setIsImgLoading(false);

    if (image) {
      setActualProductImage(image);
    }
  };

  useEffect(() => {
    if (productId) {
      switch (type) {
        case "product":
          GetThumbnail(productId, MSFTToken, setProductImage);
          break;
        case "productInfoGallery":
          GetThumbnailProdInfoGallery(productId, MSFTToken, setProductImage);
          break;
        case "productInfoFamily":
          GetThumbnailProdInfoFamily(productId, MSFTToken, setProductImage);
          break;
        case "Account":
          GetThumbnailAccount(productId, MSFTToken, setProductImage);
          break;
        default:
          break;
      }
    }
  }, [productId]);

  return (
    <ImageCard>
      <div
        className={isImgLoading ? "loading image-container" : "image-container"}
      >
        <img
          style={{ opacity: isImgLoading ? "0.5" : "1" }}
          src={productImage}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = noimage;
          }}
        />
      </div>
    </ImageCard>
  );
}

export default Image;

/*
if(product.lvt_ProductInformation){
        setActualProductImage("data:image/png;base64," + product.lvt_ProductInformation.lvt_productfamilyimage);
        setIsImgLoading(false);
      }else{
        GetThumbnail(product.lvt_productid, MSFTToken, setProductImage);
      }
*/

const ImageCard = styled.div`
  position: relative;
  height: 100%;

  .image-container {
    display: flex;
    justify-content: center;
    height: 100%;
  }

  .image-container.loading {
    animation: blink 1.7s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
  }

  .image-container img {
    align-items: stretch;
  }

  @keyframes blink {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.8;
    }
  }
`;
