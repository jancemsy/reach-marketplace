import uuid from "react-uuid";
import { getURLParam } from "../helpers/common";
import {
  ICart,
  ICartInfo,
  ICartItem,
  IInvoice,
  IProductEntity,
} from "./type.interface";

import {
  useBasicFetchPaginated,
  useBasicGet,
  useBasicPatch,
  useBasicPost,
  useFetchCategoryOptions,
} from "./useQueries";
const ACCESSORIES = 2;
const DEVICES = 1;

//statecode
const CART_HEADER_ACTIVE = 0;
const CART_HEADER_INACTIVE = 1;

//statuscode
//active
const CART_HEADER_ACTIVE_REASON_CURRENT = 1; //default
const CART_HEADER_ACTIVE_REASON_PENDING = 857860002;
const CART_HEADER_ACTIVE_REASON_SAVED = 857860003;

//inactive
const CART_HEADER_INACTIVE_REASON_COMPLETED = 857860001;
const CART_HEADER_INACTIVE_REASON_DELETED = 857860000;

//statecode
const CART_ITEM_ACTIVE = 0;
const CART_ITEM_INACTIVE = 1;

//not really important to use this

//statuscode
const CART_ITEM_REASON_ACTIVE = 1;
const CART_ITEM_REASON_INACTIVE = 2;
const CART_ITEM_REASON_DELETED = 857860000;

//hardcoded for now. (primarycontactid/gendercode eq 1)
/*

0: {id: 857860002, name: 'Accessories'}
1: {id: 857860005, name: 'Go'}
2: {id: 857860003, name: 'Laptop '}
3: {id: 857860006, name: 'Laptop Go'}
4: {id: 857860007, name: 'Laptop Studio'}
5: {id: 857860004, name: 'Pro'}
6: {id: 857860001, name: 'Warranty'}

*/

export class ProductService {
  GlobalStore = null;

  _not_equal_empty_category =
    "%20and%20(lvt_Product/lvt_productcategory%20ne%20" + "null)"; //not equal product
  _not_equal_product =
    "%20and%20(lvt_Product/lvt_productcategory%20ne%20" + "857860000)"; //not equal product
  _not_equal_warranty =
    "%20and%20(lvt_Product/lvt_productcategory%20ne%20" + "857860001)"; //not equal Warranty
  _not_equal_accessories =
    "%20and%20(lvt_Product/lvt_productcategory%20ne%20" + "857860002)"; //not equal accessories
  //_equal_accessories = "%20and%20(lvt_Product/lvt_productcategory%20eq%20" + "857860002)"; // equal accessories
  _equal_accessories =
    "(lvt_Product/lvt_productcategory%20eq%20" + "857860002)"; // equal accessories

  FILTER_DEVICES = `${this._not_equal_product}${this._not_equal_warranty}${this._not_equal_accessories}${this._not_equal_empty_category}`;
  FILTER_ACCESSORIES = this._equal_accessories + this._not_equal_empty_category;

  itemsPerPage = null;
  accountId = null;
  MSFTToken = null;
  ReachToken = null;
  ProductType = parseInt(`${getURLParam("type") || 1}`);
  Categories = null;

  Audience = null;
  entityName = null;
  User = null;
  productIDNONE = null;
  cache = {};

  constructor() {}

  private Global(name) {
    const params = this.GlobalStore;
    return params[name];
  }

  private GetItem(name) {
    if (this.cache) {
      return this.cache[name] || null;
    }
  }

  private SetItem(name, value) {
    this.cache[name] = value;
  }

  public setGlobalStore(GlobalStore: any) {
    this.GlobalStore = GlobalStore;
    const {
      ProductType,
      User,
      entityName,
      Audience,
      Categories,
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
    this.Audience = Audience;
    this.User = User;
    this.ProductType = ProductType;
  }

  private UniquefiedProducts(object: IProductEntity[]): IProductEntity[] {
    if (this.ProductType === ACCESSORIES) {
      //no need to filter accessories because it only have one category id.
      return object;
    } else {
      const filteredItems: IProductEntity[] = object; //this is already filtered from the query to get only a list with productinformation or if accesories, just return everything.

      const uniqueIds = [];
      const unique = filteredItems.filter((element) => {
        const isDuplicate = uniqueIds.includes(element.lvt_productcategory); //by category

        if (!isDuplicate) {
          uniqueIds.push(element.lvt_productcategory);
          return true;
        }
        return false;
      });

      return unique;
    }
  }

  //for accessories item
  public async AddItemToCart(itemEntry: IProductEntity) {
    const today = new Date().toLocaleDateString();

    //first get active cart
    const activecart = await this.GetActiveCarts();
    let lvt_shoppingbasketid = null;

    if (activecart && activecart.length > 0) {
      lvt_shoppingbasketid = activecart[0].lvt_shoppingbasketid;
    } else {
      lvt_shoppingbasketid = await this.CreateShoppingCart({
        lvt_name: `${this.entityName} ${today}`,
        emailaddress: this.User.mail,
      });
    }

    if (!lvt_shoppingbasketid) {
      return new Promise((resolve) => resolve(false));
    } else {
      let lvt_parent_productid = "";
      const lvt_cart_group_id = uuid();
      const item = {
        lvt_cart_group_id,
        "lvt_Product@odata.bind":
          "/lvt_shoppingbaskets(" + itemEntry.lvt_productid + ")",
        "lvt_ShoppingBasket@odata.bind":
          "/lvt_shoppingbaskets(" + lvt_shoppingbasketid + ")",
        lvt_parent_productid,
        lvt_priceexcludinggst: itemEntry.lvt_unitpriceexgst,
        lvt_priceincludinggst: itemEntry.price,
        lvt_gstvalue: itemEntry.tax,
        lvt_qty: 1,
        lvt_name: itemEntry.lvt_name,
      };

      return new Promise((resolve) => {
        this.CreateCartEntries(item).then((result) => {
          this.SetItem(`CARTS`, null); //clear this to force to load new..
          this.GetActiveCarts().then((result) => {
            resolve(true); //only redirect if we have a new record.
          });
        });
      });
    }
  }

  private async updateCartInfo(cartId = null): Promise<any> {
    // default is current active cart,  if id is provided use what ever record associated to the id
    const { cartInfo }: { cartInfo: ICartInfo } = this.GlobalStore;
    let params: any = {};

    let lvt_shoppingbasketid = null;

    if (cartId) {
      lvt_shoppingbasketid = cartId;
      const _cache_cart: ICart[] = this.GetItem(`CARTS_${cartId}`); //get cache data from previous query by id
      const _cartsInfo: ICartInfo = this.GetCartsInfoByVar(_cache_cart);
      params = {
        lvt_item_count: `${_cartsInfo.count}`,
        lvt_total_amount: `${_cartsInfo.total}`,
      };
    } else {
      lvt_shoppingbasketid = cartInfo.cartId;
      params = {
        lvt_item_count: `${cartInfo.count}`,
        lvt_total_amount: `${cartInfo.total}`,
      };
    }

    const result = await this.UpdateCart(params, lvt_shoppingbasketid);

    return new Promise((resolve) => resolve(result));
  }

  public async SubmitCart({
    currentSelectedSpecification,
    currentSelectedOS,
    currentSelectedProdPlan,
    currentSelectedAccessories,
  }): Promise<any> {
    const today = new Date().toLocaleDateString();

    //first get active cart
    const activecart = await this.GetActiveCarts();

    //console.log("submit carts active cart test", activecart);
    let lvt_shoppingbasketid = null;

    if (activecart && activecart.length > 0) {
      lvt_shoppingbasketid = activecart[0].lvt_shoppingbasketid;
    } else {
      lvt_shoppingbasketid = await this.CreateShoppingCart({
        lvt_name: `${this.entityName} ${today}`,
        emailaddress: this.User.mail,
      });
    }
    if (!lvt_shoppingbasketid) {
      return new Promise((resolve) => resolve(false));
    } else {
      let _entries: any[] = [];
      _entries = currentSelectedSpecification
        ? _entries.concat(currentSelectedSpecification)
        : _entries;
      _entries = currentSelectedOS
        ? _entries.concat(currentSelectedOS)
        : _entries;
      _entries = currentSelectedProdPlan
        ? _entries.concat(currentSelectedProdPlan)
        : _entries;
      _entries = currentSelectedAccessories
        ? _entries.concat(currentSelectedAccessories)
        : _entries;

      let lvt_parent_productid = "";
      const lvt_cart_group_id = uuid();

      _entries.forEach((item) => {
        if (item.product) {
          const category_caption = this.getCategoryLabel(item);
          if (
            category_caption !== "Warranty" &&
            category_caption !== "Accessories" &&
            category_caption !== "OS"
          ) {
            lvt_parent_productid = item.product.lvt_productid;
          }
        }
      });

      const entriesFiltered = _entries.filter(
        (item) => item.product && item.totalprice
      );
      const findContactMeIndex = _entries.findIndex(
        (item) => `${item?.product?.lvt_name}`.search("Contact me") > -1
      );

      if (findContactMeIndex > -1) {
        await this.UpdateCartComment(
          _entries[findContactMeIndex].product.lvt_name,
          lvt_shoppingbasketid
        );
      }

      const entries = entriesFiltered.map((item) => {
        return {
          lvt_cart_group_id,
          "lvt_Product@odata.bind":
            "/lvt_shoppingbaskets(" + item.product.lvt_productid + ")",
          "lvt_ShoppingBasket@odata.bind":
            "/lvt_shoppingbaskets(" + lvt_shoppingbasketid + ")",
          lvt_parent_productid,
          lvt_priceexcludinggst: item.lvt_unitpriceexgst,
          lvt_priceincludinggst: item.lvt_priceincludegst,
          lvt_gstvalue: item.lvt_taxvalue,
          lvt_qty: item.quantity,
          lvt_name: item.product.lvt_name,
        };
      });
      let promises = [];
      for (let i = 0; i < entries.length; i++) {
        let item = entries[i];
        promises.push(this.CreateCartEntries(item));
      }

      return new Promise((resolve) => {
        Promise.allSettled(promises).then((values) => {
          this.SetItem(`CARTS`, null); //clear this to force to load new..
          this.GetActiveCarts().then((result) => {
            resolve(true); //only redirect if we have a new record.
          });
        });
      });
    }
  }

  private async CreateCartEntries(params: any) {
    return new Promise((resolve) => {
      useBasicPost(
        this.MSFTToken,
        "/api/data/v9.2/lvt_shoppingbasketitems",
        params
      ).then((result) => {
        resolve(result.status === 200 ? result.data : null);
      });
    });
  }

  public async CreateShoppingCart(params): Promise<number | null> {
    //console.log("createShoppingCart");
    return new Promise((resolve) => {
      useBasicPost(
        this.MSFTToken,
        "/api/data/v9.2/lvt_shoppingbaskets",
        params
      ).then((result) => {
        try {
          if (result.status === 201) {
            const lvt_shoppingbasketid = result?.data?.lvt_shoppingbasketid;
            if (lvt_shoppingbasketid) {
              resolve(lvt_shoppingbasketid);
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        } catch (e) {
          console.log("whats this error", e);
          resolve(null);
        }
      });
    });
  }

  private GetCartsInfoByVar(carts: ICart[]): ICartInfo {
    //get total amount
    let total = 0;
    let tax = 0;
    let newCount = 0;

    carts.forEach((items) => {
      if (items?.cartItems?.length > 0) {
        items.cartItems.forEach((item) => {
          tax += Number(item.lvt_gstvalue) * Number(item?.lvt_qty);
          total += Number(item.lvt_priceexcludinggst) * Number(item?.lvt_qty);
          newCount += Number(item.lvt_qty);
        });
      }
    });

    const subtotal = total + tax; //(excluded tax) + tax
    const cartHeader = carts.length > 0 ? carts[0] : null;

    const _cartInfo: ICartInfo = cartHeader
      ? {
          cartId: cartHeader.lvt_shoppingbasketid,
          code: cartHeader.lvt_cartnumber,
          total,
          subtotal,
          tax,
          count: newCount,
          comment: "",
        }
      : {
          cartId: "",
          code: "",
          total: 0,
          subtotal: 0,
          tax: 0,
          count: 0,
          comment: "",
        };

    return _cartInfo;
  }

  private SaveMyCart(carts: ICart[]) {
    const setMyCarts = this.Global("setMyCarts");

    this.SetItem(`CARTS`, carts); //prodservice use this
    setMyCarts(carts); //global store data

    const _cartInfo = this.GetCartsInfoByVar(carts);
    const setCartInfo = this.Global("setCartInfo");
    setCartInfo(_cartInfo);
    setTimeout(() => {
      this.updateCartInfo(); //figure a way to update this
    }, 100);
  }

  public async GetAllQuotes(): Promise<IInvoice[]> {
    return new Promise((resolve) => {
      const url =
        `/api/data/v9.2/lvt_shoppingbaskets?$select=*` +
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

  public async GetCartsById(cartId): Promise<ICart[]> {
    return new Promise((resolve) => {
      const url = `/api/data/v9.2/lvt_shoppingbaskets?$select=*&$filter=lvt_shoppingbasketid%20eq%20'${cartId}'and%20emailaddress%20eq%20'${this.User.mail}'`;
      useBasicGet(this.MSFTToken, url).then(async (result: any) => {
        if (result?.status === 200) {
          const _carts = result?.data.value;
          let carts: ICart[] = [];

          let allItems: any[] = [];
          for (let i = 0; i < _carts.length; i++) {
            let _cart = _carts[i];
            let cartItems: ICartItem[] = await this.GetActiveCartItems(
              _cart.lvt_shoppingbasketid
            );
            cartItems.forEach((_item) => {
              Array.isArray(allItems[_item.lvt_cart_group_id])
                ? allItems[_item.lvt_cart_group_id].push(_item)
                : (allItems[_item.lvt_cart_group_id] = [_item]);
            });

            carts.push({ ..._cart, cartItems });
          }
          let cart_groups = Object.keys(allItems);
          let final_carts = [];
          cart_groups.forEach((this_group_id) => {
            let cartItems = allItems[this_group_id];
            final_carts.push({
              ...carts[0],
              lvt_cart_group_id: this_group_id,
              cartItems,
            });
          });

          this.SetItem(`CARTS_${cartId}`, final_carts);
          resolve(final_carts);
        } else {
          resolve(null);
        }
      });
    });
  }

  //current carts
  public async GetActiveCarts(): Promise<ICart[]> {
    let carts = this.GetItem(`CARTS`);

    if (carts && carts.length > 0) {
      this.SaveMyCart(carts);
      return new Promise((resolve) => resolve(carts));
    } else {
      return new Promise((resolve) => {
        const url = `/api/data/v9.2/lvt_shoppingbaskets?$select=*&$filter=statecode%20eq%20${CART_HEADER_ACTIVE}%20and%20statuscode%20eq%20${CART_HEADER_ACTIVE_REASON_PENDING}%20and%20emailaddress%20eq%20'${this.User.mail}'`;

        useBasicGet(this.MSFTToken, url).then(async (result: any) => {
          const _carts = result?.data.value;

          //console.log("GetActiveCarts result", _carts);

          if (result?.status === 200 && _carts && _carts.length > 0) {
            //console.log("_carts data ", _carts);
            let carts: ICart[] = [];

            let allItems: any[] = [];

            //just use the last one.
            let _cart = _carts[_carts.length - 1];
            let cartItems: ICartItem[] = await this.GetActiveCartItems(
              _cart.lvt_shoppingbasketid
            );

            cartItems.forEach((_item) => {
              Array.isArray(allItems[_item.lvt_cart_group_id])
                ? allItems[_item.lvt_cart_group_id].push(_item)
                : (allItems[_item.lvt_cart_group_id] = [_item]);
            });
            carts.push({ ..._cart, cartItems });

            let cart_groups = Object.keys(allItems);

            let final_carts = [];
            cart_groups.forEach((this_group_id) => {
              let cartItems = allItems[this_group_id];
              final_carts.push({
                ...carts[0],
                lvt_cart_group_id: this_group_id,
                cartItems,
              });
            });

            this.SaveMyCart(final_carts);
            resolve(final_carts);
          } else {
            //console.log("GetActiveCarts result empty??");
            resolve(null);
          }
        });
      });
    }
  }

  private async GetActiveCartItems(cartId): Promise<ICartItem[]> {
    return new Promise((resolve) => {
      const url = `/api/data/v9.2/lvt_shoppingbasketitems?$top=100&$expand=lvt_Product($select=*;$expand=lvt_ProductInformation($select=*))&$filter=_lvt_shoppingbasket_value%20eq%20'${cartId}'%20and%20statecode%20eq%20${CART_ITEM_ACTIVE}`;

      useBasicGet(this.MSFTToken, url).then((result) => {
        if (result.status === 200) {
          let item: ICartItem[] = result.data.value;

          item = item.filter((i) => {
            let _item = i;
            const category_caption = this.getCategoryLabel(i);
            _item.lvt_Product.category_caption = category_caption;
            return { ..._item };
          });
          resolve(item);
        } else {
          //console.log("GetActiveCartItems error(): ");
          resolve(null);
        }
      });
    });
  }

  public async GetAllGetCategoriesProducts(): Promise<any[]> {
    const glCategories = this.Global("Categories");
    const glsetCategories = this.Global("setCategories");

    return new Promise((resolve) => {
      if (glCategories && glCategories.length > 0) {
        resolve(glCategories);
      } else {
        useFetchCategoryOptions(this.MSFTToken)
          .then((res: any) => {
            const newCategories = res.Options.map((item) => ({
              id: item.Value,
              name: item.Label.UserLocalizedLabel.Label,
            }));
            glsetCategories(newCategories);
            this.Categories = newCategories;
            resolve(newCategories);
          })
          .catch((err) => {
            resolve([]);
          });
      }
    });
  }

  public async CompleteCarts(cartId = null, customerPO: string): Promise<any> {
    // default is current active cart,  if id is provided use what ever record associated to the id
    const { cartInfo }: { cartInfo: ICartInfo } = this.GlobalStore;
    let params: any = {
      statecode: CART_HEADER_INACTIVE,
      statuscode: CART_HEADER_INACTIVE_REASON_COMPLETED,
    };

    let lvt_shoppingbasketid = null;

    if (cartId) {
      lvt_shoppingbasketid = cartId;
      const _cache_cart: ICart[] = this.GetItem(`CARTS_${cartId}`); //get cache data from previous query by id
      const _cartsInfo: ICartInfo = this.GetCartsInfoByVar(_cache_cart);
      params = {
        lvt_item_count: `${_cartsInfo.count}`,
        lvt_total_amount: `${_cartsInfo.total}`,
        lvt_customerpo: customerPO,
        ...params,
      };
    } else {
      lvt_shoppingbasketid = cartInfo.cartId;
      params = {
        lvt_item_count: `${cartInfo.count}`,
        lvt_total_amount: `${cartInfo.total}`,
        lvt_customerpo: customerPO,
        ...params,
      };
    }

    const result = await this.UpdateCart(params, lvt_shoppingbasketid);

    if (!cartId || (cartId && cartInfo.cartId === cartId)) {
      //if active cart == target cart , clear this after submit
      this.SaveMyCart([]);
    }

    return new Promise((resolve) => resolve(result));
  }

  public async SaveCarts(cartId = null): Promise<any> {
    // default is current active cart,  if id is provided use what ever record associated to the id
    const { cartInfo }: { cartInfo: ICartInfo } = this.GlobalStore;
    let params: any = {
      statecode: CART_HEADER_ACTIVE,
      statuscode: CART_HEADER_ACTIVE_REASON_SAVED,
    };

    let lvt_shoppingbasketid = null;

    if (cartId) {
      const _cache_cart: ICart[] = this.GetItem(`CARTS_${cartId}`); //get cache data from previous query by id
      const _cartsInfo: ICartInfo = this.GetCartsInfoByVar(_cache_cart);
      params = {
        lvt_item_count: `${_cartsInfo.count}`,
        lvt_total_amount: `${_cartsInfo.total}`,
        ...params,
      };
      lvt_shoppingbasketid = cartId;
    } else {
      lvt_shoppingbasketid = cartInfo.cartId;
      params = {
        lvt_item_count: `${cartInfo.count}`,
        lvt_total_amount: `${cartInfo.total}`,
        ...params,
      };
    }

    const result = await this.UpdateCart(params, lvt_shoppingbasketid);

    if (!cartId || (cartId && cartInfo.cartId === cartId)) {
      //if active cart == target cart , clear this after submit
      this.SaveMyCart([]);
    }

    return new Promise((resolve) => resolve(result));
  }

  private async UpdateCart(params, lvt_shoppingbasketid): Promise<any> {
    /*console.log(
      "UpdateCart2 (" + lvt_shoppingbasketid + ")",
      params,
      lvt_shoppingbasketid
    );*/
    if (lvt_shoppingbasketid) {
      return new Promise((resolve) => {
        useBasicPatch(
          this.MSFTToken,
          "/api/data/v9.2/lvt_shoppingbaskets(" + lvt_shoppingbasketid + ")",
          params
        )
          .then((result) => {
            if (result.status === 200) {
              resolve(true);
            } else {
              resolve(null);
            }
          })
          .catch((e) => {
            resolve(null);
          });
      });
    } else {
      return new Promise((resolve) => resolve(null));
    }
  }

  public async GetCartsByIdAllQuotes(): Promise<IInvoice[]> {
    return new Promise((resolve) => {
      const url =
        `/api/data/v9.2/lvt_shoppingbaskets?$select=*` +
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

  public async UpdateCartComment(comment, cartId = null): Promise<any> {
    const { cartInfo }: { cartInfo: ICartInfo } = this.GlobalStore;
    const params = { lvt_comments: comment };

    //console.log("UpdateCartComment", cartInfo, params);

    await this.UpdateCart(params, cartId ? cartId : cartInfo.cartId);

    let current_carts: ICart[] = await this.GetActiveCarts();
    if (current_carts && current_carts.length > 0) {
      current_carts[0].lvt_comments = comment; //update reference. no need to refresh here..
    }
  }

  public async getAllActiveCarts() {
    const url = `/api/data/v9.2/lvt_shoppingbaskets?$select=*&$filter=statecode%20eq%20${CART_HEADER_ACTIVE}%20and%20statuscode%20eq%20${CART_HEADER_ACTIVE_REASON_PENDING}%20and%20emailaddress%20eq%20'${this.User.mail}'`;

    return new Promise((resolve) => {
      useBasicGet(this.MSFTToken, url).then(async (result: any) => {
        if (result?.status === 200) {
          const _carts = result?.data.value;
          resolve(_carts);
        } else {
          resolve(null);
        }
      });
    });
  }

  private async EmptyTargetCart(lvt_shoppingbasketid) {
    return new Promise(async (resolve) => {
      let params = {
        statecode: CART_HEADER_INACTIVE,
        statuscode: CART_HEADER_INACTIVE_REASON_DELETED,
      };

      let cartItems: ICartItem[] = await this.GetActiveCartItems(
        lvt_shoppingbasketid
      );

      cartItems.forEach((element: ICartItem) => {
        this.DeleteCartItem(element.lvt_shoppingbasketitemid);
      });

      useBasicPatch(
        this.MSFTToken,
        "/api/data/v9.2/lvt_shoppingbaskets(" + lvt_shoppingbasketid + ")",
        params
      )
        .then((result) => {
          if (result.status === 200) {
            resolve(true);
          } else {
            resolve(null);
          }
        })
        .catch((e) => {
          resolve(null);
        });
    });
  }

  public async EmptyCarts(): Promise<any> {
    return new Promise(async (resolve) => {
      var promises = [];
      const allCarts: any = await this.getAllActiveCarts();
      if (allCarts.length > 0) {
        for (let i = 0; i < allCarts.length; i++) {
          let lvt_shoppingbasketid = allCarts[i].lvt_shoppingbasketid;
          promises.push(this.EmptyTargetCart(lvt_shoppingbasketid));
        }

        Promise.allSettled(promises).then((values) => {
          this.SaveMyCart([]);
          resolve(true);
        });
      } else {
        resolve(true);
      }
    }); //promise
  }

  public async DeleteCartHeader(lvt_cart_group_id): Promise<any> {
    let current_carts: ICart[] = await this.GetActiveCarts();

    if (current_carts && current_carts.length > 0) {
      let promises = [];
      return new Promise((resolve) => {
        const cartIndex = current_carts.findIndex(
          (item) => item.lvt_cart_group_id === lvt_cart_group_id
        );
        const targetList: ICartItem[] = current_carts[cartIndex].cartItems;

        targetList.forEach((element) => {
          promises.push(this.DeleteCartItem(element.lvt_shoppingbasketitemid));
        });

        Promise.allSettled(promises).then((values) => {
          const new_carts = current_carts.filter(
            (item) => item.lvt_cart_group_id != lvt_cart_group_id
          );
          this.SaveMyCart([...new_carts]);
          resolve(true);
        });
      });
    } else {
      return new Promise((resolve) => resolve(null));
    }
  }

  public async UpdateCartItem(lvt_shoppingbasketitemid, lvt_qty): Promise<any> {
    const params = {
      lvt_qty,
    };

    const result = await useBasicPatch(
      this.MSFTToken,
      "/api/data/v9.2/lvt_shoppingbasketitems(" +
        lvt_shoppingbasketitemid +
        ")",
      params
    );

    if (result.status === 200) {
      //get current carts
      let current_carts: ICart[] = [...(await this.GetActiveCarts())]; //dont include the ref
      let new_carts: ICart[] = [];

      if (current_carts && current_carts.length > 0) {
        for (let i = 0; i < current_carts.length; i++) {
          var item = current_carts[i];
          var indexMatched = item.cartItems.findIndex(
            (item) => item.lvt_shoppingbasketitemid === lvt_shoppingbasketitemid
          );

          if (indexMatched > -1) {
            item.cartItems[indexMatched].lvt_qty = lvt_qty;
          }
          new_carts.push(item);
        }
      }

      this.SaveMyCart(new_carts);
    }
  }

  public async DeleteCartItem(lvt_shoppingbasketitemid): Promise<any> {
    const params = {
      statecode: CART_ITEM_INACTIVE,
      statuscode: CART_ITEM_REASON_DELETED,
    };

    const result = await useBasicPatch(
      this.MSFTToken,
      "/api/data/v9.2/lvt_shoppingbasketitems(" +
        lvt_shoppingbasketitemid +
        ")",
      params
    );
    if (result.status === 200) {
      //get current carts
      let current_carts: ICart[] = [...(await this.GetActiveCarts())]; //dont include the ref
      let new_carts: ICart[] = [];

      if (current_carts && current_carts.length > 0) {
        for (let i = 0; i < current_carts.length; i++) {
          var item = current_carts[i];
          new_carts.push({
            ...item,
            cartItems: item.cartItems.filter(
              (item) =>
                item.lvt_shoppingbasketitemid !== lvt_shoppingbasketitemid
            ),
          });
        }
      }

      this.SaveMyCart(new_carts);
    }
  }

  private getFilterString(lvt_pricelistitemid = ""): string {
    const _audience_filter =
      this.Audience && this.Audience != ""
        ? `%20and%20Microsoft.Dynamics.CRM.ContainValues(PropertyName='lvt_audience',PropertyValues=%5B'${this.Audience}'%5D)`
        : "";

    let _filterString = `$filter=(lvt_Product/_lvt_productinformation_value%20ne%20null)%20and%20_lvt_owningaccount_value%20eq%20${this.accountId}${this.FILTER_DEVICES}${_audience_filter}`;

    if (lvt_pricelistitemid !== "") {
      _filterString = `$filter=(lvt_Product/_lvt_productinformation_value%20ne%20null)%20and%20_lvt_owningaccount_value%20eq%20${this.Audience}%20and%20lvt_pricelistitemid%20eq%20${lvt_pricelistitemid}`;
    }

    if (lvt_pricelistitemid !== "") {
      //if detail page, we dont need extra filter
      _filterString = `$filter=lvt_pricelistitemid%20eq%20${lvt_pricelistitemid}`;
    } else {
      //accessories do not need a audience filter to retrieve other fields
      if (this.ProductType === ACCESSORIES) {
        _filterString = `$filter=${this.FILTER_ACCESSORIES}`;
      }
    }
    return _filterString;
  }

  private getCategoryLabel(entry): any {
    try {
      const matched = this.Categories.filter(
        (c) => `${c.id}` === `${entry.lvt_Product.lvt_productcategory}`
      )[0];
      const categories_label = matched?.name || "";
      return categories_label;
    } catch (e) {
      return "";
    }
  }

  private GetProductFromCache(lvt_pricelistitemid) {
    const entries: any[] = Object.entries(this.cache);

    for (let i = 0; i < entries.length; i++) {
      let list = entries[i][1];

      for (let j = 0; j < list.length; j++) {
        let _prod: IProductEntity = list[j];

        if (`${_prod?.lvt_pricelistitemid}` === `${lvt_pricelistitemid}`) {
          return _prod;
        }
      }
    }
    return null;
  }

  public async GetProduct(lvt_pricelistitemid = ""): Promise<IProductEntity> {
    const _field = `PRODUCT_${lvt_pricelistitemid}`;
    let product = this.GetItem(_field);

    if (!product) {
      product = this.GetProductFromCache(lvt_pricelistitemid); //try prod from cache list
    }

    if (product) {
      return new Promise((resolve) => resolve(product));
    } else {
      return new Promise((resolve) => {
        this.GetProducts(1, lvt_pricelistitemid).then((result) => {
          const _prod: IProductEntity =
            result && result.length > 0 ? result[0] : null;
          this.SetItem(_field, _prod);
          resolve(_prod);
        });
      });
    }
  }

  public async getQuoteFile(lvt_shoppingbasketid: string): Promise<any> {
    return new Promise((resolve) => {
      const url =
        `/api/data/v9.2/lvt_shoppingbaskets?$select=lvt_quotepdf` +
        `&$filter=lvt_shoppingbasketid%20eq%20'${lvt_shoppingbasketid}'`;

      useBasicGet(this.MSFTToken, url).then(async (result: any) => {
        if (result?.status === 200 || result?.status === 201) {
          console.log("File: ", result);
          const file = new File([result?.data.value[0]], "Video Thumbnail");
          resolve({ file: URL.createObjectURL(file) });
        } else {
          resolve(null);
        }
      });
    });
  }

  public async GetProducts(
    page,
    lvt_pricelistitemid = ""
  ): Promise<IProductEntity[]> {
    const _field = `PRODUCTS_${page}_${lvt_pricelistitemid}_${this.ProductType}_${this.Audience}`;
    const products = this.GetItem(_field);

    if (products) {
      return new Promise((resolve) => resolve(products));
    } else {
      const _filterString = this.getFilterString(lvt_pricelistitemid);
      const _paginationString =
        "&$skiptoken=<cookie pagenumber='" + page + "' />";
      this.GetAllGetCategoriesProducts();

      let query =
        "$select=*&" +
        "$expand=lvt_Product($select=lvt_productimage,*;$expand=lvt_ProductInformation($select=*))&" +
        _filterString +
        _paginationString;

      return new Promise((resolve, error) => {
        try {
          useBasicFetchPaginated(
            this.MSFTToken,
            "/api/data/v9.1/lvt_pricelistitems",
            this.itemsPerPage,
            query
          )
            .then((res: any) => {
              if (res.value && res.value.length > 0) {
                const finallist = res.value.map((item) => {
                  const category_caption = this.getCategoryLabel(item);
                  const _prod: IProductEntity = {
                    ...item.lvt_Product,
                    category_caption,
                    lvt_pricelistitemid: item.lvt_pricelistitemid,
                    price: item.lvt_unitpriceexgst, ///using excluded now. item.lvt_priceincludegst,
                    tax: item.lvt_taxvalue,
                    lvt_unitpriceexgst: item.lvt_unitpriceexgst,
                  };
                  return _prod;
                });

                const final_list = this.UniquefiedProducts(finallist);
                this.SetItem(_field, final_list);
                resolve(final_list);
              } else {
                resolve([]);
              }
            })
            .catch((err) => {
              console.log(err);
              resolve([]);
            });
        } catch (err) {
          console.log(err);
          resolve([]);
        }
      });
    }
  }
}
