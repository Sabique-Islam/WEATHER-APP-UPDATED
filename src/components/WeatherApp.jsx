import { useEffect, useState } from "react";
import axios from "axios";
import cloudy from '../assets/images/cloudy.png'
import sunny from '../assets/images/sunny.png';
import snowy from "../assets/images/snowy.png";
import rainy from '../assets/images/rainy.png';
import loading from '../assets/images/loading.gif';
import { API_KEY } from '../assets/apikey.js';
import "./WeatherApp.css";
import { IconMapPinFilled, IconSearch, IconDropletHalfFilled,IconWind } from "@tabler/icons-react";
import dayjs from "dayjs";

/*{
base
: 
"stations"
clouds
: 
{all: 0}
cod
: 
200
coord
: 
{lon: 77.2311, lat: 28.6128}
dt
: 
1727961086
id
: 
1261481
main
: 
{temp: 307.24, feels_like: 310.44, temp_min: 307.24, temp_max: 307.24, pressure: 1002, …}
name
: 
"New Delhi"
sys
: 
{type: 1, id: 9165, country: 'IN', sunrise: 1727916301, sunset: 1727958895}
timezone
: 
19800
visibility
: 
5000
weather
: 
[{…}]
wind
: 
{speed: 1.54, deg: 310}
}*/

const API_URL = "https://api.openweathermap.org/data/2.5/weather?"

const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: rainy,
    Thunderstorm:rainy,
    Snow: snowy,
    Haze: cloudy,
    Mist: cloudy,
};

const backgroundImages = {
    Clear: "linear-gradient(to right, #f3b07c, #fcd283)",
    Clouds: "linear-gradient(to right, #57d6d4, #f71eec)",
    Rain: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Thunderstorm: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Snow: "linear-gradient(to right, #aff2ff, #fff)",
    Haze: "linear-gradient(to right, #57d6d4, #71eeec)",
    Mist: "linear-gradient(to right, #57d6d4, #71eeec)",
};

const WeatherApp = function(){

    const [city, setCity] = useState("Agra");
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{ fetchResult() },[]);

    const fetchResult = async() =>{
        setIsLoading(true);
        const response = await axios.get(API_URL, {params:{q : city, appid : API_KEY, units:"Metric"}});
        console.log("Response: ",response);
        if(response?.data){
            setData(response.data);
        }else {
            setData({notFound:"NOT FOUND"});
        }
        setIsLoading(false);
    };

    const handleInputChange = (e) => {
        let value = e.target.value;
        if (value.trim() !== 0){
            setCity(value);
        }
    };

    const handleEnterPress=(e)=>{
        if(e.key==="Enter"){
            fetchResult();
            }
    };

    const handleSearchIconClick=(e)=>{
        fetchResult();
        };

    const weatherName = data?.weather?.[0]?.main;
    const backgroundImage = data.weather?backgroundImages[weatherName]:backgroundImages["Clear"];

    //const today = new Date();
    const date = dayjs().format("DD MMM YY");

    return (
         <div className="container" style={{backgroundImage}}>
            <div className="WEATHER-TRACK" 
              style={{
                //backgroundImage: backgroundImage.replace("to right", "to left"),
            }}>
            
            <div className="search">
                <div className="search-top">
                    <IconMapPinFilled/>
                    {city && <p>{city}</p>}
                </div>
                <div className="search-bar">
                <input 
                    className="SEARCH-BAR" 
                    type="text" 
                    onChange={handleInputChange}
                    onKeyDown={handleEnterPress}
                    placeholder="Enter Location"
                />
                <IconSearch color="#333" onClick={handleSearchIconClick}/>
                </div>
            </div>

             {isLoading ? (
                 <img className="loader" src={loading} alt="loader"/>
             ): data.notFound?(
                 <p>"NOT FOUND"</p>
             ):(
             <>
             <div className="weather">
                 <img src={weatherImages[weatherName ?? "Clear"]}/>

                 <div className="weather-type">
                     {weatherName && <p>{weatherName}</p>}
                 </div>

                 <div className="weather-temp">
                     {data?.main && <p>{Math.floor(data.main.temp)}°C</p>}
                 </div>
             </div>
             <div className="weather-date">
                 <p>{date}</p>{" "}</div>
             <div className="weather-data">

                 <div className="humidity">
                    <h4>Humidity</h4>
                    <IconDropletHalfFilled color="#f5f5f5"/>
                     {data?.main?.humidity && <p>{data.main.humidity} %</p>}

                 </div>

                <div className="wind">
                    <h4>Wind</h4>
                    <IconWind color="#f5f5f5"/>
                    {data?.wind && <p>{data.wind.speed} km/hr</p>}
                </div>

             </div>
             </>

             )}

              </div>
        </div>
    );
};
export default WeatherApp;
