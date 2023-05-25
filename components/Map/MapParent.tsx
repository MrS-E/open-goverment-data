import Map from "./Map";
import React, {useEffect, useState} from "react";
import {Circle, LayerGroup} from "react-leaflet";

//Aktuell sind die Filter und deren Handler sowie die Anzeigeelemente hardcoded, dies ist der Fall da es sich hierbei noch um einen "Proof of Concept" handelt und nicht komplet fertig codiert wurde

export default function Home(): JSX.Element {
    const [polizei, changePolizei] = React.useState<{key:string, coordinates: number[]}[]>(null)
    const [polizeiState, changePolizeiState] = React.useState<{
        show: boolean,
        color: string,
        radius: number
    }>({show: true, color: "#fcba03", radius: 2000})
    const [rerender, doRerender] = React.useState<number>(0)

    const handlePolizeiChange = (e): void => {
        const name = e.target.name
        const obj = polizeiState

        if(name!=="show") {
            obj[name] = e.target.value;
        }else{
            obj[name] = e.target.checked;
        }
        doRerender(rerender+1)
        changePolizeiState(obj)
    }

    useEffect((): void => {
        fetch('/api/polizeiposten')
            .then(response => response.json())
            .then(res => changePolizei(res))
    }, [])
    console.log(polizei)
    return (
        <>
            <h1 className="text-4xl mb-2 text-center mt-0 font-medium leading-tight text-primary">Suche für den Idealen
                Wohnort</h1>
            <p className="text-center break-words p-2">Diese Seite ist keine fertig entwickeltes Feature, dies ist nur eine "Proof of
                Concept" Seite. Dies hat zur Folge das nur zei Datensätze mit einbezogen werden und das UI nicht fertig ausgestaltet wurde.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 place-items-center">
                <div className="p-2">
                    <Map key={rerender}>
                        <LayerGroup>
                            {    /* @ts-ignore*/}
                            {polizei&&polizeiState.show?polizei.map(e=><Circle pathOptions={{color:polizeiState.color}} radius={polizeiState.radius} center={e.coordinates}><Circle pathOptions={{color:"red"}} radius={0} center={e.coordinates}/></Circle>):<></>}
                        </LayerGroup>
                    </Map>
                </div>
                <div>
                    <div className="block">
                        <div className="flex">
                            {/*<input className="mr-2" type="checkbox" name="show" checked={polizeiState.show} onChange={handlePolizeiChange}/>*/}
                            <label>Polizeistationen (Inkludiert):</label>
                        </div>
                        <div className="block ml-[3rem]">
                            <span>Filter:</span>
                            <div className="grid grid-cols-2">
                                <label className="text-base">Anzeigen:</label>
                                <input className="max-h-[1rem] m-2 w-full" name="show" type="checkbox"
                                       defaultValue={polizeiState.color} onChange={handlePolizeiChange} checked={polizeiState.show}/>
                            </div>
                            <div className="grid grid-cols-2">
                                <label className="text-base">Farbe:</label>
                                <input className="max-h-[1rem] m-2 w-full" name="color" type="color"
                                       defaultValue={polizeiState.color} onChange={handlePolizeiChange}/>
                            </div>
                            <div className="grid grid-cols-2">
                                <label className="text-base">Umkreis [m]:</label>
                                <input className="border max-h-[1rem] m-2 w-full" step="1000" name="radius"
                                       defaultValue={polizeiState.radius} type="number" onChange={handlePolizeiChange}/>
                            </div>
                        </div>
                        <button className="border bg-green-600 rounded-xl p-2 pt-1.5 mt-4">Berechnen</button>
                    </div>
                </div>
            </div>
        </>
    )
}