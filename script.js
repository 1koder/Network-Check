//Connecting the dots
const popup = document.querySelector('.popup');
//Changing the keys
wifiIcon = document.querySelector(".icon i");
popupTitle = document.querySelector(".popup .title");
popupDesc = document.querySelector(".desc");
reconnectBtn = document.querySelector(".reconnect");


//By default, isOnline will be true
let isOnline = true, intervalID, timer = 10;

const checkConnection = async () => {
    //We will make an API Call
    //so we write the code inside a try-catch block for error handling
    //await is only valid in async functions and the top level bodies of modules
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        //Try to fetch random data from the API..Online is achieved if
        //Status code is btw 200 and 300 
        isOnline = response.status >= 200 && response.status < 300;
        
    } catch (error) {
        //if there is an error, thee connection is connection is considered offline
        isOnline = false;
    }
    timer = 10;
    clearInterval(intervalID)
    handlePopup(isOnline);
    //Issue : checkConnection is calling every 3 seconds. we have to stop it
    //if the device is offline and timer isn't finished.
}

const handlePopup = (status) => {
    if (status) {
        //if status is true (online), remove "show" class // update icon, title and description accordingly
        wifiIcon.className = "uil uil-wifi";
        popupTitle.innerText = "Restored Connection";
        popupDesc.innerHTML = "Your device is now successfully connected to the internet."
        popup.classList.add("online");
        return setTimeout(() => popup.classList.remove("show"), 2000);
    }
        //if status is false (offline), add "show" class // update icon, title and description accordingly
        wifiIcon.className = "uil uil-wifi-slash";
        popupTitle.innerText = "Lost Connection";
        popupDesc.innerHTML = "Your Network is Unavailable. We will attempt to reconnect you in <b>10</b> seconds";
        //popup.classList.add("show");
        popup.className = "popup show";

    intervalID = setInterval(() => {
        timer--;  //Sets an interval to decrease the timer by 1 every second
        if (timer === 0) checkConnection(); //if timer reaches 0, check the connection again
        popup.querySelector(".desc b").innerText = timer;
        //i noticed timer at Zero continues to read negative values
        //so we are going to fix that
    }, 1000);
}

//Check Connection Status Every 3 seconds
setInterval(checkConnection, 3000);

//Only if isOnline is true, check the connection status every 3 seconds
setInterval(() => isOnline && checkConnection(), 3000);

reconnectBtn.addEventListener("click", checkConnection);
