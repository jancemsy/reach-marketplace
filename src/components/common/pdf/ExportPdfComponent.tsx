import React from 'react';
import ReactToPrint from 'react-to-print';
import TableComponent from './Pdf';
 
class ExportPdfComponent extends React.Component<any, any> {
    private childNavRef: any;
    public constructor() {
        super({});
        this.state = {
            show: true,
        };

        // Note that you no longer have to instantiate childNavRef here anymore, 
        // as TypeScript will do that automatically (it will actually compile to something
        // like in the first example, where ref is set after the super call in the constructor).
    }

    render() {
        return (
            <div>

            <h1>Export HTMl Table in PDF File</h1> 

            <TableComponent ref={(response) => (this.childNavRef = response)} />
            
            <ReactToPrint
                content={() => this.childNavRef}
                trigger={() => <button className="btn btn-primary">Print to PDF!</button>}
            />
            </div>
        );
    }
}
 
export default ExportPdfComponent;