import React, { useEffect,useState } from "react";
import axios from"axios";
import { Card } from "react-bootstrap"
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [latLng,setLatLng] = useState({})
    const [hospitals,setHospitals] = useState([])
    const navigate = useNavigate()

    useEffect(() =>{
        if("geolocation" in navigator ){
            navigator.geolocation.getCurrentPosition((position) => {
                setLatLng({
                    lat:position.coords.latitude,
                    lng:position.coords.longitude
                })
            })
        }
    },[])
    useEffect(()=>{
        // console.log(latLng)
        if(Object.keys(latLng).length >0){
            const geoApi = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${latLng.lng},${latLng.lat},10000&bias=proximity:78.44202,17.3707564&limit=20&apiKey=df033ee0c75d43b1ac6c7e3c8179096a`;
             axios.get(geoApi).then(resp => {
                // console.log(resp.data)
                const featuresArr = resp.data.features
                const  properties = []
                featuresArr.map((feature) => properties.push(feature.properties))
                // console.log(properties)
                setHospitals(properties)
             })
        }
    },[latLng])
    const handleClick = (placeId,hospitalsData) =>{
        navigate('/address/ ' + placeId ,{state:hospitalsData})
    }
    return(
        <div style={{display:"flex",flexWrap:"wrap"}}>
            {hospitals.map((value,index) =>{
                    const name = Array.isArray(value.name) ? value.name.spilt(' ') [0]: value.name;
                return(
                    <div key={index} style={{}} >
                        <Card 
                        onClick={() =>handleClick(value.place_id,value)}
                        style={{ width: '45rem',padding:"2rem",margin:"1.5rem",backgroundColor:"#c5fbfc"}}>
                              <Card.Title style={{borderBottom:"2px solid gray",paddingBottom:"15px",fontSize:"1.8rem"}}>{value.name}</Card.Title>
                              <Card.Text>{value.address_line2}</Card.Text>
                              <Card.Text>{value.city}{value.state}-{`${name}@gmail.com`}</Card.Text>
                              <Card.Text>www.{value.address_line1}.com</Card.Text>
                        </Card>

                    </div>
                )
            })}
        </div>
    )
}