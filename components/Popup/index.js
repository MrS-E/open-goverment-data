import React from 'react';
import styles from '@/styles/Popup.module.css'
import CloseBtn from "@/components/CloseBtn";

function Popup(props) { //simple popup
    if(props.trigger){ //only shows popup if trigger is true
        return(
            <div className={styles.popup}>
                <div className={styles.popup_inner}>
                    <div>
                        <CloseBtn onClick={() => {props.changeTrigger(false)}}/>
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