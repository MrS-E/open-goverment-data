import dynamic from "next/dynamic";

const Map: any = dynamic(()=> import('./Map'), {ssr:false})

export default Map