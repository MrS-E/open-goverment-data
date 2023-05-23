import 'leaflet/dist/leaflet.css'
import {MapContainer, TileLayer} from "react-leaflet";
import styled from "styled-components";

export const Card = styled.div`
  width: 100%;
  height: 40rem;
`;

function Map(props): JSX.Element {
    return (
        <Card>
            {/* @ts-ignore*/}
            <MapContainer center={[47.564, 9.057]} zoom={11} scrollWheelZoom={true}>
                <TileLayer
                    //attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {props.children}
            </MapContainer>
        </Card>
    )
}
//https://enterprise.arcgis.com/de/server/latest/publish-services/windows/communicating-with-a-wms-service-in-a-web-browser.htm
export default Map;