import axios from "axios";

export const D365BaseUrl = () =>{
  const D365BaseUrl = localStorage.getItem("D365BaseUrl");
  return D365BaseUrl;
}

export const reachRequest = (apiEndpoint, apiKey) => axios.create({

  // Timeout 30p
  baseURL: apiEndpoint,
  timeout: 30 * 60 * 1000,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
    'Access-Control-Max-Age' : 600 //disable pre-flight browser inspection  to speed up api call
  },
});


export const msftDataversePagination = (apiKey, limit) => axios.create({
  // Timeout 30p
  baseURL: D365BaseUrl(),
  timeout: 30 * 60 * 1000,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
    Prefer: `odata.maxpagesize=${limit}, odata.include-annotations=\"OData.Community.Display.v1.FormattedValue\"`,
    'Access-Control-Max-Age' : 600 //disable pre-flight browser inspection  to speed up api call
  },
});

export const msftDataverse = (apiKey) => axios.create({
  // Timeout 30p
  baseURL: D365BaseUrl(),
  timeout: 30 * 60 * 1000,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
    Prefer:  "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"",
    'Access-Control-Max-Age' : 600 //disable pre-flight browser inspection  to speed up api call
  },
});



export const azureTokenRequest = (apiEndpoint, apiKey) => axios.create({
  // Timeout 30p

//api/v1
  baseURL: `${apiEndpoint}/subscriptions/current/plugins`,
  timeout: 30 * 60 * 1000,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
    'Access-Control-Max-Age' : 600 //disable pre-flight browser inspection  to speed up api call
  },
});