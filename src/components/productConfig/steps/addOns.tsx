import React, { Fragment, useEffect, useState, useContext } from "react";
import AppContext from "../../../AppContext";
import { numberCurrency } from "../../../helpers/common";
import { ISpecificationList } from "../../../services/type.interface";
import styled from "styled-components";

export interface IAddOns {
  OSList: ISpecificationList[];
  ProtList: ISpecificationList[];
  curOS: ISpecificationList;
  curPlan: ISpecificationList;
  errorText: string;
  onChangeCurOS?: (OS: ISpecificationList) => void;
  onChangeCurPlan?: (Plan: ISpecificationList) => void;
}

const addOns = ({
  OSList,
  ProtList,
  curOS,
  curPlan,
  errorText,
  onChangeCurOS,
  onChangeCurPlan,
}: IAddOns) => {
  const [currentSelectedOS, setCurrentSelectedOS] =
    useState<ISpecificationList>();
  const [currentSelectedPlans, setCurrentSelectedPlans] =
    useState<ISpecificationList>();
  const GlobalStore: any = useContext(AppContext);
  const { productIDNONE, productIDCONTACT } = GlobalStore;

  const onClickChangeCurrConfig = (priceItemListId) => {
    const newConfig = OSList.find((con) => {
      return con.lvt_pricelistitemid === priceItemListId;
    });
    setCurrentSelectedOS(newConfig);
    onChangeCurOS(newConfig);
  };

  const onClickChangeCurrPlan = (priceItemListId) => {
    if (priceItemListId) {
      const newConfig = ProtList.find((con) => {
        return con.lvt_pricelistitemid === priceItemListId;
      });
      setCurrentSelectedPlans(newConfig);
      onChangeCurPlan(newConfig);
    }
  };

  useEffect(() => {
    setCurrentSelectedOS(curOS);
    setCurrentSelectedPlans(curPlan);
    console.log("Protection list: ", ProtList);
  }, [curOS, curPlan]);

  return (
    <Fragment>
      <div className="item-config-list">
        <div className="item-config-list-container">
          {OSList && OSList.length > 0 ? (
            <div className="item-config-title-desc">
              <label>Operating Systems</label>
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum
              </p>
            </div>
          ) : null}

          <div className="item-config-list-contents">
            <div className="row">
              {OSList &&
                OSList.map((os) => (
                  <div className="column-6">
                    <button
                      onClick={() =>
                        onClickChangeCurrConfig(os.lvt_pricelistitemid)
                      }
                      className={
                        "item-config" +
                        (currentSelectedOS?.lvt_pricelistitemid ===
                        os.lvt_pricelistitemid
                          ? " selected"
                          : "")
                      }
                    >
                      {currentSelectedOS?.lvt_pricelistitemid ===
                        os.lvt_pricelistitemid && (
                        <span className="selection">
                          <Checkmark className="checkmark"></Checkmark>
                        </span>
                      )}
                      <div className="item-config-container">
                        {os.product.lvt_name && (
                          <div className="item-config-short-desc">
                            <p>{os.product.lvt_name}</p>
                          </div>
                        )}

                        {os?.product?.lvt_description && (
                          <div className="item-config-desc">
                            <p>{os?.product?.lvt_description}</p>
                          </div>
                        )}
                        <div className="item-config-price"></div>
                      </div>
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {ProtList && ProtList.length > 0 ? (
            <div className="item-config-title-desc">
              <label>
                Microsoft Protection Plan
                {errorText && <span className="error">{errorText}</span>}
              </label>
              <p>
                Stay covered with a protection plan. Get the support your
                organization may need for its new Surface devices.
              </p>
            </div>
          ) : null}

          <div className="item-config-list-contents">
            {ProtList && (
              <div className="row">
                {ProtList.map((plan) => (
                  <div className="column-6">
                    <button
                      onClick={() =>
                        onClickChangeCurrPlan(plan.lvt_pricelistitemid)
                      }
                      className={
                        "item-config" +
                        (currentSelectedPlans?.lvt_pricelistitemid ===
                        plan.lvt_pricelistitemid
                          ? " selected"
                          : "")
                      }
                    >
                      <span className="selection">
                        <Checkmark className="checkmark"></Checkmark>
                      </span>
                      <div className="item-config-container">
                        <div className="item-config-desc-container">
                          {plan.product.lvt_name
                            .toLowerCase()
                            .includes("none") ||
                          plan.product.lvt_name
                            .toLowerCase()
                            .includes("contact") ? null : (
                            <div className="item-config-short-desc">
                              <p>{plan.product.lvt_name}</p>
                            </div>
                          )}

                          {plan?.product?.lvt_description && (
                            <div className="item-config-desc">
                              <p>{plan?.product?.lvt_description}</p>
                            </div>
                          )}
                        </div>
                        {!plan.product.lvt_name
                          .toLowerCase()
                          .includes("none") &&
                          !plan.product.lvt_name
                            .toLowerCase()
                            .includes("contact") && (
                            <div className="item-config-price">
                              {numberCurrency(plan?.lvt_unitpriceexgst)} ex. GST
                            </div>
                          )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const Checkmark = styled.span`
  position: absolute;
  top: 2px;
  left: 4px;
  height: 20px;
  width: 20px;
  border-radius: 50px;
  &:after {
    content: "";
    position: absolute;
    display: block;
  }

  &.checkmark:after {
    left: 7px;
    top: 3px;
    width: 3px;
    height: 8px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

export default addOns;
