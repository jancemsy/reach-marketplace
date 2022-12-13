import axios from "axios";
import { ReachEndpoint } from "./endpoints";
import { NewsFilterEntity } from "./type.interface";
import { D365BaseUrl, msftDataverse, reachRequest, azureTokenRequest, msftDataversePagination } from "../helpers/request";
import { NewsFilter } from "./mutation/useRequestFilters";

export const useFetchMSToken = async(apiEndpoint,token, pluginId) => {
  return await azureTokenRequest(apiEndpoint, token)
        .get(`/${pluginId}/store/MSToken/value`)
        .then((res) =>
          {
            return res.data;
          }
        ).catch((err) => {return null});
}



export const getTotalProductCount = async (token,accountId) => {
  return await msftDataverse(token)
      .get("/api/data/v9.2/lvt_pricelistitems?$apply=groupby((statuscode),aggregate($count%20as%20COUNT))&$filter=_lvt_owningaccount_value%20eq%20"+accountId+"")
      .then((res) =>
        {
          return res.data;
        }
      ).catch((err) => {return null});
}

export const useFetchCategoryOptions = async (token) => {
    return await msftDataverse(token)
        .get(ReachEndpoint.Azure.options + "(Name='lvt_productcategory')")
        .then((res) =>
          {
            return res.data;
          }
        ).catch((err) => {return null});
}

export const useFetchAudienceOptions = async (token) => {
    return await msftDataverse(token)
        .get(ReachEndpoint.Azure.options + "(Name='lvt_audienceoptions')")
        .then((res) =>
          {
            return res.data;
          }
        ).catch((err) => {return null});
}

export const useFetchAudience = async (token, query = "") => {
    return await msftDataverse(token)
        .get(ReachEndpoint.Azure.audience + (query ? ("?" + query) : ""))
        .then((res) =>
          {
            return res.data;
          }
        ).catch((err) => {return null});
}


export const useFetchAccount = async (token, query = "") => {
    return await msftDataverse(token)
        .get(ReachEndpoint.Azure.account + (query ? ("?" + query) : ""))
        .then((res) =>
          {
            return res.data;
          }
        ).catch((err) => {return null});
}

export const useBasicFetchPaginated = async (token, path , limit, query = "") => {
  return await msftDataversePagination(token, limit)
      .get( path  + (query ? ("?" + query) : ""))
      .then((res) =>
        {
          return res.data;
        }
      ).catch((err) => {return null});
}

export const  useBasicPost = async (token, path , params) => {
  const url =  D365BaseUrl() + `${path}`;
  const _contig :any = {
    headers: {
       //'content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Prefer': `return=representation`,
        'cache': 'no-cache',
        'mode': 'no-cors',
        }
    }

  return axios.post(url, params,  _contig);
}

export const  useBasicPatch = async (token, path , params) => {
  const url =  D365BaseUrl() + `${path}`;
  const _contig :any = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Prefer': `return=representation`,
        'cache': 'no-cache',
        'mode': 'no-cors',
        'If-Match': '*'
        }
    }

  return axios.patch(url, params,  _contig);
}

export const  useBasicGet = async (token, path ) => {
  const url = D365BaseUrl() + `${path}`;
  const _contig :any = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Prefer': `return=representation`,
        'Access-Control-Max-Age' : 600 //disable pre-flight browser inspection  to speed up api call
        }
    }

  return axios.get(url,   _contig);
}
export const useBasicFetch = async (token, path , query = "") => {
  return await msftDataverse(token)
      .get( path  + (query ? ("?" + query) : ""))
      .then((res) =>
        {
          return res.data;
        }
      ).catch((err) => {return null});
}



export const useFetchProducts = async (token, query = "") => {
    return await msftDataverse(token)
        .get(ReachEndpoint.Azure.product + (query ? ("?" + query) : ""))
        .then((res) =>
          {
            return res.data;
          }
        ).catch((err) => {return null});
}

export const fetchContact = async (token: string, query: string) => {
  return await msftDataverse(token)
        .get(ReachEndpoint.Azure.contact + (query ? ("?" + query) : ""))
        .then((res) =>
          {
            return res.data;
          }
        ).catch((err) => {return null});
}

export const fetchTerms = async (token: string, query: string) => {
  return await msftDataverse(token)
        .get(ReachEndpoint.Azure.terms + (query ? ("?" + query) : ""))
        .then((res) =>
          {
            return res.data;
          }
        ).catch((err) => {return null});
}

export const fetchPriceList = async (token: string, query: string) => {
  return await msftDataverse(token)
        .get(ReachEndpoint.Azure.priceList + (query ? ("?" + query) : ""))
        .then((res) =>
          {
            return res.data;
          }
        ).catch((err) => {return null});
}

export const fetchProductCategory = async (token: string, query: string) => {
  return await msftDataverse(token)
        .get(ReachEndpoint.Azure.productCategory + (query ? ("?" + query) : ""))
        .then((res) =>
          {
            return res.data;
          }
        ).catch((err) => {return null});
}

export const useGetNews = async (apiEndpoint: string, token: string, filter?: NewsFilterEntity) => {
  if(token){
    const myfilter = NewsFilter(filter);
    return await reachRequest(apiEndpoint, token)
        .get(ReachEndpoint.News.listNews + myfilter)
        .then((res) =>
          {
              return res.data;
          }
        ).catch((err) => {return null});
  }
}

export const useGetNewsVidThumbnail = async (apiEndpoint: string, token: string, itemId: string) => {
  return await reachRequest(apiEndpoint, token)
          .get(ReachEndpoint.News.listNews+"/"+itemId+ReachEndpoint.News.VidThumbnail, { responseType: 'blob' })
          .then((res) =>
            {
              const file = new File([res.data], "Video Thumbnail");
              return URL.createObjectURL(file);
            }
          ).catch((err) => {return null});
}
