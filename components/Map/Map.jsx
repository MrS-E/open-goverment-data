import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import {MapContainer, TileLayer} from "react-leaflet";

/*
* CircleMarker:
*   radius: pixel
* Circle
*   radius: meter
*
* */


function Map(props) {
    return (
            <MapContainer key={props.key} className="w-[80vw] h-[80vh] md:w-[40vw]" center={[47.564, 9.057]} zoom={10} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {/*<Marker
                    position={[47.51408322604471,9.434792635738198]} icon={customIcon}/>*/}
                {props.children}
            </MapContainer>
    )
}
//https://enterprise.arcgis.com/de/server/latest/publish-services/windows/communicating-with-a-wms-service-in-a-web-browser.htm
export default Map;