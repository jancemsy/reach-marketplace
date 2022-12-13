import React, {useEffect, useState, useContext} from 'react';
import AppContext from '../../AppContext';

const deviceNav = () => {

    const GlobalStore : any = useContext(AppContext);
    const {Navigate, deviceNav, setDeviceNav} = GlobalStore;

  return (
    <section className="msft-header">
        <div className="row">
            <div className="column-12">
                <div className="items-header">
                    <h1>Surface for Education</h1>
                    <p>No matter what you do, there’s a Surface to help you do it</p>
                    <div className="items-btn">
                        <button className="btn-default active" onClick={() => Navigate(`/products`)}>Devices</button>
                        <button className="btn-default" onClick={() => Navigate(`/product/accessories`)}>All Accessories</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default deviceNav;