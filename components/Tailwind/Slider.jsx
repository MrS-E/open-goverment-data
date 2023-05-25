import React from 'react';
const Slider = (props) => {
    return (<>
            <label htmlFor={props.id ? props.id : "slider"} className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">{props.text?props.text:""}</label>
            <input list={(props.id ? props.id : "slider")+"_list"} onChange={props.onChange?props.onChange:""} type="range" id={props.id ? props.id : "slider"} className="rounded-lg border-transparent bg-neutral-200 cursor-pointer shadow-none w-full transparent" min={props.min ? props.min : 0} max={props.max ? props.max : 10} defaultValue={props.value ? props.value : 5} step={props.step ? props.step : 1}/>
            <datalist id={(props.id ? props.id : "slider")+"_list"}>
                {props.max&&props.min?Array.from({ length: (props.max+1 - props.min)}, (value, index) => props.min + index).map((e, key)=><option key={key+"_"+(props.id ? props.id : "slider")+"_list"}>{e}</option>):""}
            </datalist>
        </>);
};

export default Slider;
//    h-1.5