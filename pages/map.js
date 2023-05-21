import Head from 'next/head'
import Map from "@/components/Map/";
import {fetch} from "next/dist/compiled/@edge-runtime/primitives/fetch";

export default function Home({age}) {
    console.log(age)
    return (
        <>
            <Head>
                <title>Place Finder</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <Map/>
            </main>
        </>
    )
}

export async function getStaticProps({params}){
    const req = await fetch('http://localhost:3000/api/age')
    const data = await req.json();

    return{
        props:{age: data},
    }
}