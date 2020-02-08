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

//==============ADD OBJECTS=============================
var slideshow = document.getElementById("slideshow").innerHTML;

function addObject(data){
    var count = data.objects.length;
    for(var i = 0; i < count; i++) {
        document.write(objects[i]);
        //document.createElement(objects[i]);
    }
}
    
addObject(data)
    //slideshow.appendChild(OBJECT VARIABLE)



// Generate css here
