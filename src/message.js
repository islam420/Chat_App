


function reloadMessage (message) {
    const obj = {
        text: message,
        creatAt: new Date().getTime()
    };

    return obj
};

function generatedLocation (url) {
   const obj =  {
        url,
        creatAt: new Date()
    }
    return obj
}


module.exports = {reloadMessage, generatedLocation}