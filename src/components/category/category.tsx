import React, { useEffect, useState, Fragment, useContext } from "react";
import {
  useFetchCategoryOptions,
  useFetchProducts,
  useGetNews,
  useGetNewsVidThumbnail,
  useFetchAccount,
  fetchContact,
  fetchPriceList,
  useFetchAudience,
  useFetchAudienceOptions,
} from "../../services/useQueries";
import { usePluginSettings, useReachApiEndPoints } from "@reach/core";
import {
  ICategoryEntity,
  NewsFilterEntity,
  NewEntity,
  ICategoryImage,
  IPriceItemsListEntity,
  IAudienceItemsList,
} from "../../services/type.interface";
import AppContext from "../../AppContext";
import Loading from "../common/Loading";
import Footer from "../common/footer/footer";
import styled from "styled-components";
import Image from "../common/Image";

const category = () => {
  const [AudienceList, setAudienceList] = useState<IAudienceItemsList[]>();
  const [Audiences, setAudiences] = useState<ICategoryEntity[]>();
  const [PriceItemsList, setPriceItemsList] =
    useState<IPriceItemsListEntity[]>();
  const [CallToArms, setCallToArms] = useState<NewEntity>();
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState<string>("");
  const [carImgs, setCatImgs] = useState<ICategoryImage[]>();
  const [imgUrl, setImgUrl] = useState("");
  const [isNewsLoading, setIsNewsLoading] = useState<boolean>(true);
  const { callToActionChannel, accountManagerChannel } = usePluginSettings<{
    callToActionChannel: string;
    accountManagerChannel: string;
  }>();

  const GlobalStore: any = useContext(AppContext);
  const {
    AccImg,
    Navigate,
    MSFTToken,
    ReachToken,
    User,
    setStep,
    accountId,
    welcomeMessage,
    entityName,
  } = GlobalStore;
  const { apiEndpoint } = useReachApiEndPoints();

  const getVidThumbnail = async (news) => {
    const bannerImg =
      news?.bannerInfo && news?.bannerInfo?.imageId
        ? apiEndpoint +
          `/news/${news.id}/images/${news?.bannerInfo?.imageId}/450/?X-Condense-Client=web&X-Condense-Client-BuildId=87364&X-Condense-Client-Version=41.0.168&X-Condense-Preferred-Language=en&X-Condense-Preferred-TimeZone=Asia%2FTaipei&access_token=${news.fileAccessToken}&subscriptionId=${User.subscriptionId}`
        : "";
    if (news?.bannerInfo && news?.bannerInfo?.type === "video") {
      await useGetNewsVidThumbnail(apiEndpoint, ReachToken, news.id)
        .then((res: any) => {
          setImgUrl(res);
        })
        .catch((er) => {
          setImgUrl(bannerImg);
        });
    } else {
      setImgUrl(bannerImg);
    }
  };

  const getNews = async () => {
    const filter: NewsFilterEntity = {
      PageSize: 1,
      Channels: callToActionChannel,
      BeforeDate: null,
      Keywords: null,
      SubscribedOnly: true,
    };
    try {
      await useGetNews(apiEndpoint, ReachToken, filter)
        .then((res: any) => {
          const mytitle =
            User.preferredLanguage && User.preferredLanguage === "en"
              ? res.items[0]?.contents?.en !== undefined
                ? res.items[0]?.contents?.en.title
                : res.items[0]?.contents?.de.title
              : res.items[0]?.contents?.de !== undefined
              ? res.items[0]?.contents?.de.title
              : res.items[0]?.contents?.en.title;
          const myintro =
            User.preferredLanguage && User.preferredLanguage === "en"
              ? res.items[0]?.contents?.en !== undefined
                ? res.items[0]?.contents?.en.intro
                : res.items[0]?.contents?.de.intro
              : res.items[0]?.contents?.de !== undefined
              ? res.items[0]?.contents?.de.intro
              : res.items[0]?.contents?.en.intro;
          setTitle(mytitle);
          setIntro(myintro);
          setCallToArms(res.items[0]);
          getVidThumbnail(res.items[0]);
          setIsNewsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsNewsLoading(false);
        });
    } catch (err) {
      console.log(err);
      setIsNewsLoading(false);
    }
  };

  const organizeAudienceList = async () => {
    const priceListsquery =
      "$select=*&$expand=lvt_ProductAudience($select=lvt_name)&$filter=_lvt_owningaccount_value eq '" +
      accountId +
      "' and lvt_audience ne null";
    const pricelists: IPriceItemsListEntity[] | null = await getPriceItemsList(
      priceListsquery
    );

    //console.log("pricelists: ", pricelists);
    const audience = await getAudiencelist();
    let newAudienceList: IAudienceItemsList[] = [];
    let newPriceList: IPriceItemsListEntity[] = [];
    if (audience?.length > 0) {
      let newAudience: ICategoryEntity[] = [];
      for (let i = 0; i < audience.length; i++) {
        const item = pricelists?.find((item) => {
          return item?.lvt_audience?.split(audience[i].Value).length > 1;
        });
        if (item) {
          newAudience.push(audience[i]);
          newPriceList.push(item);
        }
      }

      for (let i = 0; i < newPriceList.length; i++) {
        const query =
          "$select=lvt_name&$expand=lvt_Product($select=lvt_productimage,lvt_name,lvt_productid)&$filter=_lvt_product_value eq " +
          "'" +
          newPriceList[i]._lvt_product_value +
          "'";
        const product = await getPriceItemsList(query);
        if (product?.length > 0) {
          newAudienceList.push({
            name: newAudience[i].Label.UserLocalizedLabel.Label,
            description: newAudience[i].Label.UserLocalizedLabel.Label,
            img: product[0].lvt_Product.lvt_productimage,
            audienceId: newAudience[i].Value,
          });
        }
      }
      setAudienceList(newAudienceList);
    }
  };

  const getAudiencelist = async () => {
    //console.log("getAudienceist()");
    try {
      return await useFetchAudienceOptions(MSFTToken)
        .then((res: any) => {
          if (res?.Options && res?.Options.length > 0) {
            setAudiences(res.Options);
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

  const getPriceItemsList = async (query) => {
    //console.log("getPriceItemsList()");

    try {
      return await fetchPriceList(MSFTToken, query)
        .then((res: any) => {
          if (res?.value && res?.value.length > 0) {
            setPriceItemsList(res.value);
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

  const limitText = (text, limit = 150) => {
    text = `${text}`; //just to be on safe side
    if (text && text.length > limit) {
      return text.substring(0, limit) + "...";
    }
    return text;
  };

  useEffect(() => {
    if (ReachToken) {
      getNews();
    }
    setStep(1);
  }, [ReachToken]);

  useEffect(() => {
    if (MSFTToken && accountId) {
      organizeAudienceList();
    }
  }, [MSFTToken, accountId]);

  return (
    <div>
      <section className="msft-header">
        <div className="row">
          <div className="column-6">
            <div className="welcome-description">
              <div className="circle-left">
                <div className="welcome-img-container">
                  {AccImg ? (
                    <Image
                      productId={accountId}
                      MSFTToken={MSFTToken}
                      type="Account"
                    />
                  ) : (
                    <div className="circle" />
                  )}
                </div>
              </div>
              {welcomeMessage && (
                <div className="description">
                  <h1>Welcome to {entityName} Store</h1>
                  <div
                    className="welcome-description-content"
                    dangerouslySetInnerHTML={{ __html: welcomeMessage }}
                  ></div>
                </div>
              )}
            </div>
          </div>
          <div className="column-6">
            <div className="call-to-action">
              {isNewsLoading ? (
                <LoadingContainer>
                  <Loading loading={isNewsLoading} />
                </LoadingContainer>
              ) : (
                <Fragment>
                  <div className="img-container">
                    <div className="news-banner">
                      <img src={imgUrl} alt={title} />
                    </div>
                  </div>
                  <div className="cta-description">
                    <h1>{title}</h1>
                    <div className="cta-description-content">
                      <p>{limitText(intro)}</p>
                    </div>
                    <a
                      href={CallToArms && CallToArms.permalink}
                      target="_blank"
                      aria-label={`Learn more about ${title}`}
                    >
                      Learn More {">"}
                    </a>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="ecom-description">
        <h2 className="title">Lets Get Started</h2>
        <p className="description">
          On this portal you will find a range of business commercial grade
          specific products at discounted prices. These products have been
          specifically chosen in partnership with your organisation as they are
          the most suitable products for your use. These products are non-retail
          products, meaning you won’t find them in retail stores. What sets them
          apart as a business grade device is their operating system, security
          as well as business grade warranty options.
        </p>
      </section>
      <section className="body">
        <div className="store-category">
          <h3 className="title">Select category</h3>
          <div className="row">
            {AudienceList &&
              AudienceList.map((aud) => (
                <div className="column-3">
                  <a
                    className="MobNavMenuItem"
                    onClick={() => Navigate("/products?aud=" + aud?.audienceId)}
                  >
                    <div className="category">
                      <div className="category-img"></div>
                      <div className="category-title">{aud?.name}</div>
                    </div>
                  </a>
                </div>
              ))}
          </div>
        </div>
        <div className="category-footer">
          <Footer />
        </div>
      </section>
    </div>
  );
};

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default category;
