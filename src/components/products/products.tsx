import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import ProductCardComponent from "./productcard";
import ProductTopNavComponent from "../common/ProductTopNav";
import { IProductEntity } from "../../services/type.interface";
import { getURLParam } from "../../helpers/common";
import { useLocation } from "react-router-dom";
import Loading from "../common/Loading";
import styled from "styled-components";

const ProductsComponents = () => {
  const GlobalStore: any = useContext(AppContext);
  const {
    prodService,
    setAudience,
    ProductType,
    accountId,
    Navigate,
    setStep,
    MSFTToken,
    setProductType,
  } = GlobalStore;

  const limitPerDisplay = 9;
  const [loadedProducts, setLoadedProducts] = useState<number>(limitPerDisplay);
  const [page, setPage] = useState<number>(null);
  const [noProducts, setNoProducts] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [products, setProducts] = useState<IProductEntity[]>([]);
  const [ProductsCopy, setProductsCopy] = useState<IProductEntity[]>([]);

  let location = useLocation();

  const onFilterSelect = (filter, selected) => {
    const _products: IProductEntity[] = ProductsCopy;
    const _final_list = selected
      ? _products.filter(
          (item: IProductEntity) => item.category_caption === filter
        )
      : _products;

    setProducts(_final_list);
  };

  useEffect(() => {
    const type = getURLParam("type"); //should be int always
    const aud = getURLParam("aud");
    if (aud && aud !== "") {
      setAudience(aud);
    }

    setProducts([]);
    setNoProducts(false);

    if (type) {
      setProductType(Number(type) > 0 ? Number(type) : 1);
    }
    setStep(2);
  }, [location, MSFTToken, accountId]);

  useEffect(() => {
    const _page: number = parseInt(`${getURLParam("page") || 1}`);
    setPage(_page);
  }, [location]);

  useEffect(() => {
    if (page && ProductType && accountId) {
      getProducts(page);
    }
  }, [page, ProductType]);

  const getProducts = async (page) => {
    //console.log("product fetching...");
    setNoProducts(false);
    setIsFetching(true);
    prodService.setGlobalStore(GlobalStore); //update global vars
    prodService
      .GetProducts(page)
      .then((_products: any) => {
        //console.log(_products);
        setProducts(_products);
        setProductsCopy(_products);
        setNoProducts(_products.length > 0 ? false : true);
        setIsFetching(false);
      })
      .catch((e) => {
        setIsFetching(false);
        setNoProducts(true);
      });
  };

  if (!products) {
    return <Loading />;
  }

  return (
    <div className="products-section">
      <ProductTopNavComponent />

      {noProducts && (
        <div style={{ textAlign: "center" }}>
          No products under this category!
        </div>
      )}

      {isFetching ? (
        <Loading />
      ) : (
        <div className="row products-list">
          {products
            .filter((val, index) => index < loadedProducts)
            .map((item: IProductEntity) => {
              return (
                <div className="column-4">
                  <ProductCardComponent
                    ProductType={ProductType}
                    prodService={prodService}
                    product={item}
                    MSFTToken={MSFTToken}
                    Navigate={Navigate}
                  />
                </div>
              );
            })}
        </div>
      )}

      {loadedProducts + limitPerDisplay < products.length && (
        <PaginationBox>
          <button
            onClick={() => {
              setLoadedProducts(loadedProducts + limitPerDisplay);
            }}
          >
            Load More
          </button>
        </PaginationBox>
      )}
    </div>
  );
};

export default ProductsComponents;

const PaginationBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding-bottom: 100px;

  button {
    padding: 10px;
    min-width: 100px;
    background: rgb(51, 118, 205);
    color: rgb(255, 255, 255);
  }
`;
