import React from 'react';
import styles from '../../styles/Popup.module.css'
import CloseBtn from "../Tailwind/CloseBtn";
import {boolean} from "zod";

function Popup(props): JSX.Element { //simple popup
    if(props.trigger){ //only shows popup if trigger is true
        return(
            <div id="bg" className={styles.popup} onClick={(e:React.MouseEvent)=>{
                // @ts-ignore
                if(e.target.id === "bg") props.changeTrigger(false)}}>
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
        return <></>;
    }
}

export default Popup;