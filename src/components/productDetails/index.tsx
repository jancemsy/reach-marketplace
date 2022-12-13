import React, {useContext,useState,useEffect} from 'react';
import AppContext from '../../AppContext';
import { getURLParam } from '../../helpers/common';
import  ProductDetails from './productDetails';
import {
  useLocation
} from "react-router-dom";
import Loading from '../common/Loading';
import styled from 'styled-components';
import ProductTopNavComponent from '../common/ProductTopNav';

const ProductDetailComponent = () => {
  const [itemId, setItemId] = useState<string>('');
  const [section, setSection] = useState<string>('overview');
  const GlobalStore : any = useContext(AppContext);
	const {Navigate,setStep,  MSFTToken, ReachToken, User, step,PluginRoute} = GlobalStore;
  let location = useLocation();


  const clickBack = () =>{
    Navigate(`/products`);
   }


  useEffect(() => {
    const _section : string = getURLParam("section") || 'overview' ;
    const _itemId : string = getURLParam("itemId") ||  null ;
    setSection(_section);
    setItemId(_itemId);
    setStep(2);
  },[location]);


if(itemId === ''){
  return <Loading />
}

return <div>
     <div className='mobile-top-nav' style={{display:'none'}}><ProductTopNavComponent /></div>
    <BackLink className='back-link-desktop'  onClick={()=>clickBack()}>Back to product list</BackLink>
    <ProductDetails id={itemId} />
  </div>
}

export default ProductDetailComponent;

const BackLink = styled.div`
  color:#3376CD;
  margin-bottom:35px;
  padding-left:50px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  text-decoration: underline;
 `;