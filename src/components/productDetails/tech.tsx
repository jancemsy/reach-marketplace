import React, { useEffect, useState, useContext, Fragment } from "react";
import { useFetchProducts } from "../../services/useQueries";
import { IProductEntity } from "../../services/type.interface";
import AppContext from "../../AppContext";
import { BrowserRouter as Router, NavLink } from "react-router-dom";

/*


@odata.etag: "W/\"14644646\""
createdon: "2022-08-17T06:51:38Z"
importsequencenumber: null
lvt_accessoriessupport: "Integrated Surface Slim Pen* storage for charging\t\t\t\t\nCompatible with Surface Dial* off-screen interaction\t\t\t\t\n"
lvt_batterylife: "Intel® Core™ i5: Up to 19 hours of typical device usage5\t\t\t\t\t\nIntel® Core™ i7: Up to 18 hours of typical device usage6\t\t\t\t\t\n"
lvt_camerasvideoandaudio: "Windows Hello face authentication camera (front-facing)\t\t\t\t\t\n1080p resolution front facing camera.\t\t\t\t\t\nDual far-field Studio Mics\t\t\t\t\t\nQuad OmnisonicTM speakers with Dolby Atmos®8\t\t\t\t\t\n"
lvt_connections: "2 x USB 4.0 with Thunderbolt™ 4 technologies support\t\t\t\t\t\n3.5mm headphone jack\t\t\t\t\t\n1 x Surface Connect port\t\t\t\t\t\n"

lvt_dimensions: "12.72” x 8.98” x 0.746” (323.28 mm x 228.32 mm x 18.94 mm)\t\t\t\t\t\n"


lvt_display: "Screen: 14.4” PixelSense™ Flow Display3\t\t\t\nRefresh rate: up to 120Hz\t\t\t\nResolution: 2400 x 1600 (201 PPI)\t\t\t\nAspect ratio: 3:2\t\t\t\nContrast ratio: 1500:1\t\t\t\nTouch: 10-point multi-touch\t\t\t\nDolby Vision® support4\t\t\t\n"


lvt_exterior: "Casing: Magnesium and Aluminum\t\t\nColor: Platinum\t\t\n"
lvt_graphics: "Intel® Core™ i5 models: Intel® Iris® Xe Graphics\t\t\t\t\t\t\n\t\t\t\t\t\t\nIntel® Core™ i7 models:\t\t\t\t\t\t\n\t\t\t\t\t\t\nNVIDIA® GeForce RTX™ 3050 Ti laptop GPU with 4GB GDDR6 GPU memory\t\t\t\t\t\t\n\t\t\t\t\t\t\nNVIDIA® RTX™ A2000 laptop GPU with 4GB GDDR6 GPU memory\t\t\t\t\t\t\n"

lvt_hinge: "Dynamic Woven Hinge made of woven fabric with embedded cables that can bend 180 degrees\t\t\t\t\t\t\t\t\n"

lvt_memory: "16GB or 32GB LPDDR4x RAM\t\t\n"


lvt_name: "Laptop Studio"


lvt_pencompatibility: "Surface Laptop Studio supports Microsoft Pen Protocol (MPP)\t\t\t\t\t\t\nSurface Laptop Studio supports tactile signals with Surface Slim Pen \t\t\t\t\t\t\n"
lvt_processor: "Quad-Core 11th Gen Intel® Core™ H35 i5-11300H Processor\t\t\t\t\t\nQuad-Core 11th Gen Intel® Core™ H35 i7-11370H Processor\t\t\t\t\t\n"
lvt_productcategoryid: "ef827f06-f91d-ed11-b83e-00224894319a"
lvt_security: "Hardware TPM 2.0 chip for enterprise security and BitLocker support\t\t\t\t\t\t\nEnterprise-grade protection with Windows Hello face sign-in\t\t\t\t\t\t\nWindows enhanced hardware security\t\t\t\t\t\t\n"
lvt_sensors: "Ambient light sensor\t\nAccelerometer\t\nGyroscope\t\nMagnetometer\t\n"
lvt_software: "Windows 10 Pro or Windows 11 Pro9\t\t\t\t\t\t\t\t\t\nPreloaded Microsoft 365 Apps10\t\t\t\t\t\t\t\t\t\nMicrosoft 365 Business Standard, Microsoft 365 Business Premium, or Microsoft 365 Apps 30-day trial11\t\t\t\t\t\t\t\t\t\n"
lvt_storage1: "Removable solid-state drive (SSD)2 options: 256 GB, 512 GB, 1TB, 2TB\n"
lvt_weight: "Intel® Core™ i5 models 1742.9 g (3.83 lb)\t\t\t\t\nIntel® Core™ i7 models 1820.2 g (4.00 lb)\t\t\t\t\n"
lvt_whatsinthebox: "Surface Laptop Studio\t\t\t\nIntel® Core™ i5: 65W Surface Power Supply\t\t\t\nIntel® Core™ i7: 102W Surface Power Supply\t\t\t\nQuick Start Guide\t\t\t\nSafety and warranty documents\t\t\t\n"
lvt_wireless: "Wi-Fi 6: 802.11ax compatible\t\t\nBluetooth Wireless 5.1 technology\t\t\n"
modifiedon: "2022-08-18T00:37:43Z"
overriddencreatedon: null
statecode: 0
statuscode: 1
timezoneruleversionnumber: null
utcconversiontimezonecode: null
versionnumber: 14644646
_createdby_value: "048c80a4-a654-444b-8df0-04f993a558e7"
_createdonbehalfby_value: null
_modifiedby_value: "048c80a4-a654-444b-8df0-04f993a558e7"
_modifiedonbehalfby_value: null
_organizationid_value: "079b4037-54e0-417a-b17e-5265e1081205"

*/

const TechComponent = ({
  product,
  isAccessories,
}: {
  product: IProductEntity;
  isAccessories: boolean;
}) => {
  const [showHideToggle, setShowHideToggle] = useState<boolean>(false);

  const list: any[] = [
    {
      name: "What's inside the box",
      content: product?.lvt_ProductInformation?.lvt_whatsinthebox,
    },
    {
      name: "Accessories",
      content: product?.lvt_ProductInformation?.lvt_accessoriessupport,
    },
    {
      name: "Battery",
      content: product?.lvt_ProductInformation?.lvt_batterylife,
    },
    {
      name: "Camera and Audio",
      content: product?.lvt_ProductInformation?.lvt_camerasvideoandaudio,
    },
    {
      name: "Connection",
      content: product?.lvt_ProductInformation?.lvt_connections,
    },
    {
      name: "Dimensions",
      content: product?.lvt_ProductInformation?.lvt_dimensions,
    },
    { name: "Display", content: product?.lvt_ProductInformation?.lvt_display },
    {
      name: "Exterior",
      content: product?.lvt_ProductInformation?.lvt_exterior,
    },

    {
      name: "Graphics",
      content: product?.lvt_ProductInformation?.lvt_graphics,
    },
    { name: "Hinge", content: product?.lvt_ProductInformation?.lvt_hinge },

    { name: "Memory", content: product?.lvt_ProductInformation?.lvt_memory },
    {
      name: "Compatibility",
      content: product?.lvt_ProductInformation?.lvt_pencompatibility,
    },
    {
      name: "Processor",
      content: product?.lvt_ProductInformation?.lvt_processor,
    },

    {
      name: "Security",
      content: product?.lvt_ProductInformation?.lvt_security,
    },
    { name: "Sensors", content: product?.lvt_ProductInformation?.lvt_sensors },

    {
      name: "Software",
      content: product?.lvt_ProductInformation?.lvt_software,
    },
    { name: "Storage", content: product?.lvt_ProductInformation?.lvt_storage1 },
    { name: "Weight", content: product?.lvt_ProductInformation?.lvt_weight },

    {
      name: "Wireless",
      content: product?.lvt_ProductInformation?.lvt_wireless,
    },
  ];

  const accesorieslist: any[] = [
    { name: "Compatibility", content: product?.lvt_compatibility },
    { name: "Dimensions", content: product?.lvt_productdimensions },
  ];

  useEffect(() => {
    //hide all
    for (let i = 0; i < list.length; i++) {
      onClickAccordion(i + 1);
    }

    //show first.
    onClickAccordion(1);
  }, []);

  const onToggleHideShowAll = () => {
    const show = !showHideToggle;
    //console.log("onToggleHideShowAll", show);
    for (let i = 0; i < list.length; i++) {
      onClickAccordion(i + 1, show);
    }
    setShowHideToggle(show);
  };

  const onClickAccordion = (num, _isShow = null) => {
    let accodion = document.getElementById("desc-content-" + num);
    let isShow = _isShow ? !_isShow : accodion?.classList?.contains("show");
    let up = document.getElementById("up-" + num);
    let down = document.getElementById("down-" + num);

    if (isShow) {
      accodion?.classList?.remove("show");
      if (down) down.className = "show";
      up?.classList?.remove("show");
    } else {
      if (accodion) accodion.className += " show";
      if (up) up.className = "show";
      down?.classList?.remove("show");
    }
  };

  const formatContent = (content) => {
    if (content) {
      const array = content?.split("\t\t\t\t\t\t\n");
      return array.map((item) => <p>{item}</p>);
    } else {
      return <></>;
    }
  };

  return (
    <Fragment>
      <div
        className="show-all-btn"
        onClick={() => onToggleHideShowAll()}
        style={{ float: "right" }}
      >
        {showHideToggle === true ? <>Hide All </> : <>Show All </>}
      </div>

      {list
        .filter((item) => item.content)
        .map((item, index) => (
          <div className="msft-accordion">
            <button
              className="msft-accordion-title-container"
              onClick={() => onClickAccordion(`${index + 1}`)}
            >
              <div id={"up-" + (index + 1)} className="show">
                {/* index === 0 ? "show" : "" */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3l-137.4 137.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z" />
                </svg>
              </div>
              <div id={"down-" + (index + 1)} className={""}>
                {/*index !== 0 ? "show" : ""*/}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z" />
                </svg>
              </div>
              <label>{item.name}</label>
            </button>
            <div className="msft-accordion-desc-container">
              <div
                className={"desc-content show"}
                id={"desc-content-" + (index + 1)}
              >
                {" "}
                {/*index === 0 ? "desc-content show" : "desc-content" */}
                {formatContent(item.content)}
              </div>
            </div>
          </div>
        ))}
      {isAccessories &&
        accesorieslist
          .filter((item) => item.content)
          .map((item, index) => (
            <div className="msft-accordion">
              <button
                className="msft-accordion-title-container"
                onClick={() => onClickAccordion(`${index + 1}`)}
              >
                <div id={"up-" + (index + 1)} className={"show"}>
                  {" "}
                  {/*index === 0 ? "show" : ""*/}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3l-137.4 137.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z" />
                  </svg>
                </div>
                <div id={"down-" + (index + 1)} className={"show"}>
                  {/*index === 0 ? "show" : ""*/}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z" />
                  </svg>
                </div>
                <label>{item.name}</label>
              </button>
              <div className="msft-accordion-desc-container">
                <div
                  className={"desc-content show"}
                  id={"desc-content-" + (index + 1)}
                >
                  {/* index === 0 ? "desc-content show" : "desc-content" */}
                  {formatContent(item.content)}
                </div>
              </div>
            </div>
          ))}
    </Fragment>
  );
};
export default TechComponent;
