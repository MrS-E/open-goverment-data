import React from 'react';
import styles from '@/styles/Popup.module.css'

function Popup(props) { //simple popup
    if(props.trigger){ //only shows popup if trigger is true
        return(
            <div className={styles.popup}>
                <div className={styles.popup_inner}>
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