import React, {useContext, useEffect} from 'react';
import { Icon } from "office-ui-fabric-react";
import AppContext from '../../AppContext';
import './sidebar.css';

const Sidebar = () => {

    const GlobalStore : any = useContext(AppContext);
	const {MSFTToken, ReachToken, User, step} = GlobalStore;

    return (
        <div className='custom-sidebar'>
        <h1>Navigation here??</h1>
        <h1>Navigation here??</h1>
        <h1>Navigation here??</h1>
        <h1>Navigation here??</h1>
        <h1>Navigation here??</h1>
        <h1>Navigation here??</h1>
        </div>
    )

    }

export default Sidebar;
