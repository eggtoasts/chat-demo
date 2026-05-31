'use strict';

let stompClient = null;
let username = null;

const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const messageArea = document.querySelector('#messageArea');
const connectingElement = document.querySelector('.connecting')
const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');

const searchBar = document.querySelector('#search');
const gifBox = document.querySelector('#gif-results');

function onConnected() {
    // listens to /topics/general
    stompClient.subscribe('/topics/general', onMessageReceived);

    // listens to addUser
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}

function onError(error) {
    // connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    // connectingElement.style.color = 'red';
}

function onMessageReceived(payload) {
    let message = JSON.parse(payload.body);

    let messageCard = document.createElement("li");

    if(message.type === "JOIN"){
        messageCard.innerHTML = `<p> ${message.sender} has joined. </p>`
    }

    if(message.type === "CHAT"){
        messageCard.innerHTML = `<p>${message.sender}: ${message.content} </p>`
    }

    if(message.type === "LEAVE"){
        messageCard.innerHTML = `<p>${message.sender} left. </p>`
    }

    if(message.type === "GIF"){
        messageCard.innerHTML = `
        <p>${message.sender}:</p>
        <img src="${message.content}" alt="gif" />
    `
    }

    messageArea.appendChild(messageCard);

}


usernameForm.addEventListener('submit',  connect, true)


messageForm.addEventListener('submit', sendMessage, true)


function connect(e) {
    console.log("peak");
    username = document.querySelector("#name").value.trim();

    if(username != null){
        let socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }

    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');

    e.preventDefault();
}

function sendMessage(e) {
    let messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };

        //sends to our server!
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    e.preventDefault();
}

searchBar.addEventListener( "keypress", async (e) => {
    let query = searchBar.value.trim();
    if (e.key === "Enter") {
        await searchGifs(query);
    }
})

async function searchGifs(query) {
    const response = await fetch(`/api/gifs/search?q=${query}`);
    const data = await response.json();
    console.log(data);

    gifBox.innerHTML = "";

    // extract the array from gif json
    let dataArray = data.data;

    if (dataArray) {
        dataArray.forEach( (gif) => {
            const gifBlock = document.createElement("img");
            gifBlock.src = gif.images.fixed_height.url;
            gifBlock.alt = gif.title || "Giphy GIF";

            // send through websocket when clicked
            gifBlock.addEventListener("click", () => {
                let chatMessage = {
                    sender: username,
                    content: gif.images.fixed_height.url,
                    type: 'GIF'
                };
                stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
                gifBox.innerHTML = ""; // close the gif picker after sending
            });

            gifBox.appendChild(gifBlock);
        })
    }
    return data;
}

