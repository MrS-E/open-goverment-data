import Map from "./Map";
import React, {useEffect, useState} from "react";
import {Circle, LayerGroup, Rectangle, Marker} from "react-leaflet";
import L from "leaflet/dist/leaflet-src";

//Aktuell sind die Filter und deren Handler sowie die Anzeigeelemente hardcoded, dies ist der Fall da es sich hierbei noch um einen "Proof of Concept" handelt und nicht komplet fertig codiert wurde

const customIcon = L.icon({ //fix for auto import not working
    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=",
    shadowUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const convertConst: number[] = [111.3, 71.5] //zahlen zur kilometer calculation von https://www.kompf.de/gps/distcalc.html
const ThurgauRecht: number[][] = [[47.695448,8.667914],[47.375965,9.477593]]
const ThurgauGenauRecht: number[][][] = [
    [[47.695448,8.667914],[47.624328,8.812032]],
    [[47.624328,8.812032],[47.570625,8.739266]],
    [[47.675484,8.812032],[47.523971,8.898110]],
    [[47.523971,8.881096],[47.375965,9.011804]],
    [[47.471154,9.011804],[47.433372,9.062632]],
    [[47.675484,9.211809],[47.478841,9.011804]],
    [[47.523971,8.898110],[47.675484,9.011908]],
    [[47.474308,9.211809],[47.645184,9.322516]],
    [[47.597449,9.322516],[47.484900,9.384318]],
    [[47.550590,9.384318],[47.474994,9.440268]],
    [[47.501467,9.449417],[47.484191,9.477593]]
]

export default function Home(): JSX.Element {
    const [polizei, changePolizei] = React.useState<{ key: string, coordinates: number[] }[]>(null)
    const [polizeiState, changePolizeiState] = React.useState<{
        show: boolean,
        color: string,
        radius: number
    }>({show: true, color: "#fcba03", radius: 2000})
    const [rerender, doRerender] = React.useState<number>(0)
    const [loading, triggerLoading] = React.useState<boolean>(false)
    const [points, changePoints] = React.useState<number[]>(null)

    const handlePolizeiChange = (e): void => {
        const name = e.target.name
        const obj = polizeiState

        if (name !== "show") {
            obj[name] = e.target.value;
        } else {
            obj[name] = e.target.checked;
        }
        doRerender(rerender + 1)
        changePolizeiState(obj)
    }
    const handleCalc = async (e) :Promise<void> =>{
        console.log("HEY")
        await triggerLoading(true)
        console.log(loading)
        document.getElementById("map").classList.add("hidden");
        console.log(loading)
        await changePoints(calculate([{cords: polizei.map(e=>e.coordinates), dist: polizeiState.radius, type:"polizei"}]))
        console.log(loading)
        document.getElementById("map").classList.remove("hidden");
        console.log(loading)
        await triggerLoading(false)
        console.log(loading)
        doRerender(rerender+1)
    }

    useEffect((): void => {
        fetch('/api/polizeiposten')
            .then(response => response.json())
            .then(res => changePolizei(res))
    }, [])
    return (
        <>
            <h1 className="text-4xl mb-2 text-center mt-0 font-medium leading-tight text-primary">Suche für den Idealen
                Wohnort</h1>
            <p className="text-center break-words p-2">Diese Seite ist keine fertig entwickeltes Feature, dies ist nur
                eine "Proof of
                Concept" Seite. Dies hat zur Folge das nur zei Datensätze mit einbezogen werden und das UI nicht fertig
                ausgestaltet wurde.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 place-items-center">
                <div className="p-2">
                    <div id="map">
                        <Map key={rerender}>
                            {/*<LayerGroup>
                                <Rectangle bounds={ThurgauGenauRecht[0]}/>
                                <Rectangle bounds={ThurgauGenauRecht[1]}/>
                                <Rectangle bounds={ThurgauGenauRecht[2]}/>
                                <Rectangle bounds={ThurgauGenauRecht[3]}/>
                                <Rectangle bounds={ThurgauGenauRecht[4]}/>
                                <Rectangle bounds={ThurgauGenauRecht[5]}/>
                                <Rectangle bounds={ThurgauGenauRecht[6]}/>
                                <Rectangle bounds={ThurgauGenauRecht[7]}/>
                                <Rectangle bounds={ThurgauGenauRecht[8]}/>
                                <Rectangle bounds={ThurgauGenauRecht[9]}/>
                                <Rectangle bounds={ThurgauGenauRecht[10]}/>

                                <Rectangle pathOptions={{color:"black"}} bounds={ThurgauRecht}/>
                            </LayerGroup>*/}
                            <LayerGroup>
                                {/*@ts-ignore*/}
                                {polizei && polizeiState.show ? polizei.map((e, key) => <div key={key}><Circle pathOptions={{color: polizeiState.color}} radius={polizeiState.radius} center={e.coordinates}><Circle pathOptions={{color: "red"}} radius={0} center={e.coordinates}/></Circle></div>) : <></>}
                            </LayerGroup>
                            <LayerGroup>
                                {/* @ts-ignore*/}
                                {points? <Marker position={points} icon={customIcon}></Marker>:""}
                            </LayerGroup>
                        </Map>
                    </div>
                </div>
                <div>
                    <div className="block">
                        <div className="flex">
                            <label>Polizeistationen (Inkludiert):</label>
                        </div>
                        <div className="block ml-[3rem]">
                            <span>Filter:</span>
                            <div className="grid grid-cols-2">
                                <label className="text-base">Anzeigen:</label>
                                <input className="max-h-[1rem] m-2 w-full" name="show" type="checkbox"
                                       defaultValue={polizeiState.color} onChange={handlePolizeiChange}
                                       checked={polizeiState.show}/>
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
                        <button className="border bg-green-600 rounded-xl p-2 pt-1.5 mt-4" onClick={handleCalc}>Berechnen</button>
                    </div>
                </div>
            </div>
            {console.log("Before:", loading)}
            {loading && <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-transparentBlack flex justify-center items-center">
                <div className="relative overflow-hidden bg-white p-[3vmax] w-max-[75vw]">
                    {/*spinner frame from: https://tailwind-elements.com/docs/standard/components/spinners/*/}
                    <svg className="w-[50vmin] h-[50vmin] animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.75V6.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round"></path>
                        <path d="M17.1266 6.87347L16.0659 7.93413" stroke="currentColor" stroke-width="1.5"
                              stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M19.25 12L17.75 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round"></path>
                        <path d="M17.1266 17.1265L16.0659 16.0659" stroke="currentColor" stroke-width="1.5"
                              stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M12 17.75V19.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round"></path>
                        <path d="M7.9342 16.0659L6.87354 17.1265" stroke="currentColor" stroke-width="1.5"
                              stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M6.25 12L4.75 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                              stroke-linejoin="round"></path>
                        <path d="M7.9342 7.93413L6.87354 6.87347" stroke="currentColor" stroke-width="1.5"
                              stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
            </div>}
        </>
    )
}

function calculate(needed: {cords: number[][], dist:number, type:string}[]):number[]{ //dist in m
    const stepX:number = (ThurgauRecht[0][0]>ThurgauRecht[1][0]?ThurgauRecht[0][0]-ThurgauRecht[1][0]:ThurgauRecht[1][0]-ThurgauRecht[0][0])/1000
    const stepY:number = (ThurgauRecht[0][1]>ThurgauRecht[1][1]?ThurgauRecht[0][1]-ThurgauRecht[1][1]:ThurgauRecht[1][1]-ThurgauRecht[0][1])/1000
    const checkPoint: number[][] = []
    const checkPoint2: {point:any[], test:object[]}[] = []
    let pointsToLive:number[] = []
    //generate checkPoints
    for(let d of ThurgauGenauRecht){
        let countX = 0
        if(d[0][0]<d[1][0]) {
            while ((d[0][0] + (countX * stepX)) < d[1][0]) {
                let countY = 0
                let x1: number = d[0][0] + countX * stepX
                let x2: number = d[0][0] + (countX + 1) * stepX
                if((d[0][1] < d[1][1])) {
                    while ((d[0][1] + (countY*stepY)) < d[1][1]) {
                        let y1: number = d[0][1] + countX * stepX
                        let y2: number = d[0][1] + (countX + 1) * stepX
                        countY++
                        checkPoint.push([(x1 + x2) / 2, (y1 + y2) / 2])
                    }
                }else{
                    while (d[0][1] > (d[1][1]+ (countY*stepY))) {
                        let y1: number = d[1][1] + countX * stepX
                        let y2: number = d[1][1] + (countX + 1) * stepX
                        countY++
                        checkPoint.push([(x1 + x2) / 2, (y1 + y2) / 2])
                    }
                }
                countX++
            }
        }else{
            while (d[0][0] > (d[1][0] + (countX * stepX))) {
                let countY = 0
                let x1: number = d[1][0] + countX * stepX
                let x2: number = d[1][0] + (countX + 1) * stepX
                if((d[0][1] < d[1][1])) {
                    while ((d[0][1] + (countY*stepY)) < d[1][1]) {
                        let y1: number = d[0][1] + countX * stepX
                        let y2: number = d[0][1] + (countX + 1) * stepX
                        countY++
                        checkPoint.push([(x1 + x2) / 2, (y1 + y2) / 2])
                    }
                }else{
                    while (d[0][1] > d[1][1] + ((countY*stepY))) {
                        let y1: number = d[1][1] + countX * stepX
                        let y2: number = d[1][1] + (countX + 1) * stepX
                        countY++
                        checkPoint.push([(x1 + x2) / 2, (y1 + y2) / 2])
                    }
                }
                countX++
            }
        }
    }
    //check Points
    for(let point of checkPoint){
        const test : {forfilled:boolean, dist:number, type:string}[] = []
        for(let n of needed){
            let min:number = null
            for(let c of n.cords) {
                const dx: number = 111.3 * (point[0] - c[0])
                const dy: number = 71.5 * (point[1] - c[1])
                let km: number = Math.sqrt(dx * dx + dy * dy)
                if (km < 0) km = km * (-1)
                if(min==null) min = km
                if(km<min){
                    min=km
                }
            }
            if(min<=n.dist){
                test.push({forfilled:true, dist:min, type:n.type})
            }else{
                test.push({forfilled:false, dist:min, type:n.type})
            }
        }
        if(test.every(e=>e.forfilled===true)) checkPoint2.push({point: point, test:test})
    }
    let min:number
    for(let p of checkPoint2){
        // @ts-ignore
        let pmin = p.test.reduce((sum,obj)=>sum +obj.dist,0)/p.test.length
        if(!min) min = pmin
        if(pmin<min) {
            min = pmin
            pointsToLive = p.point
        }
    }
    return pointsToLive
}
