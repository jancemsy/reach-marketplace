import React, {useContext, useEffect,useState} from 'react';
import styled from 'styled-components';
import AppContext from '../../AppContext';

const ProductTopNavComponent = () => {
  const GlobalStore : any = useContext(AppContext);
	const {ProductType, Navigate} = GlobalStore;

  if(!ProductType)return null;

    return (
      <TopNavCompoment className='product-top-nav'>
            <div className="accessories-sub-heading">
                <div className="title" >
                  <h1>Select the right product for you</h1>

                {//type === 1 ? <>Surface for Education</> :
                 //<>Accessories for Education</>
                 }
                </div>
                <div className="description" >
                  <span>No matter what you do, there's a Microsoft product to help you do it</span>
                {
                //type === 1 ? <> No matter what you do, there's a Surface to help you do it</> :
                 //<>No matter what you do, there’s a Surface to help you do it</>
                 }

                </div>
            </div>

            <div className="accessories-sub-filter">

               <div className={ProductType === 1 ? "item active" : "item"}   onClick={() => Navigate(`/products?type=1`)}>
                  Devices
               </div>
                <div className={ProductType === 2 ? "item active" : "item"}    onClick={() => Navigate(`/products?type=2`)}>
                  All Accessories
                </div>
            </div>

  </TopNavCompoment>

 );


}

export default ProductTopNavComponent;

const TopNavCompoment = styled.div`
.accessories-sub-heading{ text-align:center;
  margin-top:20px;
  margin-bottom:15px;}
.accessories-sub-heading .title{
  font-size:20px;
  margin-bottom: 5px;
}
.accessories-sub-heading .description{
  font-size:16px;
  margin: 0;
  margin-bottom: 25px;
}
.accessories-sub-filter{ align-items: center;
  justify-content: center; display:flex;  }
.accessories-sub-filter div{
  padding:14px 10px 18px;
  width:140px;
  text-align:center;
  font-size: 16px;
  font-weight: 300;
}
.accessories-sub-filter .item{ cursor:pointer!important;  background:#7070700d; }
.accessories-sub-filter .item.active{ background:#3376CD; color:#fff;}

.accessories-sub-categories{
    margin-bottom:10px;
    margin-top: 10px;
    display:flex; align-items: center;
  justify-content: center;
}
.accessories-sub-categories .item{
  cursor:pointer!important;
  margin:10px;
  text-decoration:underline;
  font-weight: 300;
  color: #3376cd;
}
.accessories-sub-categories .item.active{ color:#3376CD; }

`;