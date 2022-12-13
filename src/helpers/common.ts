import { D365BaseUrl } from "./request";

export const numberCurrency = (number) =>{
    let decimals = 2;
    let decpoint = '.'; // Or Number(0.1).toLocaleString().substring(1, 2)
    let thousand = ','; // Or Number(10000).toLocaleString().substring(2, 3)

    let n = Math.abs(number).toFixed(decimals)?.split('.');
    n[0] = n[0]?.split('').reverse().map((c, i, a) =>
      i > 0 && i < a.length && i % 3 == 0 ? c + thousand : c
    ).reverse().join('');
    let final = (Math.sign(number) < 0 ? '-' : '') + n.join(decpoint);

    return `$${final}`;
}

export const getURLParam = (variable) =>
{
        var query = window.location.search.substring(1);
        var vars = query?.split("&");
        for (var i=0;i<vars.length;i++) {
                    var pair = vars[i]?.split("=");

                    if(pair[0] == variable){
                        return pair[1];
                  }
         }

         return null;
}

export const GetThumbnail = async (prodId, MSFTToken, setter) =>{
    const url = D365BaseUrl() + "/api/data/v9.1/lvt_products(" +
    prodId + ")/lvt_productimage/$value?size=full";
    const imageid = `_lvt_productImage_${prodId}`;
    _GetThumb (url, MSFTToken, setter,imageid);
}

export const GetThumbnailProdInfoGallery = async (prodId, MSFTToken, setter) =>{
    const url = D365BaseUrl() +  "/api/data/v9.1/lvt_productcategories(" +
                prodId + ")/lvt_productviewgallery/$value?size=full";
    const imageid = `_lvt_productviewgallery_${prodId}`;
    _GetThumb (url, MSFTToken, setter,imageid);
}

export const GetThumbnailProdInfoFamily = async (prodId, MSFTToken, setter) =>{
    const url = D365BaseUrl() +  "/api/data/v9.1/lvt_productcategories(" +
                prodId + ")/lvt_productfamilyimage/$value?size=full";
    const imageid = `_lvt_productfamilyimage_${prodId}`;
    _GetThumb (url, MSFTToken, setter,imageid);
}

export const GetThumbnailAccount = async (prodId, MSFTToken, setter) =>{
    const url = D365BaseUrl() + "/api/data/v9.1/accounts(" +
                prodId + ")/lvt_storelogo/$value?size=full";
    const imageid = `lvt_storelogoid${prodId}`;
    _GetThumb (url, MSFTToken, setter,imageid);
}

export const GetImageCache = async () =>{
   return localStorage.getItem('_images');
}

export const _GetThumb = async (url, MSFTToken, setter,imageid , ms = 10000) => {
    let _images = localStorage.getItem('_images') ? JSON.parse(localStorage.getItem('_images'))  :  {};

    const imageData = _images[imageid];

    if(imageData){
        //console.log("loaded cache thumbnail " + imageid);
        setter(imageData);
    }else{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/octet-stream");
        myHeaders.append("Authorization", "Bearer " + MSFTToken);


     new Promise( (resolve) => {
        let controller = new AbortController();
        var requestOptions :any = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow' ,
            signal: controller.signal
        };

        let _timeout = setTimeout(() => {
            resolve(null)
            setter(null);
            controller.abort();
            //console.error("Timeouted image " + imageid + " - more than "+ms+"ms to load");
        }, ms);

        fetch(url, requestOptions)
        .then(response => response.blob())
        .then(imageBlob => {
            clearTimeout(_timeout);
            const imageObjectURL = URL.createObjectURL(imageBlob);
            let _images = localStorage.getItem('_images') ? JSON.parse(localStorage.getItem('_images'))  :  {}; //get latest

            _images[imageid] = imageObjectURL;
            localStorage.setItem('_images', JSON.stringify(_images));
            setter(imageObjectURL);
            resolve(true);
        } ).catch(r =>{ })
    });



    }
}
