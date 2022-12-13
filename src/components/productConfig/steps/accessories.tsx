import React, { useContext, useEffect, useState } from "react";
import { ISpecificationList } from "../../../services/type.interface";
import AppContext from "../../../AppContext";
import CheckBox from "../../components/CheckBox";
import Image from "../../common/Image";
import { numberCurrency } from "../../../helpers/common";

export interface IAccessoriesProps {
  myAccessories: ISpecificationList[];
  currentAccessories: ISpecificationList[];
  isExPrice?: boolean;
  onCurSelectAccessories?: (Accessories: ISpecificationList[]) => void;
}

const accessories = ({
  myAccessories,
  currentAccessories,
  isExPrice = true,
  onCurSelectAccessories,
}: IAccessoriesProps) => {
  const GlobalStore: any = useContext(AppContext);
  const { MSFTToken } = GlobalStore;
  const [currentSelectedAccessories, setCurrentSelectedAccessories] = useState<
    ISpecificationList[]
  >([]);

  const onClickChangeCurrConfig = (priceItemListId) => {
    if (currentSelectedAccessories && currentSelectedAccessories.length > 0) {
      const acc = currentSelectedAccessories.findIndex((con) => {
        return con.lvt_pricelistitemid === priceItemListId;
      });

      if (acc < 0) {
        //console.log("Not exists");
        let newCons: ISpecificationList[] = [];
        currentSelectedAccessories.forEach((access) => {
          newCons.push(access);
        });
        const newConfig = myAccessories.find((con) => {
          return con.lvt_pricelistitemid === priceItemListId;
        });
        newCons.push(newConfig);
        setCurrentSelectedAccessories(newCons);
        onCurSelectAccessories(newCons);
      } else {
        //console.log("exists");
        let newCons: ISpecificationList[] = [];
        currentSelectedAccessories.forEach((access, i) => {
          if (access.lvt_pricelistitemid !== priceItemListId) {
            newCons.push(access);
          }
        });
        setCurrentSelectedAccessories(newCons);
        onCurSelectAccessories(newCons);
      }
    } else {
      let newCons: ISpecificationList[] = [];
      const newConfig = myAccessories.find((con) => {
        return con.lvt_pricelistitemid === priceItemListId;
      });
      newCons.push(newConfig);
      setCurrentSelectedAccessories(newCons);
      onCurSelectAccessories(newCons);
    }
  };

  const onChecked = (id: string, value: string, isChecked: boolean) => {
    onClickChangeCurrConfig(value);
  };

  useEffect(() => {
    //console.log("myAccessories", myAccessories);
    setCurrentSelectedAccessories(currentAccessories);
  }, [currentAccessories]);

  return (
    <div className="item-config-list">
      <div className="item-config-list-container">
        <div className="item-config-title-desc">
          <label>Add Accessories (Optional)</label>
          <p>
            {
              // Do some stuff here
            }
          </p>
        </div>
        <div className="item-config-list-contents">
          <div className="row">
            <div className="previews-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                fill="currentColor"
              >
                <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
              </svg>
            </div>
            {myAccessories &&
              myAccessories.map((acce, index) => (
                <div className="column-6">
                  <div className="category-item">
                    <div className="accessory-img-container">
                      <div className="accessory-top-container">
                        <div className="category-item-img">
                          <Image
                            productId={acce?.product.lvt_productid}
                            MSFTToken={MSFTToken}
                          />
                        </div>
                        <div className="category-item-title">
                          {acce.product.lvt_name}
                        </div>
                        <div className="category-item-description">
                          {numberCurrency(
                            isExPrice
                              ? acce?.lvt_unitpriceexgst
                              : acce?.lvt_priceincludegst_base
                          )}{" "}
                          {isExPrice ? "ex. GST" : "in. GST"}
                        </div>
                        <div className="accessories-item-specs">
                          <div
                            style={{ margin: "0 15px", marginTop: "15px" }}
                            dangerouslySetInnerHTML={{
                              __html: acce?.product?.lvt_accessorydescription,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="accessory-bottom-container">
                        <div className="category-item-btn">
                          <CheckBox
                            onChecked={onChecked}
                            value={acce.lvt_pricelistitemid}
                            text={"Select"}
                            textChecked={"Selected"}
                            isChecked={
                              currentSelectedAccessories?.find((accessory) => {
                                return (
                                  accessory.lvt_pricelistitemid ===
                                  acce.lvt_pricelistitemid
                                );
                              })
                                ? true
                                : false
                            }
                            id={""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            <div className="next-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 512"
                fill="currentColor"
              >
                <path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
<input type="checkbox" id={"contactChoice"+index} onClick={() => onClickChangeCurrConfig(acce.lvt_pricelistitemid)} />
<label htmlFor={"contactChoice"+index}>Select</label>
*/

export default accessories;
