export {}
declare global {
    interface Gemeinde{
        nr_gemeinde: string
        gemeinde_name: string
    }
    interface Allgemein extends Gemeinde{
        jahr: string
        einwohner: number
        color: string
        total: number
    }
    interface Trager{
        biogasanlagen_abwasser: number
        biogasanlagen_industrie:number
        biogasanlagen_landwirtschaft: number
        biomasse_holz: number
        kehricht: number
        photovoltaik:number
        wasserkraft:number
        wind:number
    }

    interface Stromproduzenten extends Allgemein, Trager{}
}
