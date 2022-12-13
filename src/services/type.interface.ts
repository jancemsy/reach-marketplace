export interface ICategoryImage {
    id: string;
    src: string;
}

export interface ICategoryEntity {
    Value: string;
    Label: ILabelEntity;
    Description: ILabelEntity;
}

export interface IPriceItemsListEntity {
    _lvt_owningaccount_value: string;
    lvt_pricelistitemid: string;
    lvt_audience: string;
    lvt_ProductAudience: IAudienceEntity;
    _lvt_product_value: string;
}

export interface IAudienceEntity{
    lvt_name: string;
    lvt_audienceid: string;
}

export interface IAudienceItemsList {
    name: string;
    description: string;
    img: string;
    audienceId: string;
}

export interface IProductInformation {
importsequencenumber:  any; //null
lvt_accessoriessupport: string ; // "Integrated Surface Slim Pen* storage for charging\t\t\t\t\nCompatible with Surface Dial* off-screen interaction\t\t\t\t\n"
lvt_batterylife: string ;//"Intel® Core™ i5: Up to 19 hours of typical device usage5\t\t\t\t\t\nIntel® Core™ i7: Up to 18 hours of typical device usage6\t\t\t\t\t\n"
lvt_camerasvideoandaudio: string; // "Windows Hello face authentication camera (front-facing)\t\t\t\t\t\n1080p resolution front facing camera.\t\t\t\t\t\nDual far-field Studio Mics\t\t\t\t\t\nQuad OmnisonicTM speakers with Dolby Atmos®8\t\t\t\t\t\n"
lvt_connections: string; //"2 x USB 4.0 with Thunderbolt™ 4 technologies support\t\t\t\t\t\n3.5mm headphone jack\t\t\t\t\t\n1 x Surface Connect port\t\t\t\t\t\n"
lvt_dimensions: string; //"12.72” x 8.98” x 0.746” (323.28 mm x 228.32 mm x 18.94 mm)\t\t\t\t\t\n"
lvt_display: string; // "Screen: 14.4” PixelSense™ Flow Display3\t\t\t\nRefresh rate: up to 120Hz\t\t\t\nResolution: 2400 x 1600 (201 PPI)\t\t\t\nAspect ratio: 3:2\t\t\t\nContrast ratio: 1500:1\t\t\t\nTouch: 10-point multi-touch\t\t\t\nDolby Vision® support4\t\t\t\n"
lvt_exterior: string; //"Casing: Magnesium and Aluminum\t\t\nColor: Platinum\t\t\n"
lvt_graphics: string; //"Intel® Core™ i5 models: Intel® Iris® Xe Graphics\t\t\t\t\t\t\n\t\t\t\t\t\t\nIntel® Core™ i7 models:\t\t\t\t\t\t\n\t\t\t\t\t\t\nNVIDIA® GeForce RTX™ 3050 Ti laptop GPU with 4GB GDDR6 GPU memory\t\t\t\t\t\t\n\t\t\t\t\t\t\nNVIDIA® RTX™ A2000 laptop GPU with 4GB GDDR6 GPU memory\t\t\t\t\t\t\n"
lvt_hinge: string; //"Dynamic Woven Hinge made of woven fabric with embedded cables that can bend 180 degrees\t\t\t\t\t\t\t\t\n"
lvt_memory: string; //"16GB or 32GB LPDDR4x RAM\t\t\n"
lvt_name: string; //"Laptop Studio"
lvt_pencompatibility: string; //"Surface Laptop Studio supports Microsoft Pen Protocol (MPP)\t\t\t\t\t\t\nSurface Laptop Studio supports tactile signals with Surface Slim Pen \t\t\t\t\t\t\n"
lvt_processor: string; // "Quad-Core 11th Gen Intel® Core™ H35 i5-11300H Processor\t\t\t\t\t\nQuad-Core 11th Gen Intel® Core™ H35 i7-11370H Processor\t\t\t\t\t\n"
lvt_productcategoryid: string; //"ef827f06-f91d-ed11-b83e-00224894319a"
lvt_security: string; //"Hardware TPM 2.0 chip for enterprise security and BitLocker support\t\t\t\t\t\t\nEnterprise-grade protection with Windows Hello face sign-in\t\t\t\t\t\t\nWindows enhanced hardware security\t\t\t\t\t\t\n"
lvt_sensors: string; //"Ambient light sensor\t\nAccelerometer\t\nGyroscope\t\nMagnetometer\t\n"
lvt_software: string; //"Windows 10 Pro or Windows 11 Pro9\t\t\t\t\t\t\t\t\t\nPreloaded Microsoft 365 Apps10\t\t\t\t\t\t\t\t\t\nMicrosoft 365 Business Standard, Microsoft 365 Business Premium, or Microsoft 365 Apps 30-day trial11\t\t\t\t\t\t\t\t\t\n"
lvt_storage1: string; //"Removable solid-state drive (SSD)2 options: 256 GB, 512 GB, 1TB, 2TB\n"
lvt_weight: string; ///"Intel® Core™ i5 models 1742.9 g (3.83 lb)\t\t\t\t\nIntel® Core™ i7 models 1820.2 g (4.00 lb)\t\t\t\t\n"
lvt_whatsinthebox: string; //"Surface Laptop Studio\t\t\t\nIntel® Core™ i5: 65W Surface Power Supply\t\t\t\nIntel® Core™ i7: 102W Surface Power Supply\t\t\t\nQuick Start Guide\t\t\t\nSafety and warranty documents\t\t\t\n"
lvt_wireless: string; //"Wi-Fi 6: 802.11ax compatible\t\t\nBluetooth Wireless 5.1 technology\t\t\n"
lvt_producticon1: string;
lvt_producticon2: string;
lvt_producticon3: string;
lvt_producticon4: string;
lvt_producttitle1: string;
lvt_producttitle2: string;
lvt_producttitle3: string;
lvt_producttitle4: string;
lvt_productdescription1: string;
lvt_productdescription2: string;
lvt_productdescription3: string;
lvt_productdescription4: string;
lvt_productviewgallery: string;
statecode: number;
statuscode:  number;
lvt_devicegroupdescription : string;
lvt_productgroupoverview: string;
lvt_devicegroupdetails:string;
timezoneruleversionnumber: string;
utcconversiontimezonecode: string;
versionnumber: string;
_createdby_value: string;
_createdonbehalfby_value: string;
_modifiedby_value:string;
_modifiedonbehalfby_value: string;
_organizationid_value: string; //use this???
lvt_productfamilyimage: string;
}

export interface ICartInfo{
    cartId: number | string;
    code: string;
    total: number;
    subtotal: number;
    tax : number;
    count: number;
    comment: string;

}


export interface IProductEntity {
    //lvt_pricelistitems columns

     //*************************************************************************
     //special fields not defined in product but i use this somewhere in the app
    lvt_pricelistitemid : string;  //use this when navigating from screen to another instead lvt_productid

    price : number;
    tax  : number;
    lvt_taxvalue: number;
    category_caption : string;
     //************************************************************************ */


    lvt_ProductInformation: IProductInformation;

    //products columns
    lvt_unitpriceexgst: number;
    lvt_name: string;
    lvt_productcategory: string;
    statuscode: number;
    statecode: number;
    lvt_productimage_url: string;
    _createdby_value: string;
    lvt_productid: string;
    cr107_shortspecs: string;
    cr107_description: string;
    lvt_productimage: string;

    lvt_overview_weight_title: string;
    lvt_overview_weight_description: string;
    lvt_overview_weight_icon: string;

    lvt_overview_processor_title: string;
    lvt_overview_processor_description: string;
    lvt_overview_processor_icon: string;

    lvt_overview_typing_title: string;
    lvt_overview_typing_description: string;
    lvt_overview_typing_icon: string;

    lvt_overviewbatterytitle: string;
    lvt_overviewbatterydescription: string;
    lvt_overviewbatteryicon: string;



    lvt_sku: string;
    overriddencreatedon:string;

    _lvt_productinformation_value: string;
    lvt_overview_title: string;
    lvt_ram: string;
    lvt_processor: string;
    lvt_os: string;
    lvt_hdd: string;
    lvt_colour: string;
    lvt_description: string;
    lvt_productdimensions: string;
    lvt_productoverview: string;
    createdon: string;
    modifiedon: string;


lvt_producttitle1 :string;
lvt_productdescription1 :string;
lvt_producticon1:string;

lvt_producttitle2 :string;
lvt_productdescription2 :string;
lvt_producticon2:string;

lvt_producttitle3 :string;
lvt_productdescription3 :string;
lvt_producticon3:string;

lvt_producttitle4 :string;
lvt_productdescription4 :string;
lvt_producticon4:string;

lvt_producticon5: string;

["_lvt_productinformation_value@OData.Community.Display.V1.FormattedValue"]: string;

lvt_accessorydescription: string;
lvt_compatibility: string;
}

export interface ISpecificationList {
    product: IProductEntity;
    lvt_priceincludegst_base: number;
    lvt_priceincludegst: number;
    lvt_unitpriceexgst: number;
    exchangerate: number;
    lvt_pricelistitemid: string;
    lvt_taxvalue: number;
    quantity: number;
    totalprice: number;
}

export interface IProdConfigEntity {
    specification: ISpecificationList;
    addOns: IAddOns;
    accesories: ISpecificationList[];
}

export interface IAddOns {
    os: ISpecificationList;
    protectionPlan?: ISpecificationList;
}

export interface ILabelEntity {
    LocalizedLabels: ILabel[];
    UserLocalizedLabel: ILabel;
}

export interface ILabel {
    Label: string;
    LanguageCode: number;
    MetadataId: string;
}

export interface NewsFilterEntity {
    StartsAfter?: string;
    StartsBefore?: string;
    UnreadOnly?: boolean;
    BookmarksOnly?: boolean;
    Channels?: string;
    Search?: string;
    SearchInTitlesOnly?: boolean;
    Owner?: string;
    ModifiedSince?: string;
    Token?: string;
    PageSize?: number;
    BeforeDate?: string;
    IsFirstPage?: boolean;
    Keywords?: string;
    SubscribedOnly?: boolean;
}

export interface NewEntity {
    id: string;
    channels: ChannelsEntity[];
    timeZone: string;
    expiryDate: string;
    locations: LocationEntity[];
    status: string;
    owner: OwnerEntiry;
    isUnread: boolean;
    isLiked: boolean;
    bannerInfo: BannerInfoEntity;
    fileAccessToken: string;
    contents: ContentEntity;
    statistics: StatisticsEntity;
    permalink: string;
    author: UserEntity;
    modified: string;
    metadata: MetaEntity;
    publishingDate: string;
}

export interface ChannelsEntity {
    id: string;
    name: string;
}

export interface LocationEntity {
    locationId: string;
    name: string;
    locationOnMap: string;
    url: string;
    maxNumberOfSeats: number;
    readOnly: boolean;
}

export interface OwnerEntiry {
    id: string;
    displayName: string;
    userPrincipalName: string;
}

export interface BannerInfoEntity{
    type: string;
    imageId: string;
    videoSource: string;
    videoId: string;
    videoUrl: string;
    isDirectVideoUrl: boolean;
}

export interface ContentEntity {
    de: MyContentEntity;
    en: MyContentEntity;
}

export interface MyContentEntity {
    active: boolean;
    language: string;
    title: string;
    intro: string;
    body: string;
}

export interface StatisticsEntity{
    commentCount: number;
    likeCount: number;
    participantsCount: number
}

export interface UserEntity {
    id: string;
    tokenUniqueId: string;
    displayName: string;
    userPrincipalName: string;
    mail: string;
    hasPrivateEmail: boolean;
    authenticationType: number;
    type: number;
    preferredUiLanguage: string;
    preferredContentLanguage: string;
    preferredLocale: string;
    preferredTimeZone: string;
    tenantId: string;
}

export interface MetaEntity {
    selectValue: SelectValueEntity;
    ui: UIEntity;
    type: string;
}

export interface SelectValueEntity {
    caseSensitive: boolean;
    delimiter: string;
    multiValue: boolean;
    multipleFreetext: boolean;
    values: string[];
}

export interface UIEntity {
    component: string;
    description: string;
    hidden: boolean;
    readonly: boolean;
    title: string;
}

export interface IInvoice {
    isExpanded : boolean; //frontend
    isLoaded : boolean; //frontend
    createdon: string;
    lvt_shoppingbasketid:string;
    lvt_invoiceid: string;
    statecode: number;
    statuscode: number;
    lvt_cartnumber: string;
    lvt_item_count: number;
    lvt_total_amount: number;
}

export interface IQuoteItems {
    createdon: string;
    modifiedon: string;
    importsequencenumber: string;
    lvt_ShoppingBasketItemRecord: ICartItem;
    lvt_name: string;
    lvt_quoteitemid: string;
    overriddencreatedon: string;
    statecode: number;
    statuscode: number;
    timezoneruleversionnumber: string;
    utcconversiontimezonecode: string;
    versionnumber: number;
    _createdby_value: string;
    _createdonbehalfby_value: string;
    _lvt_invoice_value: string;
    _lvt_pricelistproduct_value: string;
    _lvt_shoppingbasketitemrecord_value: string;
    _modifiedby_value: string;
    _modifiedonbehalfby_value: string;
    _organizationid_value: string;
}

export interface ICartItem{
lvt_cart_group_id  : string;  //main id generated for grouping cart items
lvt_parent_productid : string;  //ref reference product main id
createdon:  string;
exchangerate: number;
lvt_Product: IProductEntity;
lvt_gstvalue: string;
lvt_gstvalue_base: string;
lvt_name:string;
lvt_priceexcludinggst: string;
lvt_priceexcludinggst_base: string;
lvt_priceincludinggst: number;
lvt_priceincludinggst_base: number;
lvt_qty: number;
lvt_shoppingbasketitemid: string;
modifiedon: string;
statecode: number;
statuscode:  number;
versionnumber: number;
_createdby_value: string;
_createdonbehalfby_value:string;
_lvt_company_value:string;
_lvt_contact_value: string;
_lvt_product_value: string;
_lvt_shoppingbasket_value: string;
_modifiedby_value: string;
_modifiedonbehalfby_value: string;
_organizationid_value: string;
_transactioncurrencyid_value: string;
}

export interface ICart {
    lvt_cart_group_id  : any; //special id only in fe
    lvt_cartnumber : any;
    lvt_shoppingbasketid: string; // "ac42d4ac-cd2c-ed11-9db1-002248933c9b"
    lvt_name	: string;
    _organizationid_value	:	string;
    statecode	:	 number;
    statuscode	:	 number;
    emailaddress	:	string;
    _createdby_value	:	 string;
    lvt_basketvalue_date	:	string;
    _transactioncurrencyid_value	: string;
    modifiedon	:	string;
    _modifiedby_value	:	string;
    lvt_basketvalue_state	:	number;
    versionnumber	:	number;
    exchangerate	:	number;
    createdon	:	string;
    lvt_basketvalue_base	:	number;
    _lvt_contact_value	:	any;
    lvt_comments	:	any;
    overriddencreatedon	:	any;
    importsequencenumber	:any;
    _modifiedonbehalfby_value	:any;
    lvt_quotepdf_name	:	any;
    lvt_quotepdf	:	any;
    utcconversiontimezonecode	:	any;
    _createdonbehalfby_value	:	any;
    _lvt_account_value	:	any;
    timezoneruleversionnumber	: any;
    cartItems : ICartItem[];
    lvt_total_amount: number;
    lvt_item_count: number;
    lvt_customerpo: string;
}

export interface ITermsCondition {
    createdon: string;
    lvt_contractconditions: string;
    lvt_name: string;
    lvt_acceptancecondition: string;
}