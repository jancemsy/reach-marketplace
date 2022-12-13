import React from "react";
import Print from "./Print";

class PdfComponent extends React.Component<any, any> {
  render() {
    return (
      <Print cartId={this.props.cartId} totalGST={this.props.totalGST} />
    );
  }
}

export default PdfComponent;