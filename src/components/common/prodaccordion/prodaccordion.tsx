import React, {useContext} from 'react';
import { Icon } from "office-ui-fabric-react";
import './prodaccordion.css';

const ProductAccordion = () => {
    return ( <div className="content-container">
    <div className="items expanded"><i className="arrow down"></i>
          <div className="heading">
            Dimensions</div>
          <div className="sub-items">
                292 mm x 201 mm x 8.5 mm (11.5"x7.9" x 0.33")
          </div>
      </div>

      <div className="items expanded"><i className="arrow down"></i>
        <div className="heading">
          Colur and Material</div>
        <div className="sub-items">
            8g(0.02 lb) without battery
        </div>
    </div>

   <div className="items"><i className="arrow down"></i>
    <div className="heading">
      Pressure and Sensivity</div>
      <div className="sub-items">
          -
      </div>
   </div>

  <div className="items"><i className="arrow down"></i>
    <div className="heading">

      Pen Tip</div>
     <div className="sub-items">
         -
     </div>
    </div>

    <div className="items">
      <i className="arrow down"></i>
      <div className="heading">
        Buttons</div>
       <div className="sub-items">
           -
       </div>
      </div>

      <div className="items"> <i className="arrow down"></i>
        <div className="heading">
          Compatibility</div>
         <div className="sub-items">
             -
         </div>
        </div>

        <div className="items"><i className="arrow down"></i>
          <div className="heading">
            Protocol</div>
           <div className="sub-items">
               -
           </div>
        </div>



  </div>
  );


    }

export default ProductAccordion;