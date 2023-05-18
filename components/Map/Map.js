import 'leaflet/dist/leaflet.css'
import {MapContainer, TileLayer, SVGOverlay, Marker, Popup} from "react-leaflet";
import styles from '@/styles/Map.module.css'

function Map() {
    return (
        <MapContainer className={styles.map} center={[47.564, 9.057]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={[47.564, 9.057267]}/>
        </MapContainer>
    )
}
//https://enterprise.arcgis.com/de/server/latest/publish-services/windows/communicating-with-a-wms-service-in-a-web-browser.htm
export default Map;