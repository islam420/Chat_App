console.log('hi from server....');

const socket = io();

function getParam(param){
    return new URLSearchParams(window.location.search).get(param);
  }

  const name = getParam("username");

  console.log("Par=====> ", name);

///////// elements
const $messageFrom = document.querySelector('#click');
const $messageFormInput = $messageFrom.querySelector('input');
const $messageFormButton = $messageFrom.querySelector('button'); 
const $locationButton = document.querySelector("#send-location");
const $message = document.querySelector("#message");


////////// template
const messageTemplate = document.querySelector('#message-template').innerHTML;
// const locationTemplate = document.querySelector("#location-template").innerHTML; 


// socket.on('updateData', (count) => {
//     console.log(`the count has update ${count}`);
// });

// socket.on('shareLocation', (Obj) => {
//     console.log(Obj);
//     const html = Mustache.render(locationTemplate, {
//         url: Obj.url,
//         creatAt: moment(Obj.creatAt).format('h:mm a')
//     });
//     $message.insertAdjacentHTML('beforeend', html)
// });

socket.on('ServerMessage', (message) => {
    console.log("==> ", message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        creatAt: moment(message.creatAt).format('h:mm a')
    });

    $message.insertAdjacentHTML('beforeend', html)
});

const user = {
    name: getParam("username"),
    room: getParam("room")
};

socket.emit('createRoom', user, (error) => {
    //// enable
    if (error) {
        return console.log(error);
    }
    console.log('message was delivered !')
});




$messageFrom.addEventListener('submit', (e) => {
    e.preventDefault();
    /// disable
    $messageFormButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.inputText.value;
    const user_data_obj = {
        message,
        name: getParam("username"),
        room: getParam("room")
    };
    socket.emit('SendMessage', user_data_obj, (error) => {
        //// enable

        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) {
            return console.log(error);
        }
        console.log('message was delivered !')
    });

    
});



// $locationButton.addEventListener('click', () => {
//     ////// disable
//     $locationButton.setAttribute('disabled', 'disabled');

//     if (!navigator.geolocation) {
//         return alert("navigator is not support your browser !")
//     }

//     navigator.geolocation.getCurrentPosition((position) => {
//         // console.log(position.coords.latitude);  ///longitude
//         socket.emit("sendLocation", {
//             latitude: position.coords.latitude, 
//             longitude: position.coords.longitude
//         }, (data) => {
//             if (data) {
//                 $locationButton.removeAttribute('disabled')
//                 console.log(data);
//             }
           
//         });
//     });
// });

