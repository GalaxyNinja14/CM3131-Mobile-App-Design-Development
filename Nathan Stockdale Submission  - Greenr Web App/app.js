//Setting up the navigation for the web app
const homeNav = document.querySelector('#home-nav');
const homePage = document.querySelector('#home-page');
homeNav.root = homePage;

const feedNav = document.querySelector('#feed-nav');
const feedPage = document.querySelector('#feed-page');
feedNav.root = feedPage;

const locationNav = document.querySelector('#location-nav');
const locationPage = document.querySelector('#location-page');
locationNav.root = locationPage;

// This set of code powers the nav-bar on my web app which utilises <ion-tabs>
// this is the subsequent code which defines the constant variables and redirections for the 
// navigation buttons and <ion-tabs> 

//Alert Button 
const alert = document.querySelector('ion-alert');
alert.buttons = ['OK'];

//Creates the weekly sustainability goals feature on the homepage
const objectList = document.getElementById('list-objects');
const createDBBtn = document.getElementById("btn-create-db");
const addDataBtn = document.getElementById("btn-add-data");
const viewDataBtn = document.getElementById("btn-view-data");

let db = null;
let inputDbName = null;
let inputDbVersion = null;

addDataBtn.addEventListener('click', addData);
viewDataBtn.addEventListener('click', viewData);

let dataObjectArray = [
    {
        GOAL: '1',
        TITLE: 'Recycling',
        AIM: 'To recycle all non single use items within the household',
        TIMESCALE: 'Weekly, All Year',
        DIFFICULTY: 'Low'
    },
    {
        GOAL: '2',
        TITLE: 'Sustainable Shopping',
        AIM: 'Try and visit sustainable stores monthly within the city',
        TIMESCALE: 'Monthly, All Year',
        DIFFICULTY: 'Medium'
    },
    {
        GOAL: '3',
        TITLE: 'Recycling',
        AIM: 'To recycle all non single use items within the household',
        TIMESCALE: 'Weekly, All Year',
        DIFFICULTY: 'Low'
    },
    {
        GOAL: '4',
        TITLE: 'Recycling',
        AIM: 'To recycle all non single use items within the household',
        TIMESCALE: 'Weekly, All Year',
        DIFFICULTY: 'Low'
    },
    {
        GOAL: '5',
        TITLE: 'Recycling',
        AIM: 'To recycle all non single use items within the household',
        TIMESCALE: 'Weekly, All Year',
        DIFFICULTY: 'Low'
    },

];


function createDB() {
    const nameField = document.getElementById("txt-db");
    inputDbName = nameField.value;
    const versionField = document.getElementById("txt-version");
    inputDbVersion = parseInt(versionField.value);

    if (isNaN(inputDbVersion) || inputDbVersion <= 0) {
        inputDbVersion = 1;
    }

    localStorage.setItem('dbVersion', inputDbVersion);
    localStorage.setItem('dbName', inputDbName);

    const request = indexedDB.open(inputDbName, inputDbVersion);

    
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const myRecords = db.createObjectStore("records", { keyPath: "GOAL" });
        console.log(`upgrade is called, database name: ${inputDbName} database version: ${inputDbVersion}`);
    }

    
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log(`sucess is called, database name: ${inputDbName} database version: ${inputDbVersion}`);
    };

    //error
    request.onerror = (event) => {
        console.log(`error!!! ${event.target.error}`);
    };
}

createDBBtn.addEventListener('click', createDB);

function addData() {
    if (!db) {
        console.log("Error: database not found.");
        return;
    }

    console.log(dataObjectArray);
    const tx = db.transaction("records", "readwrite");

    tx.onerror = (event) => console.log(`Error! ${event.target.error}`);

    const myRecords = tx.objectStore("records");
    for (obj of dataObjectArray) {
        myRecords.add(obj);
    }
}

function viewData() {
    if (!db) {
        console.log("Error: database not found.");
        return;
    }

    objectList.innerHTML = "";

    const tx = db.transaction("records", "readonly");
    const myRecords = tx.objectStore("records");
    const request = myRecords.openCursor();

    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const obj = cursor.value;
            for (const prop in obj) {
                const newItem = document.createElement("ion-item");
                newItem.innerText = `${prop}: ${obj[prop]}`;
                objectList.appendChild(newItem);
            }
            const separatorItem = document.createElement("ion-item");
            separatorItem.innerText = "--------";
            objectList.appendChild(separatorItem);
            cursor.continue();
        }
    };
}

window.addEventListener('load', () => {
    inputDbVersion = parseInt(localStorage.getItem('dbVersion'));
    inputDbName = localStorage.getItem('dbName');
    const request = indexedDB.open(inputDbName, inputDbVersion);

    request.onsuccess = (event) => {
        db = event.target.result;
        console.log(`Existing database found. Database name: ${inputDbName} Database version: ${inputDbVersion}`);
    };

    request.onerror = (event) => {
        console.log(`Error!!! ${event.target.error}`);
    };
});
// This code above creates a weekly sustainability goals feature that incorporates IndexedDB. 
// The 'dataObjectArray' variable holds the array of data that is subsequently added to the database when the user clicks the add data button triggering the 'addData function.
// The 'createDB function creates an new IndexedDB database with the user defined name and week number creating an object store called 'records'
// - The user defined name and version number(known as week to the user) are taken from the 'txt-db' and 'txt-version' <ion-input> elements
// - it then checks if the version number(known as week to the user) value is valid ie  greater than 1 as this is essential for it to function if the value is wrong it will be set to 1 
// - The function then saves the database name and version number(known as week to the user) to localStorage to allow the database to be found and viewed when the page is reloaded 
// - 'indexedDb.open() is used to create a new indexedDB database with the user defined name and version number(known as week to the user).
// The 'viewData' function retieves the data from the object store called 'records' and passes it to the 'objectList' html element. 
// - If no database is found it will log an error message if a database been created it will clear the contents of the html element ready for the new data to be displayed and avoid repetition. 
// - The function then reads the data in 'records' iterating through all the data held within the object store. Using the openCursor() method and ajoining onsuccess event handler.
// - The function then proceeds to create a new <ion-item> for each record that is then given a string value with the names and values of the objects held in the database.
// - The new elements are then appended to the <ion-list> with id="listObjects" 
// - A separator is added to create a division between each record/list item/subsection 
// The 'window.addEventListener' is called when the window loads and checks to see if a database has already been created allowing the user to view the a previously created list.
// - If a user has already created a database the name and version number(know as week to the user) defined by them will have been saved to the local storage
// therefore this code checks the local storage and uses any stored values held within to search for and open any existing databases.
// Throughout the code there are also a number of console.logs in order to catch any errors and clearly display any issues.


//Creates the API map feature for the sustainability business search feature on the location page 
const key = 'H29hj1A4nGf2G7bEStss';
const map = L.map('map').setView([57.1478, -2.0988], 14);

L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`, {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
}).addTo(map);

var marker = L.marker([57.1478, -2.0988],).addTo(map);
marker.bindPopup("<b>The Body Shop</b><br>Drop off difficult/ hard to recycle items in-store. The Body Shop is a B-corp company").openPopup();
var marker = L.marker([57.1186, -2.1360],).addTo(map);
marker.bindPopup("<b>RGU</b><br>Learn more about sustainability here.").openPopup();
var marker = L.marker([57.1416, -2.1196],).addTo(map);
marker.bindPopup("<b>Refilosophy</b><br>Store selling refillable household goods.").openPopup();
var marker = L.marker([57.1460, -2.1005],).addTo(map);
marker.bindPopup("<b>Primark</b><br>Recycling point for old clothing in-store.").openPopup();
var marker = L.marker([57.1441, -2.0970],).addTo(map);
marker.bindPopup("<b>H&M</b><br>Return unwanted clothing to store to recieve an in-store voucher. H&M will then either rewear, reuse or recycle your clothing.").openPopup();
var marker = L.marker([57.2025, -2.3078],).addTo(map);
marker.bindPopup("<b>Forest Farm Dairy</b><br>Buy a glass refill bottle and return time and time again for pints of milk and flavoured milk options.").openPopup();
var marker = L.marker([57.1490, -2.0976],).addTo(map);
marker.bindPopup("<b>Starbucks (All Locations)</b><br>Get money off your hotdrinks when you use a refillable cup.").openPopup();
var marker = L.marker([57.1484, -2.0965],).addTo(map);
marker.bindPopup("<b>Costa (All Locations)</b><br>Bring a reuable cup and get every 5th coffee for free.").openPopup();
var marker = L.marker([57.1312, -2.1381],).addTo(map);
marker.bindPopup("<b>Rosmary Planet</b><br>Huge variety of refillable products icluding food and household products.").openPopup();
var marker = L.marker([57.1489, -2.0814],).addTo(map);
marker.bindPopup("<b>Clan Cancer Charity Superstore</b><br>Massive selection of second hand clothing all for a good cause").openPopup();
var marker = L.marker([57.1433, -2.0975],).addTo(map);
marker.bindPopup("<b>Nespresso</b><br>Return used coffee pods in-store, alluminium casing is recycled and coffee grains turned into biofuel. Nespresso is a B-corp company").openPopup();

function onEachFeature(feature, layer) {
    
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Recylcling Point",
        "amenity": "Rubbish Tip",
        "popupContent": "Hazlehead Recycling Centre "
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-2.170679, 57.140545]
    }
};

L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);

// This section of app pulls in a map api using leaflet.js https://leafletjs.com and subsequently adds a series of markers to the map which display a series of sustainable shops and locations 
// that the user could choose to visit and labels them as such with popup windows when they are clicked by the user. 
// The 'onEachFeature' is used to bind the popup content to the feature layer. They are then added to the Map.
// THe map is centered on 'Aberdeen' and is zoomed into level 14 to avoid confusion for the user and stop them from having to find Aberdeen on the global map 
// The map tile layer is sourced from https://www.maptiler.com with an API key and contains the map visuals that can be seen by the viewer. 
// I tried to incorporate a GeoJSON feature which is based on JSON as an alternate way to add a marker to my map feature as it can be used for simple geographical features.

// Creates the to-do-list feature on the homepage 
const storageInput = document.getElementById('input-text');
const saveTextSession = document.getElementById('btn-saveS');
const getTextSession = document.getElementById('btn-getS');
const storedSessionData = document.getElementById('stored-data');

const saveToSessionStorage = () => {
    let sessionData = sessionStorage.getItem("textInput");
    let sessionArray = [];

    if (sessionData) {
        sessionArray = JSON.parse(sessionData);
    }

    sessionArray.push(storageInput.value);
    sessionStorage.setItem("textInput", JSON.stringify(sessionArray));
    console.log("Saved to session storage");

    storageInput.value = "";
}

const getSessionStorage = () => {
    const sessionData = sessionStorage.getItem("textInput");

    if (sessionData) {
        const sessionArray = JSON.parse(sessionData);
        console.log("Session data is ");
        console.log(sessionArray);

        storedSessionData.innerHTML = ''; 

        sessionArray.forEach((entry) => {
            const div = document.createElement('div');
            div.textContent = entry;
            storedSessionData.appendChild(div);
        });
    } else {
        console.log("No session data found");
    }
}

saveTextSession.addEventListener("click", saveToSessionStorage);
getTextSession.addEventListener("click", getSessionStorage);
// This code allows the user to create an interactive daily to-do-list that utilises session storage to save and retrieve user input data 
// - Two <ion-buttons> control most of the operation alongside the input and output data from the <ion-input> tags 
// - The variables 'saveToSessionStorage and 'getSessionStorage are assigned to the <ion-buttons> in the form of id attributes to respond to user button clicks 
// - The 'saveToSessionStorage' button retrieves the current session storage data if there is any and parses it from JSON to an array. The value of 'storageInput' text input 
//   is then appended to the array. The session storage is then updated with the new array as a stringified JSON 
// - The 'getSessionStorage' retrieves the session storage data and parses it from JSON to an array. The content of 'storedSessionData' an html 'div' element and loops 
//   through the array creating new 'div' elements for each individual entry and appends these new elements to the 'storedSessionData' element.
// - If no session storage data is found a message will be logged to the console 
// - Event listeners are also used to trigger the relevent steps when a user pushes the buttons


// Uses an API to diplay live energy data from The National Grid on the Newsfeed page
fetch("https://api.carbonintensity.org.uk/regional/scotland")
    .then(response => response.json()) 
    .then(data => displayData(data)) 
    .catch(error => console.error(error));


function formatDate(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toLocaleDateString();
    const time = dateTime.toLocaleTimeString();
    return `${date} ${time}`;
}


function formatFuelMix(generationMix) {
    return generationMix.map(fuel => `${fuel.fuel}: ${fuel.perc}%`).join('<br>');
}


function displayData(data) {
    
    if (data && data.data && data.data.length > 0 && data.data[0].data && data.data[0].data.length > 0) {
        const regionData = data.data[0].data[0];
        const from = formatDate(regionData.from);
        const to = formatDate(regionData.to);
        const intensity = regionData.intensity.index;
        const fuelMix = formatFuelMix(regionData.generationmix);

        
        const list = document.getElementById('data-list');

        
        const fromItem = document.createElement('ion-item');
        fromItem.innerHTML = `From: ${from}`;
        list.appendChild(fromItem);

       
        const toItem = document.createElement('ion-item');
        toItem.innerHTML = `To: ${to}`;
        list.appendChild(toItem);

       
        const regionItem = document.createElement('ion-item');
        regionItem.innerHTML = `Region: ${data.data[0].dnoregion}`;
        list.appendChild(regionItem);

     
        const intensityItem = document.createElement('ion-item');
        intensityItem.innerHTML = `Intensity: ${intensity}`;
        list.appendChild(intensityItem);

      
        const fuelMixItem = document.createElement('ion-item');
        fuelMixItem.innerHTML = `Fuel Mix: <br> ${fuelMix}`;
        list.appendChild(fuelMixItem);

    } else {
        console.error('Error: Failed to retrieve data');
    }
}
// This code diplays live data that is refreshed every 30 mins from The National Grid using the Carbon Intensity API https://carbon-intensity.github.io/api-definitions/#carbon-intensity-api-v2-0-0 
// - Firstly a fetch request is made to the API for the regional carbon intensity data for the Scotland Region. The data is then formatted and diplayed on the page for the user.
// - The fetch() function is used to retrive the physical data from the API and the then() method is used as the processor to format the response when it is recieved. The data is then 
//   converted into JSON format using JSON()
// - The diplayData() function is called to handle the format and display of the data so it is readable to the viewer. The formatDate() function is used to format the date and time information 
//   provided by the API 
// - formatFuelMix() handles the bulk of the data recieved and formats the fuel mix data. Once formatted the data is then added using 'innerHTML' and appended to the <ion-list> with the id='data-list'
//   and each fuel element is added as a separate individual <ion-item> entry.
// - The data is displayed on the web app as a list held within an <ion-card> 
// - If any errors are encountered and data cannot be retrieved an error message will be diplayed 

//------------------------------
// References 

// Map & advice around implementation 
// - https://leafletjs.com 
// - https://www.maptiler.com 
// - https://www.openstreetmap.org/copyright 
// All copyrights are respected and attribution is displayed on the map feature itself. 

// National Grid Carbon Intensity data 
// - https://carbon-intensity.github.io/api-definitions/#carbon-intensity-api-v2-0-0

// Weekly Sustainbility Goals and To-Do-List
// - Contains altered/modified versions of some elements from in-class lab code building on original code taught by RGU Lecturer Rodger McDermott - Week 10 Data Persistence lab

// Other sources of guidance and implementation advice / troubleshooting / inspiration 
// - https://ionicframework.com/docs/ - Inspiration/Implementation Advice 
// - https://www.w3schools.com - Troubleshooting
// - https://ionicframework.com/docs/api/tabs - Ionic Tabs 
// - https://openai.com/blog/chatgpt - Troubleshooting
// - Class code - lecture examples and code I have written in class - Fundamental Understanding 

// Images/Videos 
// - Image/Video Content from Pexels are clearly labelled in file names - source: https://www.pexels.com all content is free to use/royalty free however attribution is given to creators in the file names for reference
//-  Image Content from Unsplash is clealy labelled in file names - source: https://unsplash.com all content is free to use/royalty free however attribution is given to creators in the file names for reference
// - TheBodyShop.jpg was taken by myself Nathan Stockdale and is owned by me - full permission without restriction is given to use within this application 
// - Logo.jpg was also design by myself Nathan Stockdale and is owned by me - full permission without restriction is given to use within this application 
