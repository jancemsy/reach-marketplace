import React, { useEffect, useState, useContext, Fragment } from "react";
import { Icon } from "office-ui-fabric-react";
import ConfigStep from "../navigation/configStep";
import Specification from "./steps/specification";
import AddOns from "./steps/addOns";
import { numberCurrency } from "../../helpers/common";
import Accessories from "./steps/accessories";
import AppContext from "../../AppContext";
import CartList from "./list/cart";
import {
  IProductEntity,
  ISpecificationList,
  IProdConfigEntity,
} from "../../services/type.interface";
import {
  useFetchProducts,
  fetchPriceList,
  fetchProductCategory,
  useFetchCategoryOptions,
} from "../../services/useQueries";
import styled from "styled-components";
import Loading from "../common/Loading";
import { getURLParam } from "../../helpers/common";
import Image from "../common/Image";
import ProductTopNavComponent from "../common/ProductTopNav";

const productConfig = () => {
  const GlobalStore: any = useContext(AppContext);
  const {
    productIDCONTACT,
    prodService,
    Navigate,
    MSFTToken,
    setStep,
    accountId,
    Audience,
  } = GlobalStore;
  const [specificationError, setspecificationError] = useState<string>("");
  const [plansError, setPlansError] = useState<string>("");
  const [productId, setProductId] = useState<string>();
  const [priceItemList, setPriceItemList] = useState<string>();
  const [from, setFrom] = useState<string>(getURLParam("from") || "");
  const [itemId, setItemId] = useState<string>(getURLParam("itemId") || "");
  const [prodId, setProdId] = useState<string>(getURLParam("prodId") || "");
  const [isListOpen, setIsListOpen] = useState<boolean>(false);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentProduct, setCurrentProduct] = useState<IProductEntity>();
  const [products, setProducts] = useState<IProductEntity[]>();

  const [subtotal, setSubtotal] = useState<number>(0.0);

  const [mySpecificationList, setMySpecificationList] =
    useState<ISpecificationList[]>();
  const [myOSList, setMyOSList] = useState<ISpecificationList[]>();
  const [myProtPlanList, setMyProtPlanList] = useState<ISpecificationList[]>();
  const [myAccessories, setMyAccessories] = useState<ISpecificationList[]>();
  const [currentSelectedSpecification, setCurrentSelectedSpecification] =
    useState<ISpecificationList>();
  const [currentSelectedOS, setCurrentSelectedOS] =
    useState<ISpecificationList>();
  const [currentSelectedProdPlan, setCurrentSelectedProdPlan] =
    useState<ISpecificationList>(null);
  const [currentSelectedAccessories, setCurrentSelectedAccessories] =
    useState<ISpecificationList[]>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [submitCartLoading, setSubmitCartLoading] = useState<boolean>(false);
  const [onChangeCount, setonChangeCount] = useState<number>(0);

  const onChangeAccessories = (accessories: ISpecificationList[]) => {
    setCurrentSelectedAccessories(accessories);
    organizeSubTotalPrice(
      currentStep,
      currentSelectedSpecification,
      currentSelectedOS,
      currentSelectedProdPlan,
      accessories
    );
  };

  const onChangeSpecification = (Specification: ISpecificationList) => {
    setCurrentSelectedSpecification(Specification);
    organizeSubTotalPrice(
      currentStep,
      Specification,
      currentSelectedOS,
      currentSelectedProdPlan,
      currentSelectedAccessories
    );
  };

  const onChangeOS = (os: ISpecificationList) => {
    const newOS = os;
    newOS.quantity = currentSelectedSpecification.quantity;
    setCurrentSelectedOS(newOS);
    organizeSubTotalPrice(
      currentStep,
      currentSelectedSpecification,
      newOS,
      currentSelectedProdPlan,
      currentSelectedAccessories
    );
  };

  const onChangePlan = (plan: ISpecificationList) => {
    if (plan) {
      const newPlan = plan;
      newPlan.quantity = currentSelectedSpecification.quantity;
      setCurrentSelectedProdPlan(newPlan);
      organizeSubTotalPrice(
        currentStep,
        currentSelectedSpecification,
        currentSelectedOS,
        newPlan,
        currentSelectedAccessories
      );
    } else {
      setCurrentSelectedProdPlan(null);
      organizeSubTotalPrice(
        currentStep,
        currentSelectedSpecification,
        currentSelectedOS,
        null,
        currentSelectedAccessories
      );
    }
  };

  const getAddOnsId = async () => {
    //console.log("getAddOnsId()");
    const ProdCats = await getAllProductCategories();
    //console.log(ProdCats);
    if (ProdCats?.length > 0) {
      const OSId = ProdCats.find((cat) => {
        return cat.Label.UserLocalizedLabel.Label === "OS";
      })?.Value;
      const ProdProtectionId = ProdCats.find((cat) => {
        return cat.Label.UserLocalizedLabel.Label === "Warranty";
      })?.Value;
      const AccessoryId = ProdCats.find((cat) => {
        return cat.Label.UserLocalizedLabel.Label === "Accessories";
      })?.Value;

      console.log("ProdProtectionId: ", ProdProtectionId);

      const OSProds = await getProductsByProdCategory(OSId);
      const ProtPlans = await getProductsByProdCategory(
        ProdProtectionId,
        currentProduct?.lvt_productcategory
      );
      console.log("ProtPlans: ", ProdProtectionId);
      const Accessories = await getProductsByProdCategory(AccessoryId);
      //await getPriceListByProdId(OSProds).then((res) => {
      //    setMyOSList(res);
      //    setCurrentSelectedOS(res[0]);
      //});
      await getPriceListByProdId(ProtPlans).then((res) => {
        const sortedArr = res.sort(
          (a, b) => a.lvt_unitpriceexgst - b.lvt_unitpriceexgst
        );
        console.log("ProtPlans: ", ProdProtectionId);
        setMyProtPlanList(sortedArr);
        //setCurrentSelectedProdPlan(res[0]);
      });
      await getPriceListByProdId(Accessories).then((res) => {
        const sortedArr = res.sort(
          (a, b) => a.lvt_unitpriceexgst - b.lvt_unitpriceexgst
        );
        setMyAccessories(sortedArr);
      });
    }
  };

  const getAllProductCategories = async () => {
    try {
      return await useFetchCategoryOptions(MSFTToken)
        .then((res) => {
          if (res?.Options?.length > 0) {
            return res.Options;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getProdCatByName = async (name: string) => {
    try {
      const query = `$filter=lvt_name eq '${name}'`;
      return await fetchProductCategory(MSFTToken, query)
        .then((res) => {
          if (res?.value?.length > 0) {
            return res.value[0].lvt_productcategoryid;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getPriceListByProdId = async (products: IProductEntity[]) => {
    try {
      const newConfifList: ISpecificationList[] = [];
      for (let i = 0; i < products?.length; i++) {
        const query = `$filter=_lvt_product_value eq '${products[i].lvt_productid}' and _lvt_owningaccount_value eq ${accountId}`;
        await fetchPriceList(MSFTToken, query)
          .then((res) => {
            if (res?.value?.length > 0) {
              newConfifList.push({
                product: products[i],
                exchangerate: res?.value[0].exchangerate,
                lvt_priceincludegst: res?.value[0].lvt_priceincludegst,
                lvt_priceincludegst_base:
                  res?.value[0].lvt_priceincludegst_base,
                lvt_unitpriceexgst: res?.value[0].lvt_unitpriceexgst,
                lvt_pricelistitemid: res?.value[0].lvt_pricelistitemid,
                lvt_taxvalue: res?.value[0].lvt_taxvalue,
                quantity: 1,
                totalprice: res?.value[0].lvt_unitpriceexgst,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      return newConfifList;
    } catch (err) {
      console.log(err);
    }
  };

  const getProductById = async () => {
    try {
      //console.log("getProductById()");
      const query = `$filter=lvt_productid eq '${productId}'`;
      await useFetchProducts(MSFTToken, query)
        .then((res) => {
          if (res?.value?.length > 0) {
            //console.log(res.value[0]);
            setCurrentProduct(res.value[0]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getProductsByProdCategory = async (CatId, warrantCat?: string) => {
    try {
      //console.log("getProductsByProdCategory()");
      let query = `$filter=lvt_productcategory eq ${CatId}`;

      if (warrantCat) {
        query += ` and Microsoft.Dynamics.CRM.ContainValues(PropertyName=%27lvt_warrantyproductcategory%27,PropertyValues=%5B%27${warrantCat}%27%5D)`;
        //console.log(query);
      }

      return await useFetchProducts(MSFTToken, query)
        .then((res) => {
          if (res?.value?.length > 0) {
            return res.value;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getProductsByProdInfo = async (infoId) => {
    try {
      //sconsole.log("getProductsByProdInfo()");
      const query = `$filter=_lvt_productinformation_value eq '${infoId}'`;
      return await useFetchProducts(MSFTToken, query)
        .then((res) => {
          if (res?.value?.length > 0) {
            return res.value;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeSpecQuantity = (quantity: number, totalprice: number) => {
    let newSpec = currentSelectedSpecification;
    newSpec.quantity = quantity;
    newSpec.totalprice = totalprice * quantity;
    setCurrentSelectedSpecification(newSpec);
    organizeSubTotalPrice(
      currentStep,
      newSpec,
      currentSelectedOS,
      currentSelectedProdPlan,
      currentSelectedAccessories
    );
    if (currentSelectedOS) {
      onChangeOSQuantity(quantity, currentSelectedOS.lvt_unitpriceexgst);
    }

    if (currentSelectedProdPlan) {
      onChangePlanQuantity(
        quantity,
        currentSelectedProdPlan.lvt_unitpriceexgst,
        newSpec
      );
    }
  };

  const onChangeOSQuantity = (quantity: number, totalprice: number) => {
    let newSpec = currentSelectedOS;
    newSpec.quantity = quantity;
    newSpec.totalprice = totalprice * quantity;
    setCurrentSelectedOS(newSpec);
    organizeSubTotalPrice(
      currentStep,
      currentSelectedSpecification,
      newSpec,
      currentSelectedProdPlan,
      currentSelectedAccessories
    );
  };

  const onChangePlanQuantity = (
    quantity: number,
    totalprice: number,
    specdata?: ISpecificationList
  ) => {
    //console.log(specdata);
    //setonChangeCount(onChangeCount+1)
    let newSpec = currentSelectedProdPlan;
    newSpec.quantity = quantity;
    newSpec.totalprice = totalprice * quantity;
    setCurrentSelectedProdPlan(newSpec);
    organizeSubTotalPrice(
      currentStep,
      specdata,
      currentSelectedOS,
      newSpec,
      currentSelectedAccessories
    );
  };

  const onChangeAccessoriesQuantity = (
    quantity: number,
    totalprice: number,
    id: string
  ) => {
    const newAccessory = currentSelectedAccessories.find((acc) => {
      return acc.lvt_pricelistitemid === id;
    });
    newAccessory.quantity = quantity;
    newAccessory.totalprice = totalprice * quantity;
    organizeSubTotalPrice(
      currentStep,
      currentSelectedSpecification,
      currentSelectedOS,
      currentSelectedProdPlan,
      currentSelectedAccessories
    );
  };

  const organizeSubTotalPrice = (
    step: number,
    currentSelectedSpecification: ISpecificationList,
    currentSelectedOS: ISpecificationList,
    currentSelectedProdPlan: ISpecificationList,
    currentSelectedAccessories: ISpecificationList[]
  ) => {
    switch (currentStep) {
      case 1:
        setSubtotal(currentSelectedSpecification.totalprice);
        break;
      case 2:
        const PlanTotal = currentSelectedProdPlan
          ? currentSelectedProdPlan.totalprice
          : 0;
        setSubtotal(currentSelectedSpecification.totalprice + PlanTotal);
        break;
      case 3:
        const PlanTotal2 = currentSelectedProdPlan
          ? currentSelectedProdPlan.totalprice
          : 0;
        let preTotal = 0;
        //console.log("PlanTotal2: ", PlanTotal2);
        if (
          currentSelectedAccessories &&
          currentSelectedAccessories.length > 0
        ) {
          currentSelectedAccessories?.forEach((acc) => {
            preTotal += acc.totalprice;
          });
        }
        //console.log("preTotal: ", preTotal);
        setSubtotal(
          currentSelectedSpecification.totalprice + PlanTotal2 + preTotal
        );
        break;
      default:
        break;
    }
  };

  const checkAddOns = () => {
    setPlansError("");
    let isValid = false;

    if (currentSelectedProdPlan) {
      isValid = true;
    }
    return isValid;
  };

  const checkSpecification = () => {
    setspecificationError("");
    let isValid = false;

    if (currentSelectedSpecification) {
      isValid = true;
    }
    return isValid;
  };

  const onStepChange = (step) => {
    if (step === 2) {
      if (!checkSpecification()) {
        setspecificationError("Please Select a Specification");
        return;
      }
    }
    if (step === 3) {
      if (!checkAddOns()) {
        setPlansError("Please Select a Protection Plan");
        return;
      }
    }
    if (step > 3) {
      //add validation here later.

      if (submitCartLoading === false) {
        //can submit only once
        setSubmitCartLoading(true);
        prodService
          .SubmitCart({
            currentSelectedSpecification,
            currentSelectedOS,
            currentSelectedProdPlan,
            currentSelectedAccessories,
          })
          .then((result) => {
            if (result) {
              Navigate("/cart/mycart");
            } else {
              //error here. Handle here...
              setSubmitCartLoading(false);
            }
          });
      }
    } else {
      setCurrentStep(step);
      organizeSubTotalPrice(
        step,
        currentSelectedSpecification,
        currentSelectedOS,
        currentSelectedProdPlan,
        currentSelectedAccessories
      );
    }
  };

  const clickBack = () => {
    Navigate(
      from === "product"
        ? `/product/detail?itemId=${itemId}&prodId=${prodId}`
        : `/products?aud=${Audience}`
    );
  };

  useEffect(() => {
    if (products?.length > 0) {
      getPriceListByProdId(products).then((res) => {
        const sortedArr = res.sort(
          (a, b) => a.lvt_unitpriceexgst - b.lvt_unitpriceexgst
        );
        organizeSubTotalPrice(
          currentStep,
          sortedArr[0],
          currentSelectedOS,
          currentSelectedProdPlan,
          currentSelectedAccessories
        );
        setCurrentSelectedSpecification(sortedArr[0]);
        setMySpecificationList(sortedArr);
        setLoading(false);
      });
    }
  }, [products]);

  useEffect(() => {
    if (currentProduct?._lvt_productinformation_value) {
      getProductsByProdInfo(currentProduct?._lvt_productinformation_value).then(
        setProducts
      );
      getAddOnsId();
    }
  }, [currentProduct?._lvt_productinformation_value]);

  useEffect(() => {
    if (productId && MSFTToken) {
      getProductById();
    }
  }, [MSFTToken, productId]);

  useEffect(() => {
    const id = getURLParam("prodId");
    setProductId(id);
    setStep(2);
  }, []);

  return (
    <section className="body">
      <div className="store">
        <div className="mobile-top-nav" style={{ display: "none" }}>
          <ProductTopNavComponent />
        </div>
        <BackLink className="back-link-desktop" onClick={() => clickBack()}>
          {from !== "product"
            ? "Back to product list"
            : "Back to product detail"}
        </BackLink>
        <div className="row">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="msft-item-details">
              <div className="msft-item-container">
                <div className="msft-config-container">
                  <div className="msft-config-details">
                    <div className="msft-config-title">
                      <div className="mobile-msft-config-cart-img">
                        <Image
                          productId={
                            currentSelectedSpecification?.product?.lvt_productid
                          }
                          MSFTToken={MSFTToken}
                        />
                      </div>
                      <h1 className="title">
                        Build your{" "}
                        {
                          currentProduct?.[
                            "_lvt_productinformation_value@OData.Community.Display.V1.FormattedValue"
                          ]
                        }
                      </h1>
                      <p>{currentProduct?.lvt_overview_typing_description}</p>
                    </div>
                    <ConfigStep step={currentStep} />
                    {currentStep === 1 ? (
                      <Specification
                        errorText={specificationError}
                        currentSpecification={currentSelectedSpecification}
                        mySpecificationList={mySpecificationList}
                        onCurSelectSpecification={onChangeSpecification}
                      />
                    ) : currentStep === 2 ? (
                      <AddOns
                        errorText={plansError}
                        onChangeCurPlan={onChangePlan}
                        onChangeCurOS={onChangeOS}
                        curPlan={currentSelectedProdPlan}
                        curOS={currentSelectedOS}
                        ProtList={myProtPlanList}
                        OSList={myOSList}
                      />
                    ) : currentStep === 3 ? (
                      <Accessories
                        onCurSelectAccessories={onChangeAccessories}
                        myAccessories={myAccessories}
                        currentAccessories={currentSelectedAccessories}
                      />
                    ) : null}
                  </div>
                  <div className="msft-config-cart">
                    <div className="msft-config-cart-container">
                      <div className="msft-config-cart-img">
                        <Image
                          productId={
                            currentSelectedSpecification?.product?.lvt_productid
                          }
                          MSFTToken={MSFTToken}
                        />
                      </div>
                      <div className="msft-mobile-subtotal">
                        <div
                          className={
                            "subtotal-title" + (isListOpen ? " shadow" : "")
                          }
                          onClick={() => setIsListOpen(!isListOpen)}
                        >
                          <div className="title">
                            <Icon
                              iconName={
                                isListOpen
                                  ? "ChevronUpSmall"
                                  : "ChevronDownSmall"
                              }
                            />
                            <label>Subtotal</label>
                          </div>
                          <div className="price">
                            {numberCurrency(subtotal)}
                          </div>
                        </div>
                      </div>
                      <div className="msft-config-cart-items-list">
                        <div className="cart-summary-header">
                          <div className="title">
                            <h2>Summary</h2>
                          </div>
                          <div className="quantity-price">
                            <div className="quantity">
                              <label>QTY</label>
                            </div>
                            <div className="price">
                              <label>Price</label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "my-msft-cart-container" +
                            (isListOpen ? " show" : "")
                          }
                        >
                          <CartList
                            showQuantityPrice={true}
                            onChangeQuantity={onChangeSpecQuantity}
                            quantity={currentSelectedSpecification?.quantity}
                            price={
                              currentSelectedSpecification?.lvt_unitpriceexgst
                            }
                          >
                            <p>
                              {
                                currentSelectedSpecification?.product
                                  ?.lvt_colour
                              }
                            </p>
                            <p>
                              Intel Core{" "}
                              {currentSelectedSpecification?.product?.lvt_processor?.toLowerCase()}
                            </p>
                            <p>
                              {currentSelectedSpecification?.product?.lvt_ram}
                            </p>
                            <p>
                              {currentSelectedSpecification?.product?.lvt_hdd}
                            </p>
                            <p>
                              {currentSelectedSpecification?.product?.lvt_os}
                            </p>
                          </CartList>
                          {currentStep > 1 ? (
                            <Fragment>
                              {currentSelectedOS && (
                                <CartList
                                  showQuantityPrice={true}
                                  onChangeQuantity={onChangeOSQuantity}
                                  quantity={currentSelectedOS?.quantity}
                                  price={currentSelectedOS?.lvt_unitpriceexgst}
                                >
                                  <b>{currentSelectedOS?.product.lvt_name}</b>
                                  <p>
                                    {currentSelectedOS?.product.lvt_description}
                                  </p>
                                </CartList>
                              )}
                              {currentSelectedProdPlan &&
                                currentSelectedProdPlan?.lvt_pricelistitemid &&
                                !currentSelectedProdPlan?.product?.lvt_name
                                  .toLowerCase()
                                  .includes("contact") && (
                                  <CartList
                                    onChangeCount={onChangeCount}
                                    isEditable={false}
                                    showQuantityPrice={
                                      !currentSelectedProdPlan.product.lvt_name
                                        .toLowerCase()
                                        .includes("none")
                                    }
                                    onChangeQuantity={(quantity, totalprice) =>
                                      onChangePlanQuantity(quantity, totalprice)
                                    }
                                    quantity={currentSelectedProdPlan.quantity}
                                    price={
                                      currentSelectedProdPlan.lvt_unitpriceexgst
                                    }
                                  >
                                    <b>
                                      {currentSelectedProdPlan.product.lvt_name
                                        .toLowerCase()
                                        .includes("none")
                                        ? "No warranty"
                                        : currentSelectedProdPlan.product
                                            .lvt_name}
                                    </b>
                                  </CartList>
                                )}
                            </Fragment>
                          ) : null}
                          {currentStep > 2
                            ? currentSelectedAccessories &&
                              currentSelectedAccessories.map((acc) => (
                                <CartList
                                  id={acc.lvt_pricelistitemid}
                                  showQuantityPrice={true}
                                  onChangeQuantity={onChangeAccessoriesQuantity}
                                  quantity={acc?.quantity}
                                  price={acc?.lvt_unitpriceexgst}
                                >
                                  <b>{acc?.product.lvt_name}</b>
                                </CartList>
                              ))
                            : null}
                        </div>

                        <div className="sub-total">
                          <div>
                            Subtotal<span> (ex. GST)</span>
                          </div>
                          <div>{numberCurrency(subtotal)}</div>
                        </div>
                        <div className="msft-cart-btn-container">
                          {submitCartLoading ? (
                            <Loading />
                          ) : (
                            <>
                              {currentStep === 1 ? null : (
                                <button
                                  onClick={() => onStepChange(currentStep - 1)}
                                >
                                  Back
                                </button>
                              )}
                              <button
                                className={
                                  currentStep === 1 ? "full-width" : ""
                                }
                                onClick={() => onStepChange(currentStep + 1)}
                              >
                                Next
                              </button>
                            </>
                          )}
                        </div>
                        <div className="delivery-container">
                          <p>Free standard delivery. Free returns.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const BackLink = styled.div`
  font-weight: bold;
  color: #3376cd;
  margin-bottom: 20px;
  padding-left: 50px;
  cursor: pointer;
  font-size: 16px;
  text-decoration: underline;
  @media (max-width: 1037px) {
    padding-left: 0px;
  }
`;

export default productConfig;
