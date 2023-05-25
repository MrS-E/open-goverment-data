import dynamic from "next/dynamic";

const Map: any = dynamic(()=> import('./MapParent'), {ssr:false})

export default Map