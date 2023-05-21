import React from 'react';
import "./main.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

function Popup(props) { //simple popup
    if(props.trigger){ //only shows popup if trigger is true
        return(
            <div className="popup">
                <div className="popup-inner">
                    <div>
                        <button className="close-btn" onClick={() => {props.changeTrigger(false)}}>close</button> {/*to close popup*/}
                    </div>
                    <div className="container">
                        {props.children} {/*shows all children -> can be used everywhere*/}
                    </div>
                </div>
            </div>
        );
    }else{
        return "";
    }
}

export default Popup;