import React, { useEffect ,useState} from "react";
import { useLocation } from "react-router-dom";
import {Row,Col} from "react-bootstrap"
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import axios from "axios";

export default function Address (){
    const location = useLocation()
    const hospital = location.state;
    const[userLatLng,setUserLatLng] = useState({})
    const [userAddress, setUserAddress] = useState([]);
    const [instructionsInWords, setInstructionsInWords] = useState([]);


    useEffect(() =>{
      if("geolocation" in navigator ){
          navigator.geolocation.getCurrentPosition((position) => {
              setUserLatLng({
                  lat:position.coords.latitude,
                  lng:position.coords.longitude
              })
          })
      }
  },[])

  // console.log(userLatLng)
  useEffect(() => {
    if (userLatLng.lat && userLatLng.lng) {
        const userAddressUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${userLatLng.lat}&lon=${userLatLng.lng}&format=json&apiKey=9b3bf2d63b5e4922be06fb937da81202`;
        axios.get(userAddressUrl)
            .then((resp) => {
                setUserAddress(resp.data.results);
            })
            .catch((error) => {
                console.error("Error fetching user address:", error);
            });
    }
}, [userLatLng]);
  useEffect(()=>{
    if (userLatLng.lat && userLatLng.lng && hospital.lat && hospital.lon) {
      const navigationAddress = `https://api.geoapify.com/v1/routing?waypoints=${userLatLng.lat},${userLatLng.lng}|${hospital.lat},${hospital.lon}&mode=drive&apiKey=9b3bf2d63b5e4922be06fb937da81202`;
  
      axios.get(navigationAddress).then(resp => {
      // console.log(resp.data); 
      if (resp.data.features) {
        const feature = resp.data.features[0];
        const coordinates = feature.geometry.coordinates[0];
        const limitedCoordinates = coordinates;
        const geocodePromises = limitedCoordinates.map(coord => {
            const [lon, lat] = coord;
            return axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=9b3bf2d63b5e4922be06fb937da81202`);
        })
        Promise.all(geocodePromises)
        .then(results => {
            const instructions = results.map((result, index) => {
                const address = result.data.results[0]?.formatted || `(${limitedCoordinates[index][1]}, ${limitedCoordinates[index][0]})`;
                if (index === 0) {
                    return `Start at ${address}.`;
                } else if (index === limitedCoordinates.length - 1) {
                    return `Arrive at destination: ${address}.`;
                } else {
                    return `Continue to ${address}.`;
                }
            });
            setInstructionsInWords(instructions);
        })
        .catch(error => {
            console.error("Error converting coordinates to addresses:", error);
        });
      } else {
        console.error("No routing features found in the response.")   
      }
    })
    .catch(error => {
      console.error("Error fetching navigation directions:", error);
    });
  }
  },[userLatLng, hospital.lat, hospital.lon])
  // console.log(userAddress)
    const formatHospitalAddress = (hospital) => {
        const addressParts = [
            hospital.name,            
            hospital.address_line1,   
            hospital.address_line2,   
        ];
        return addressParts.filter(part => part).join(', ');
    };
    const hospitalFormattedAddress = formatHospitalAddress(hospital)
    // console.log(hospital)
    return(

        <div>
            <Row style={{width:"99vw"}}>
                <Col style={{border:"1px solid gray",margin:"2rem",borderRadius:"16px",padding:"2rem",height:"100%",backgroundColor:"#c5fbfc"}}>
                  <h2 >{hospital.name}</h2>
                  <div style={{borderBottom:"2px solid gray",marginBottom:"1rem",marginTop:"1rem"}}></div>
                   <div>
                    {userAddress.map((user,index)=>{
                      return(
                        <div key={index}>
                            <h4>User latitude:  <span style={{fontWeight:"350"}}>{user.lat}</span></h4>
                          <h4>User longitude:  <span style={{fontWeight:"350"}}>{user.lon}</span></h4>
                          <div style={{ marginBottom: "1.5rem" }}>
                            <h4>User-Formatted Address:  <span style={{fontWeight:"350",fontSize:"1.2rem"}}>{user.formatted}</span></h4>
                          </div>
                        </div>
                      )
                    })}
                      
                   </div>
                   <div style={{borderBottom:"2px solid gray",marginBottom:"1rem"}}></div>
                   <div>
                       <div >
                           <h4>Hospital latitude:  <span style={{fontWeight:"350"}}>{hospital.lat}</span></h4>
                           <h4>Hospital longitude:  <span style={{fontWeight:"350"}}>{hospital.lon}</span></h4>
                           <div style={{ marginBottom: "1.5rem" }}>
                               <h4>Hospital-Formatted Address:  <span style={{fontWeight:"350",fontSize:"1.2rem"}}>{hospitalFormattedAddress}</span></h4>
                            </div>
                        </div>
                    </div>
                   <div style={{borderBottom:"2px solid gray",marginBottom:"1rem"}}></div>
                    <div>
                      <h4>Hospital website:  <span style={{fontWeight:"350"}}>www.{hospital.name}.com</span></h4>
                      <h4>Hospital Email:  <span style={{fontWeight:"350"}}>{hospital.name}@mail.com</span></h4>
                      <h4>Hospital State:  <span style={{fontWeight:"350"}}>{hospital.state}</span></h4>
                      <h4>Hospital City:  <span style={{fontWeight:"350"}}>{hospital.city}</span></h4>
                    </div>
                </Col>
                <Col style={{ border: "1px solid gray", margin: "2rem", borderRadius: "16px", padding: "1rem",backgroundColor:"#c5fbfc" }}>
                    <h3>Step-by-Step Navigation Instructions</h3>
                    <Timeline
                        sx={{
                            [`& .${timelineItemClasses.root}:before`]: {
                                flex: 0,
                                padding: 2,
                            },
                        }}
                    >
                        {instructionsInWords.map((instruction, index) => (
                            <TimelineItem key={index}>
                                <TimelineSeparator>
                                    <TimelineDot color="primary" />
                                    {index < instructionsInWords.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent>
                                    <h5>{instruction}</h5>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </Col>
            </Row>
         
                    
        </div>
    )
}