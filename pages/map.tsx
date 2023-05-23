import Head from 'next/head'
import Map from "../components/Map/";
import Age from "../assets/datasets/sk-stat-57.json"


export default function Home(props) : JSX.Element {
    let age : any = props.age;
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

export async function getStaticProps ()  {

    return{
        props:{age: Age},
    }
}