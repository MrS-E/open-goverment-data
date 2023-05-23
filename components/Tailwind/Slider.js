import React from 'react';
const Slider = (props) => {
    return (<>
            <label htmlFor={props.id ? props.id : "slider"} className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">{props.text?props.text:""}</label>
            <input onChange={props.onChange?props.onChange:""} type="range" id={props.id ? props.id : "slider"} className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200" min={props.min ? props.min : 0} max={props.max ? props.max : 10} defaultValue={props.value ? props.value : 5} step={props.step ? props.step : 1}
            />
        </>);
};

export default Slider;