// Add objects here

//==========DATA OBJECT ================
data = {
    "objects": {
        0: {
            "type": "div",
            "content": "Hello World!"
        },
        1: {
            "type": "img",
            "src": "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
        }
    },
    "slides": {
        0: {
            "background_colour": "black",
            "visible": [0],
            "transition-time": 1,
            "styles": {
                0: {
                    "colour": "white"
                }
            },
        },
        1: {
            "background_colour": "white",
            "visible": [0, 1],
            "transition-time": 1,
            "styles": {
                0: {
                    "colour": "black"
                },
                1: {
                    "position": "auto, auto, 0, 0"
                }
            },
        }
    }
}


var slideshow = document.getElementById("slideshow");
slideId = 0

//==============ADD OBJECTS=============================
function addObject(data){

    for(var item in data.objects){
        var type = (data.objects[item].type);
        console.log(type, typeof type);
        if (type == "div"){
            var object = document.createElement(type)
            object.innerHTML = data.objects[item].content
        }
        else if (type == "img"){
            var object = document.createElement(type)
            object.src = data.objects[item].src
        }
        object.id = "object-"+item;
        slideshow.appendChild(object);
    }
}


//==============SCAN FOR KEY PRESSES=============================

document.onkeydown = function() {
    var evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    if ([32,39].includes(charCode)){
        if (slideId > Object.keys(data.slides).length-1){
            console.log("slideshow done")
        }
        else {
            slideId=(slideId+1);
        }
    }
    else if (charCode == 37){
        if (slideId == 0){
            console.log("slideshow start")
        }
        else {
            slideId=(slideId-1);
        }
    }
    console.log(slideId)
};
addObject(data)
    //slideshow.appendChild(OBJECT VARIABLE)






// Generate css here
