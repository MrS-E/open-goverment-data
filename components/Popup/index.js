import React from 'react';
import styles from '@/styles/Popup.module.css'

function Popup(props) { //simple popup
    if(props.trigger){ //only shows popup if trigger is true
        return(
            <div className={styles.popup}>
                <div className={styles.popup_inner}>
                    <div>
                        <button type="button"
                                onClick={() => {props.changeTrigger(false)}}
                                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Close menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
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