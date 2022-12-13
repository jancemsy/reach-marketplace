import React, { Fragment, useEffect, useContext, useState } from "react";
import AppContext from "../../../AppContext";
import {
  IProductEntity,
  ISpecificationList,
} from "../../../services/type.interface";
import { numberCurrency } from "../../../helpers/common";
import RadioBtn from "../../components/RadioBtn";
import styled from "styled-components";

export interface ISpecificationEntity {
  errorText: string;
  mySpecificationList: ISpecificationList[];
  currentSpecification: ISpecificationList;
  onCurSelectSpecification: (Specification: ISpecificationList) => void;
}

const specification = ({
  errorText,
  mySpecificationList,
  currentSpecification,
  onCurSelectSpecification,
}: ISpecificationEntity) => {
  const [currentSelectedSpecification, setCurrentSelectedSpecification] =
    useState<ISpecificationList>();
  const [curColor, setColor] = useState<string>("");
  const [curSpecifications, setCurSpecifications] =
    useState<ISpecificationList[]>();
  const [colourList, setColourList] = useState<string[]>();

  const organizeColour = () => {
    let newColors = [];
    //console.log(mySpecificationList);
    mySpecificationList.forEach((specs) => {
      const mycolor = newColors.find((col) => {
        return col === specs.product.lvt_colour;
      });

      if (!mycolor) {
        newColors.push(specs.product.lvt_colour);
      }
    });
    //console.log(newColors);
    setColourList(newColors);
  };

  const onClickChangeCurrConfig = (priceItemListId) => {
    const newConfig = mySpecificationList.find((con) => {
      return con.lvt_pricelistitemid === priceItemListId;
    });
    setCurrentSelectedSpecification(newConfig);
    onCurSelectSpecification(newConfig);
  };

  const onChecked = (id: string, value: string, isChecked: boolean) => {
    setColor(value);
  };

  useEffect(() => {
    if (mySpecificationList) {
      const newSpecifications = mySpecificationList.filter((spec) => {
        return spec.product.lvt_colour === curColor;
      });
      setCurSpecifications(newSpecifications);
    }
  }, [curColor]);

  useEffect(() => {
    organizeColour();
  }, [mySpecificationList]);

  useEffect(() => {
    if (currentSpecification?.product) {
      setColor(currentSpecification.product.lvt_colour);
    }
    setCurrentSelectedSpecification(currentSpecification);
  }, [currentSpecification]);

  return (
    <Fragment>
      <div className="item-config-list">
        <div className="item-config-list-container">
          <h2 className="title">Colour</h2>
          <div className="row">
            <div className="column-12">
              <div className="colour-container">
                {colourList &&
                  colourList.map(
                    (color) =>
                      color && (
                        <RadioBtn
                          onChecked={onChecked}
                          value={color}
                          isChecked={curColor === color}
                          text={color}
                          id={"color"}
                        />
                      )
                  )}
              </div>
            </div>
          </div>
          <h2 className="title">
            Configuration
            {errorText && <span className="error">{errorText}</span>}
          </h2>
          <div className="item-config-list-contents">
            <div className="row">
              {curSpecifications && curSpecifications.length > 0 ? (
                curSpecifications.map((prod) => (
                  <div className="column-4">
                    <button
                      onClick={() =>
                        onClickChangeCurrConfig(prod?.lvt_pricelistitemid)
                      }
                      className={
                        "item-config" +
                        (currentSelectedSpecification?.lvt_pricelistitemid ===
                        prod?.lvt_pricelistitemid
                          ? " selected"
                          : "")
                      }
                    >
                      {currentSelectedSpecification?.lvt_pricelistitemid ===
                        prod?.lvt_pricelistitemid && (
                        <span className="selection">
                          <Checkmark className="checkmark"></Checkmark>
                        </span>
                      )}

                      <div className="item-config-container">
                        <div className="item-config-short-desc">
                          <p>Colour: {prod?.product?.lvt_colour}</p>
                          <p>
                            Processor:{" "}
                            {prod?.product?.lvt_processor?.toLowerCase()}
                          </p>
                          <p>Ram: {prod?.product?.lvt_ram}</p>
                          <p>Storage: {prod?.product?.lvt_hdd}</p>
                          <p>Operating System: {prod?.product?.lvt_os}</p>
                        </div>
                        <div className="item-config-price">
                          {numberCurrency(prod?.lvt_unitpriceexgst)} ex. GST
                        </div>
                      </div>
                    </button>
                  </div>
                ))
              ) : (
                <div className="column-12">
                  {!curColor ? (
                    <h3>Please select a color.</h3>
                  ) : (
                    <h3>No Specification with this colour.</h3>
                  )}
                </div>
              )}
            </div>
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

export default specification;
