import "dotenv/config";
import process = require("process");
import  {  Client, GatewayIntentBits, Message } from "discord.js"; 
import cron from "node-cron";
import axios from "axios";




const USER_ID = process.env.USER_ID;
const TOKEN = process.env.TOKEN;
const NASA_API_KEY = process.env.NASA_API_KEY;

if(!USER_ID){
    throw new Error("ERROR: the USER_ID is invalid");
}

if(!TOKEN){
    throw new Error("ERROR: the USER_ID is invalid");
}

if(!NASA_API_KEY){
    throw new Error("ERROR: the NASA_API_KEY is invalid");
}

//création du bot et obtention des permissions
const client = new Client({
    intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
});



//connexion à Discord
client.once("clientReady", async () => {    
    console.log(`✅ connected as ${client.user?.tag}`);

    //récupération de l'utilisateur
    const user = await client.users.fetch(USER_ID);
    user.send( `Salam 3aleykoum,  je suis connecté 🫡`);

    //envoi des prévisions météo
    cron.schedule("0 8 * * *", async () => {
        try {
            const latitude = 50.866;
            const longitude = 4.377;

            //url
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&timezone=Europe/Brussels`;


            //récupère la météo de l'API open meteo
            const response = await axios.get(url);
            const data = response.data; //json de l'API
            const currentTemp = data.current_weather.temperature;
            const currentWind = data.current_weather.windspeed;
            const currentCode = data.current_weather.weathercode;
            const hourlyFeels = data.hourly.apparent_temperature; 


            function getWeatherDesc(code: number): string {
                const map : Record<number, string> = {
                    0: "☀️ Ciel clair",
                    1: "🌤️ Principalement clair",
                    2: "⛅ Partiellement nuageux",
                    3: "☁️ Couvert",
                    45: "🌫️ Brouillard",
                    51: "🌦️ Bruine légère",
                    61: "🌧️ Pluie légère",
                    71: "🌨️ Neige légère",
                    95: "⛈️ Orage"
                }

                if(!map[code]){
                    return "🗺️ Inconnu";
                }

                return map[code]
            };

            //construction du message et envoi
            const weatherMessage = `
            🌤️ **Météo actuelle à Schaerbeek**
            Température : ${currentTemp}°C (ressenti ${hourlyFeels[0]}°C)
            Vent : ${currentWind} km/h
            Conditions : ${getWeatherDesc(currentCode)}`;

            await user.send(weatherMessage);
            console.log("✅ Météo envoyée avec succès !");
            
        } catch (error) {
            console.error("❌ Erreur météo: " + error);
        }
    });
    
});






//réponse en cas de message de l'utilisateur
client.on("messageCreate", async (message: Message) => {
    const user = await client.users.fetch(USER_ID);


     if(message.channel.type === 1) {

        if(message.author.bot){
            return;
        }   

        if(message.content.toLowerCase().startsWith('!weather')){

            const args = message.content.split(' ').slice(1);
            const city = args.join(' ');

            if(!city){
                message.reply("Veuillez indiquer une ville");
            }

            try {
            const urlMap = `https://nominatim.openstreetmap.org/search?city=${city}&format=json`;
            const responseMap = await axios.get(urlMap);
            const dataMap = responseMap.data;
            const cityName = dataMap[0].name;
            const latitude = dataMap[0].lat;
            const longitude = dataMap[0].lon;

            //url
            const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&timezone=Europe/Brussels`;


            //récupère la météo de l'API open meteo
            const responseWeather = await axios.get(urlWeather);
            const dataWeather = responseWeather.data; //json de l'API
            const currentTemp = dataWeather.current_weather.temperature;
            const currentWind = dataWeather.current_weather.windspeed;
            const currentCode = dataWeather.current_weather.weathercode;
            const hourlyFeels = dataWeather.hourly.apparent_temperature; 


            function getWeatherDesc(code: number): string {
                const map : Record<number, string> = {
                    0: "☀️ Ciel clair",
                    1: "🌤️ Principalement clair",
                    2: "⛅ Partiellement nuageux",
                    3: "☁️ Couvert",
                    45: "🌫️ Brouillard",
                    51: "🌦️ Bruine légère",
                    61: "🌧️ Pluie légère",
                    71: "🌨️ Neige légère",
                    95: "⛈️ Orage"
                }

                if(!map[code]){
                    return "🗺️ Inconnu";
                }

                return map[code]
            };

            
            const weatherMessage = `
            🌤️ **Météo actuelle à ${cityName}**
            Température : ${currentTemp}°C (ressenti ${hourlyFeels[0]}°C)
            Vent : ${currentWind} km/h
            Conditions : ${getWeatherDesc(currentCode)}`;

            await user.send(weatherMessage);
            console.log("✅ Météo envoyée avec succès !");
            
        } catch (error) {
            console.error("❌ Erreur météo: " + error);
        }
            
        }

        if(message.content.toLowerCase() === '!ping'){
                const response = await message.reply("Calcul du Ping...");
                const latency = response.createdTimestamp - message.createdTimestamp;
                response.edit(`La latence est de: ${latency}ms` );
                return;
        }

        if(message.content.toLowerCase() === '!info'){
            const info = client.user;
            if(!info) return;

            const infoMessage = `
            **           Nom du bot :** ${info.username}
            **ID :** ${info.id}
            **Tag :** ${info.tag}
            **Date de création :** ${info.createdAt.toDateString()}`;

            await message.reply(infoMessage); 
        }

        if(message.content.toLowerCase().startsWith('!forecast')) {
                const args = message.content.split(' ').slice(1);
                const city = args.join(' ');

                if(!city){
                    message.reply("Veuillez indiquer une ville");
                }

                try {
                    const urlMap = `https://nominatim.openstreetmap.org/search?city=${city}&format=json`;
                    const responseMap = await axios.get(urlMap);
                    const dataMap = responseMap.data;
                    const cityName = dataMap[0].name;
                    const latitude = dataMap[0].lat;
                    const longitude = dataMap[0].lon;
                    

                    // Prévisions sur 3 jours
                    const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe/Brussels`;
                    const responseWeather = await axios.get(urlWeather);
                    const dataWeather = responseWeather.data.daily;

                    function getWeatherDesc(code: number): string {
                    const map : Record<number, string> = {
                        0: "☀️ Ciel clair",
                        1: "🌤️ Principalement clair",
                        2: "⛅ Partiellement nuageux",
                        3: "☁️ Couvert",
                        45: "🌫️ Brouillard",
                        51: "🌦️ Bruine légère",
                        61: "🌧️ Pluie légère",
                        71: "🌨️ Neige légère",
                        95: "⛈️ Orage"
                    }

                    if(!map[code]){
                        return "🗺️ Inconnu";
                    }

                    return map[code]
                    };

                    let forecastMessage = `**Prévisions pour ${cityName} (3 prochains jours) :**\n\n`;
                    for(let i = 0; i < 3; i++){
                        const date = dataWeather.time[i];
                        const max = dataWeather.temperature_2m_max[i];
                        const min = dataWeather.temperature_2m_min[i];
                        const code = dataWeather.weathercode[i];

                        forecastMessage += `**${date}** - Max: ${max}°C, Min: ${min}°C, Conditions: ${getWeatherDesc(code)}\n`;
                    }

                    message.reply(forecastMessage);
                } catch (error) {
                    console.error(error);
                    message.reply("❌ Impossible de récupérer la météo.");
                }
        }

        if(message.content === "!nasa"){
            try {
                const urlNasaImage = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
                const responseNasaImage = await axios.get(urlNasaImage);
                const dataNasaImage = responseNasaImage.data;

                const titre = dataNasaImage.title;
                const image = dataNasaImage.url;
                const description = dataNasaImage.explanation;

                message.reply(titre);
                user.send(image);
                user.send(description);


            } catch (error) {
                console.error(error);
                message.reply("❌ Impossible de récupérer l'image de la NASA.");
            }

        }
    }
     
});




//authentification auprès des serveurs Discord
client.login(TOKEN);