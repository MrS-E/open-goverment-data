import Head from 'next/head'
import {fetch} from "next/dist/compiled/@edge-runtime/primitives/fetch";
import Map from '@/components/ThurgauMap'
import {useEffect, useState} from "react";
import styled from "styled-components";

export const Tooltip = styled.p`
  position: absolute;
  padding: 10px;
  background: blueviolet;
  color: hotpink;
  border-radius: 8px;
  pointer-events: none;
`;

export default function Home(props) {
    const [energy, changeEnergy] = useState(props.energy)
    useEffect(()=>{
        for(let doc of document.querySelectorAll('path')){
            let result = energy.filter(obj => {
                return (obj.bfs_nr_gemeinde == doc.id && obj.jahr==2020);
            }).sort((a,b) => (a.jahr > b.jahr) ? -1 : ((b.jahr > a.jahr) ? 1 : 0))[0]
            console.log(result)
            changeEnergy(oldArray => [...oldArray, result])
            doc.addEventListener('click', (e)=>{
                let d = document.querySelector('p')
                d.removeAttribute("style")
                d.style.top = `${e.pageY}px`;
                d.style.left = `${e.pageX}px`;
            })
        }
        },[]
    )
    return (
        <>
            <Head>
                <title>Open Government Data</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <main>
                <Map/>
                <Tooltip style={"display:none"}>sadf</Tooltip>
            </main>
        </>
    )
}

export async function getStaticProps({params}) {
    const req = await fetch((await (await fetch('https://ckan.opendata.swiss/api/3/action/package_show?id=erneuerbare-elektrizitatsproduktion-nach-energietragern-und-gemeinden')).json()).result.resources[0].uri);
    const data = await req.json();

    return {
        props: {energy: data},
    }
}