import React, { useContext, useState, useEffect } from "react";
import "./footer.css";
import { usePluginSettings, useReachApiEndPoints } from "@reach/core";
import AppContext from "../../../AppContext";
import { NewEntity, NewsFilterEntity } from "../../../services/type.interface";
import {
  useGetNews,
  useGetNewsVidThumbnail,
} from "../../../services/useQueries";
import Loading from "../Loading";
import styled from "styled-components";

const Footer = () => {
  const GlobalStore: any = useContext(AppContext);
  const { ReachToken, User } = GlobalStore;
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState<string>("");
  const [AccountManager, setAccountManager] = useState<NewEntity>();
  const [imgUrl, setImgUrl] = useState("");
  const [isNewsLoading, setIsNewsLoading] = useState<boolean>(true);
  const { accountManagerChannel } = usePluginSettings<{
    accountManagerChannel: string;
  }>();
  const { apiEndpoint } = useReachApiEndPoints();

  useEffect(() => {
    getNews();
  }, []);

  const getNews = async () => {
    const filter: NewsFilterEntity = {
      PageSize: 1,
      Channels: accountManagerChannel,
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
          setAccountManager(res.items[0]);
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

  if (isNewsLoading) {
    return (
      <LoadingContainer>
        <Loading loading={isNewsLoading} />
      </LoadingContainer>
    );
  } else {
    return (
      <div className="msft-item-manager-post">
        <div className="post-description-content">
          <div className="post-description">
            <h3>{title}</h3>
            <p className="desc">{intro}</p>
            <div className="links">
              <a
                href={AccountManager && AccountManager.permalink}
                target="_blank"
                aria-label={`Learn more about ${title}`}
              >
                Learn More {">"}
              </a>
            </div>
          </div>
        </div>

        <div className="post-img-container">
          <img src={imgUrl} alt={title} />
        </div>
      </div>
    );
  }
};

export default Footer;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
