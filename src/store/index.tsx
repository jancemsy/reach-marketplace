import { useState } from "react";
import { ICartInfo, ICart, ITermsCondition } from "../services/type.interface";

//put this outside so that it will never be affected by react state/refresh

const GlobalStore = () => {
  const [cartInfo, setCartInfo] = useState<ICartInfo>({
    cartId: "",
    code: "",
    total: 0,
    subtotal: 0,
    tax: 0,
    count: 0,
    comment: "",
  });
  const [prodService, setProductService] = useState<any>(null);
  const [quoteService, setQuoteService] = useState<any>(null);
  const [itemsPerPage, setItemPerPage] = useState(100); //fetch 100 so dont display any paginated items for now.
  const [_Navigate, setNavigation] = useState(null);
  const [ReachToken, setReachToken] = useState(null);
  const [Audience, setAudience] = useState(
    localStorage.getItem("Audience") || ""
  );
  const [MSFTToken, setMSFTToken] = useState(null);
  const [ProductType, setProductType] = useState<number>(1);
  const [User, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [PluginRoute, setPluginRoute] = useState<string | null>(null);
  const [OrgName, setOrgName] = useState<any>(null);
  const [UserAvatar, setUserAvatar] = useState<any>("");
  const [mode, setMode] = useState<string>("Preview");
  const [step, setStep] = useState<number>(1);
  const [deviceNav, setDeviceNav] = useState<number>();
  const [accountId, setAccountId] = useState<string>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");
  const [entityName, setEntityName] = useState<string>("");
  const [Categories, setCategories] = useState<any[]>(null);
  const [myCarts, setMyCarts] = useState<ICart[]>(null);
  const [QuoteCount, setQuoteCount] = useState<number>(0);
  const [myQuotes, setMyQuotes] = useState<number>(0);
  const [AccImg, setAccImg] = useState<string>("");
  const [PhoneNumber, setPhoneNumber] = useState<string>("");
  const [ContactId, setContactId] = useState<string>("");
  const [Address1Composite, setAddress1Composite] = useState<string>("");
  const [Address2Composite, setAddress2Composite] = useState<string>("");
  const [Address1Country, setAddress1Country] = useState<string>("");
  const [Address1Line1, setAddress1Line1] = useState<string>("");
  const [Address1City, setAddress1City] = useState<string>("");
  const [Address1Stateorprovince, setAddress1Stateorprovince] =
    useState<string>("");
  const [Address1Postalcode, setAddress1Postalcode] = useState<string>("");
  const [LvtAuthorisedbuyer, setLvtAuthorisedbuyer] = useState<string>("");
  const [AccoutNumber, setAccoutNumber] = useState<string>("");
  const [IsDownloadReady, setIsDownloadReady] = useState<boolean>(false);
  const [Terms, setTerms] = useState<ITermsCondition[]>();

  const [D365BaseUrl, setD365BaseUrl] = useState<string>("");

  const productIDNONE = "39f56737-7035-ed11-9db1-002248933c9b";
  const productIDCONTACT = "869f9dbf-7848-ed11-bba2-002248933c9b";

  const Navigate = (link, replace = true) => {
    let currentRoute = `${PluginRoute}${link}`;
    _Navigate.push(currentRoute); //replace(currentRoute);
  };

  return {
    IsDownloadReady,
    setIsDownloadReady,
    D365BaseUrl,
    setD365BaseUrl,
    Terms,
    setTerms,
    AccoutNumber,
    setAccoutNumber,
    productIDNONE,
    productIDCONTACT,
    LvtAuthorisedbuyer,
    setLvtAuthorisedbuyer,
    Address1Postalcode,
    setAddress1Postalcode,
    Address1Stateorprovince,
    setAddress1Stateorprovince,
    Address1City,
    setAddress1City,
    Address1Line1,
    setAddress1Line1,
    Address1Country,
    setAddress1Country,
    Address2Composite,
    setAddress2Composite,
    Address1Composite,
    setAddress1Composite,
    cartInfo,
    setCartInfo,
    ContactId,
    setContactId,
    PhoneNumber,
    setPhoneNumber,
    myQuotes,
    setMyQuotes,
    QuoteCount,
    setQuoteCount,
    quoteService,
    setQuoteService,
    myCarts,
    setMyCarts,
    prodService,
    setProductService,
    AccImg,
    setAccImg,
    Audience,
    setAudience,
    Categories,
    setCategories,
    ProductType,
    setProductType,
    itemsPerPage,
    setItemPerPage,
    setAccountId,
    setWelcomeMessage,
    setEntityName,
    accountId,
    welcomeMessage,
    entityName,
    Navigate,
    setNavigation,
    mode,
    setMode,
    UserAvatar,
    setUserAvatar,
    setOrgName,
    OrgName,
    setPluginRoute,
    PluginRoute,
    setIsAdmin,
    isAdmin,
    setReachToken,
    setMSFTToken,
    setUser,
    User,
    ReachToken,
    MSFTToken,
    step,
    setStep,
    deviceNav,
    setDeviceNav,
  };
};

export default GlobalStore;
