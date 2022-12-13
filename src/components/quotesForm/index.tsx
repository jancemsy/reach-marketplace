import React, {
  useEffect,
  useState,
  useContext,
  Fragment,
  useRef,
} from "react";
import AppContext from "../../AppContext";
import QuotesForm from "./QuotesForm";

export interface IQuotesForm {
  cartId?: string;
}

const QuotesFormIndex = () => {
  const GlobalStore: any = useContext(AppContext);
  const { setStep, cartInfo } = GlobalStore;

  useEffect(() => {
    setStep(4);
    //console.log("QuotesFormIndex cartInfo: ", cartInfo);
  }, [cartInfo]);

  /*if (!cartInfo.cartId) {
    return null;
  }*/

  return <QuotesForm cartId={cartInfo.cartId} />;
};

export default QuotesFormIndex;
