import {
  IProductEntity,
  IInvoice,
  IQuoteItems,
  ICart,
  ICartInfo,
} from "./type.interface";
import {
  useBasicFetch,
  useBasicGet,
  useBasicPost,
  useBasicPatch,
  useFetchCategoryOptions,
  useBasicFetchPaginated,
} from "./useQueries";

//statecode
const QUOTE_HEADER_ACTIVE = 0;
const QUOTE_HEADER_INACTIVE = 1;

//statuscode
const QUOTE_HEADER_REASON_CURRENT = 1; //default
const QUOTE_HEADER_REASON_PENDING = 857860002;
const QUOTE_HEADER_REASON_DELETED = 857860003;

//statecode
const QUOTE_ITEM_ACTIVE = 0;
const QUOTE_ITEM_INACTIVE = 1;

export class QuoteService {
  GlobalStore = null;

  itemsPerPage = null;
  accountId = null;
  MSFTToken = null;
  ReachToken = null;
  ProductType = null;
  Categories = null;
  setCategories = null;
  Audience = null;
  entityName = null;
  User = null;
  setQuoteCount = null;
  setMyQuote = null;
  cache = {};
  prodService = null;

  constructor() {}

  private GetItem(name) {
    if (this.cache) {
      return this.cache[name] || null;
    }
  }

  private SetItem(name, value) {
    this.cache[name] = value;
  }

  setGlobalStore(GlobalStore: any) {
    this.GlobalStore = GlobalStore;
    const {
      setQuoteCount,
      setMyQuotes,
      User,
      entityName,
      Audience,
      Categories,
      setCategories,
      ProductType,
      itemsPerPage,
      accountId,
      MSFTToken,
      ReachToken,
    } = this.GlobalStore;
    this.entityName = entityName;
    this.itemsPerPage = itemsPerPage;
    this.accountId = accountId;
    this.MSFTToken = MSFTToken;
    this.ReachToken = ReachToken;
    this.Categories = Categories;
    this.setCategories = setCategories;
    this.Audience = Audience;
    this.User = User;
    this.setQuoteCount = setQuoteCount;
    this.setMyQuote = setMyQuotes;
  }

  private SaveMyQuote(quote) {
    this.SetItem(`QUOTE`, quote); //prodservice use this
    this.setMyQuote(quote); //global store data
    this.setQuoteCount(quote.length);
  }

  public async getActiveQuotes(): Promise<IInvoice[]> {
    return new Promise((resolve) => {
      const url =
        `/api/data/v9.2/lvt_invoices?$select=*` +
        `&$filter=statecode%20eq%20${QUOTE_HEADER_ACTIVE}%20and%20emailaddress%20eq%20'${this.User.mail}'`;

      useBasicGet(this.MSFTToken, url).then(async (result: any) => {
        if (result?.status === 200 || result?.status === 201) {
          const _quotes = result?.data.value;
          resolve(_quotes);
        } else {
          resolve(null);
        }
      });
    });
  }

  async DeleteQuoteItems(lvt_quoteitemid): Promise<any> {
    const params = {
      statecode: QUOTE_ITEM_INACTIVE,
      /// ,statuscode: CART_HEADER_REASON_DELETED    //reason but doesnt work
    };

    const result = await useBasicPatch(
      this.MSFTToken,
      "/api/data/v9.2/lvt_quoteitems(" + lvt_quoteitemid + ")",
      params
    );

    if (result.status === 200 || result.status === 201) {
      //console.log("delete quote item");
      let current_quotes: IQuoteItems[] = [
        ...(await this.GetActiveQuotesItems()),
      ]; //dont include the ref
      let new_carts: IQuoteItems[] = [];

      for (let i = 0; i < current_quotes.length; i++) {
        var item = current_quotes[i];
        if (item.lvt_quoteitemid !== lvt_quoteitemid) {
          new_carts.push(item);
        }
      }

      this.SaveMyQuote(new_carts);
    }
  }

  async UpdateQuoteItems(_lvt_invoice_value, carts): Promise<any> {}

  public async GetAllQuotes(): Promise<IInvoice[]> {
    return new Promise((resolve) => {
      const url =
        `/api/data/v9.2/lvt_invoices?$select=*` +
        `&$filter=emailaddress%20eq%20'${this.User.mail}'`;

      useBasicGet(this.MSFTToken, url).then(async (result: any) => {
        if (result?.status === 200 || result?.status === 201) {
          const _quotes = result?.data.value;
          resolve(_quotes);
        } else {
          resolve(null);
        }
      });
    });
  }

  public async GetActiveQuotesItems(): Promise<IQuoteItems[]> {
    //console.log("GetActiveQuote()");
    let quote = this.GetItem(`QUOTE`);

    if (quote) {
      this.SaveMyQuote(quote);
      return new Promise((resolve) => resolve(quote));
    } else {
      return new Promise((resolve) => {
        const url =
          `/api/data/v9.2/lvt_invoices?$select=lvt_invoiceid,createdon,statuscode,` +
          `statecode&$filter=statecode%20eq%20${QUOTE_HEADER_ACTIVE}%20and%20emailaddress%20eq%20'${this.User.mail}'`;

        useBasicGet(this.MSFTToken, url).then(async (result: any) => {
          if (result?.status === 200 || result?.status === 201) {
            const _quotes = result?.data.value;
            //console.log(_quotes);
            let quotes = [];
            //for(let i = 0; i < _quotes.length; i++){
            let _quote = _quotes[_quotes.length - 1];
            let quoteItems = await this.GetActiveQuoteItems(
              _quote.lvt_invoiceid
            );
            quotes = quotes.concat(quoteItems);
            //}
            //const final_carts = carts.filter(cart => cart.cartItems.length > 0);

            this.SaveMyQuote(quotes);
            resolve(quotes);
          } else {
            resolve(null);
          }
        });
      });
    }
  }

  private async GetActiveQuoteItems(quoteId): Promise<IQuoteItems[]> {
    return new Promise((resolve) => {
      const url = `/api/data/v9.2/lvt_quoteitems?$expand=lvt_ShoppingBasketItemRecord($select=*;$expand=lvt_Product($select=*;$expand=lvt_ProductInformation($select=*)))&$filter=_lvt_invoice_value%20eq%20'${quoteId}'%20and%20statecode%20eq%20${QUOTE_ITEM_ACTIVE}`;
      useBasicGet(this.MSFTToken, url).then((result) => {
        if (result.status === 200 || result.status === 201) {
          let item: IQuoteItems[] = result.data.value;

          resolve(item);
        } else {
          resolve(null);
        }
      });
    });
  }

  async submitQuote(carts, status, statusReason) {
    //console.log("Submit cart entries..", carts );
    const { prodService } = this.GlobalStore;

    if (status === 1 && statusReason === 857860001) prodService.CompleteCarts();
    // Do something here...
    /*const today = new Date().toLocaleDateString();

            const {cartInfo} : {cartInfo:ICartInfo} = this.GlobalStore;

            //_lvt_customer_value
            const lvt_Quoteid = await this.CreateQuote({
                        lvt_name : `${this.entityName} ${today}`,
                        emailaddress:   this.User.mail,
                        statecode: status,
                        statuscode: statusReason,
                        lvt_shoppingbasketid: `${cartInfo.cartId}`,
                        lvt_quotenumber : `${cartInfo.code}`, //cart header and quote should contain the same number
                        lvt_item_count : `${cartInfo.count}`,
                        lvt_total_amount : `${cartInfo.total}`,
                    });


            if(!lvt_Quoteid){
                return new Promise(   resolve  =>  resolve(false));
            }else{
                console.log("Submit Quote ID",lvt_Quoteid);
                console.log("Cart",carts);
                let newQuoteList = [];

                carts.forEach((cart) => {
                    if(cart.cartItems?.length > 0){
                        cart.cartItems.forEach((item) => {
                            newQuoteList.push({
                                "lvt_Invoice@odata.bind": "/lvt_invoices("+ lvt_Quoteid +")",
                                "lvt_ShoppingBasketItemRecord@odata.bind": "/lvt_invoices("+ item.lvt_shoppingbasketitemid +")",
                                lvt_name: item.lvt_name
                            })
                        });
                    }
                });

                let promises = [];
                for(let i = 0; i < newQuoteList.length; i++){
                    let item = newQuoteList[i];
                    promises.push(this.CreateQuoteEntries( item ));
                }
                return new Promise( resolve => {
                    Promise.allSettled(promises).then((values) => {
                        console.log("entries succcessful", values);

                        

                        this.SetItem(`QUOTE`, null); //clear this to force to load new..
                        resolve(true);
                    });
                });
            }*/
  }

  private async CreateQuoteEntries(params: any) {
    return new Promise((resolve) => {
      useBasicPost(
        this.MSFTToken,
        "/api/data/v9.2/lvt_quoteitems",
        params
      ).then((result) => {
        resolve(result.status === 200 ? result.data : null);
      });
    });
  }

  public async CreateQuote(params): Promise<number | null> {
    return new Promise((resolve) => {
      useBasicPost(this.MSFTToken, "/api/data/v9.2/lvt_invoices", params).then(
        (result) => {
          try {
            //console.log("CreateQuote()" , result);
            if (result.status === 200 || result.status === 201) {
              const lvt_invoiceid = result?.data?.lvt_invoiceid;
              if (lvt_invoiceid) {
                resolve(lvt_invoiceid);
              } else {
                resolve(null);
              }
            } else {
              resolve(null);
            }
          } catch (e) {
            console.log(e);
            resolve(null);
          }
        }
      );
    });
  }
}
