import React, { Fragment, useEffect, useState, useContext } from "react";
import {
  ICart,
  ICartItem,
  IProductEntity,
} from "../../../services/type.interface";
import AppContext from "../../../AppContext";
import Image from "../../common/Image";
import { numberCurrency } from "../../../helpers/common";
import InputComponent from "../../common/input/Input";

export interface IListItems {
  prodService: any;
  MSFTToken: string;
  cartItem: ICart;
  onTotalChange?: (value: number) => void;
}

const ListItems = ({ prodService, cartItem, MSFTToken }: IListItems) => {
  const GlobalStore: any = useContext(AppContext);
  const [parentItem, setParentItem] = useState<ICartItem>(null);
  const [accessories, setAccessories] = useState<ICartItem[]>(null);
  const [warranties, setWarranties] = useState<ICartItem[]>(null);
  if (!cartItem) {
    return <></>;
  }

  useEffect(() => {
    console.log("parentItem: ", parentItem);
    console.log("accessories: ", accessories);
    const _parent: ICartItem =
      cartItem.cartItems.filter(
        (item) =>
          item.lvt_Product.category_caption !== "Warranty" &&
          item.lvt_Product.category_caption !== "Accessories" &&
          item.lvt_Product.category_caption !== "OS"
      )[0] || null;
    const _acc: ICartItem[] =
      cartItem.cartItems.filter(
        (item) => item.lvt_Product.category_caption === "Accessories"
      ) || [];
    const _warranty: ICartItem[] =
      cartItem.cartItems.filter(
        (item) => item.lvt_Product.category_caption === "Warranty"
      ) || [];

    //console.log("my carts: ", cartItem);
    //console.log("parent: ", _parent);
    setParentItem(_parent);
    //console.log("acc: ", _acc);
    setAccessories(_acc);
    //console.log("Warranty: ", _warranty);
    setWarranties(_warranty);
  }, [cartItem]);

  const onChangeItem = (e, item: ICartItem) => {
    try {
      //console.log("onchangeItem", item);
      //console.log(item);
      const lvt_qty = e.target.value;
      if (lvt_qty === "") return;

      if (
        item.lvt_Product.category_caption !== "Warranty" &&
        item.lvt_Product.category_caption !== "Accessories" &&
        item.lvt_Product.category_caption !== "OS" &&
        warranties &&
        warranties.length > 0
      ) {
        const lvt_shoppingbasketitemid = warranties[0].lvt_shoppingbasketitemid;
        warranties[0].lvt_qty = lvt_qty;
        prodService
          .UpdateCartItem(lvt_shoppingbasketitemid, lvt_qty)
          .then((result) => {
            //console.log("item change success");
          });
      }

      const lvt_shoppingbasketitemid = item.lvt_shoppingbasketitemid;
      item.lvt_qty = lvt_qty;
      prodService
        .UpdateCartItem(lvt_shoppingbasketitemid, lvt_qty)
        .then((result) => {
          //console.log("item change success");
        });
    } catch (error) {
      console.log("what type of error?", error);
    }
  };

  const clickRemoveItem = (item) => {
    prodService.DeleteCartItem(item.lvt_shoppingbasketitemid).then((result) => {
      //console.log("item delete", item);
    });
  };

  const clickRemoveHeader = (item) => {
    prodService.DeleteCartHeader(item.lvt_cart_group_id).then((result) => {
      //console.log("header delete");
    });
  };

  return (
    <Fragment>
      {cartItem?.cartItems && cartItem?.cartItems?.length > 0 && (
        <Fragment>
          <div className="mobile-list-item" style={{ display: "none" }}>
            {parentItem &&
              parentItem?.lvt_Product?.lvt_ProductInformation?.lvt_name && (
                <div className="item">
                  <div className="item-1">
                    <h3>
                      {
                        parentItem?.lvt_Product?.lvt_ProductInformation
                          ?.lvt_name
                      }
                    </h3>
                    {parentItem?.lvt_Product?.cr107_description}
                  </div>
                  <div className="item-2">
                    {" "}
                    <InputComponent
                      id={parentItem?.lvt_shoppingbasketitemid}
                      onChange={(index, e) => onChangeItem(e, parentItem)}
                      isNumberOnly={true}
                      defaultValue={parentItem?.lvt_qty.toString()}
                    />
                  </div>
                  <div className="item-3">
                    {" "}
                    {parentItem?.lvt_gstvalue_base
                      ? numberCurrency(
                          parseFloat(parentItem.lvt_gstvalue_base) *
                            parentItem?.lvt_qty
                        )
                      : numberCurrency(
                          parentItem.lvt_priceincludinggst * parentItem?.lvt_qty
                        )}
                  </div>
                </div>
              )}

            {warranties &&
              warranties.map((item: ICartItem) =>
                item.lvt_Product.lvt_name.toLowerCase().includes("none") ||
                item.lvt_Product.lvt_name
                  .toLowerCase()
                  .includes("contact") ? null : (
                  <div className="item">
                    <div className="item-1">
                      <h3>
                        {item?.lvt_Product?.lvt_ProductInformation?.lvt_name}
                      </h3>
                    </div>
                    <div className="item-2">
                      {" "}
                      <InputComponent
                        id={item.lvt_shoppingbasketitemid}
                        onChange={(index, e) => onChangeItem(e, item)}
                        isNumberOnly={true}
                        defaultValue={item?.lvt_qty.toString()}
                      />
                    </div>
                    <div className="item-3">
                      {item.lvt_priceincludinggst_base
                        ? numberCurrency(
                            item.lvt_priceincludinggst_base * item?.lvt_qty
                          )
                        : numberCurrency(
                            item.lvt_priceincludinggst * item?.lvt_qty
                          )}
                    </div>
                  </div>
                )
              )}

            {accessories &&
              accessories.map((item: ICartItem) => (
                <div className="item">
                  <div className="item-1">
                    <h3>
                      {item?.lvt_Product?.lvt_ProductInformation?.lvt_name}
                    </h3>
                  </div>
                  <div className="item-2">
                    {" "}
                    <InputComponent
                      id={item.lvt_shoppingbasketitemid}
                      onChange={(index, e) => onChangeItem(e, item)}
                      isNumberOnly={true}
                      defaultValue={item?.lvt_qty.toString()}
                    />
                  </div>
                  <div className="item-3">
                    {item.lvt_priceincludinggst_base
                      ? numberCurrency(
                          item.lvt_priceincludinggst_base * item?.lvt_qty
                        )
                      : numberCurrency(
                          item.lvt_priceincludinggst * item?.lvt_qty
                        )}
                  </div>
                </div>
              ))}
          </div>

          <div
            className="AddedToCartItemParent"
            style={!parentItem ? { display: "none" } : null}
          >
            {parentItem && (
              <div className="AddedToCartItemParentCard">
                <div className="ItemDetails">
                  <div className="ImageContainer">
                    <div className="image">
                      <Image
                        productId={parentItem.lvt_Product.lvt_productid}
                        MSFTToken={MSFTToken}
                      />
                    </div>
                  </div>
                  <div className="DescriptionContainer">
                    <div className="description">
                      <div className="titledescription">
                        <div className="title">
                          <h3>{parentItem?.lvt_Product?.lvt_name}</h3>
                        </div>
                        <div className="short-desc">
                          {parentItem?.lvt_Product?.cr107_description}
                        </div>
                      </div>
                      <div className="bottom-options">
                        <button onClick={() => clickRemoveHeader(parentItem)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="QuantityPriceContainer">
                  <div className="quantity">
                    <InputComponent
                      id={parentItem.lvt_shoppingbasketitemid}
                      onChange={(index, e) => onChangeItem(e, parentItem)}
                      isNumberOnly={true}
                      defaultValue={parentItem?.lvt_qty.toString()}
                    />
                  </div>
                  <div className="price">
                    {parentItem.lvt_priceincludinggst_base
                      ? numberCurrency(
                          parentItem.lvt_priceincludinggst_base *
                            parentItem?.lvt_qty
                        )
                      : numberCurrency(
                          parentItem.lvt_priceincludinggst * parentItem?.lvt_qty
                        )}
                  </div>
                </div>
              </div>
            )}

            {warranties &&
              warranties.map((item: ICartItem) =>
                item.lvt_Product.lvt_name.toLowerCase().includes("none") ||
                item.lvt_Product.lvt_name
                  .toLowerCase()
                  .includes("contact") ? null : (
                  <div className="AddedToCartItemParentSubCard">
                    <div className="ItemDetails">
                      <div className="ImageContainer">
                        <div className="image">
                          <Image
                            productId={item?.lvt_Product?.lvt_productid}
                            MSFTToken={MSFTToken}
                          />
                        </div>
                      </div>
                      <div className="DescriptionContainer">
                        <div className="description">
                          <div className="titledescription">
                            <div className="title">
                              <h4>{item?.lvt_Product?.lvt_name}</h4>
                            </div>
                            <div className="short-desc">
                              {item?.lvt_Product?.cr107_description}
                            </div>
                          </div>

                          <div className="bottom-options">
                            <button onClick={() => clickRemoveItem(item)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="QuantityPriceContainer">
                      <div className="quantity">
                        <span
                          style={{
                            backgroundColor: "#f5f5f5",
                            border: "none",
                            width: "50px",
                            height: "20px",
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: "300",
                          }}
                        >
                          {item?.lvt_qty.toString()}
                        </span>
                      </div>
                      <div className="price">
                        {item.lvt_priceincludinggst_base
                          ? numberCurrency(
                              item.lvt_priceincludinggst_base * item?.lvt_qty
                            )
                          : numberCurrency(
                              item.lvt_priceincludinggst * item?.lvt_qty
                            )}
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>

          {accessories &&
            accessories.map((item: ICartItem) => (
              <div className="AddedToCartItemParentAddons">
                <div className="AddedToCartItemParentSubCard">
                  <div className="ItemDetails">
                    <div className="ImageContainer">
                      <div className="image">
                        <Image
                          productId={item?.lvt_Product?.lvt_productid}
                          MSFTToken={MSFTToken}
                        />
                      </div>
                    </div>
                    <div className="DescriptionContainer">
                      <div className="description">
                        <div className="titledescription">
                          <div className="title">
                            <h4>{item?.lvt_Product?.lvt_name}</h4>
                          </div>
                          <div className="short-desc">
                            <p>{item?.lvt_Product?.cr107_description}</p>
                          </div>
                        </div>

                        <div className="bottom-options">
                          <button onClick={() => clickRemoveItem(item)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="QuantityPriceContainer">
                    <div className="quantity">
                      <InputComponent
                        id={item?.lvt_shoppingbasketitemid}
                        onChange={(index, e) => onChangeItem(e, item)}
                        isNumberOnly={true}
                        defaultValue={item?.lvt_qty.toString()}
                      />
                    </div>
                    <div className="price">
                      {item.lvt_priceincludinggst_base
                        ? numberCurrency(
                            item.lvt_priceincludinggst_base * item?.lvt_qty
                          )
                        : numberCurrency(
                            item.lvt_priceincludinggst * item?.lvt_qty
                          )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ListItems;
