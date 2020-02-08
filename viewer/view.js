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
                    "color": "white"
                },
                1:{
                    "left": "0"
                }
            },
        },
        1: {
            "background_colour": "white",
            "visible": [0, 1],
            "transition-time": 1,
            "styles": {
                0: {
                    "color": "black"
                },
                1: {
                    "left": "100px"
                }
            },
        }
    }
}

function generate_css(slide_id, object_id, styles) {
    current_style = "";
    for (key in styles) {
        current_style += `${key}: ${styles[key]};`
    }
    return `#slide-${slide_id} #object-${object_id} {${current_style}}\n`
}

function make_full_css(data) {
    // Add objects here

    // Generate css here
    stylesheet = "";
    for (slide_id in data["slides"]) {
        slide_id = parseInt(slide_id)
        stylesheet += `\n\n/*---Slide ${slide_id}---*/\n`
        console.log(slide_id);
        slide = data["slides"][slide_id];

        // Generate styles for the slide itself
        stylesheet += "\n/*-The slide-*/\n"
        current_style = ""
        current_style += `background-color: ${slide['background_colour']};`;
        current_style += `transition: all ${slide['transition-time']}s;`;
        stylesheet += `#slide-${slide_id} {${current_style}}\n`;
        stylesheet += `#slide-${slide_id} * {transition: all ${slide['transition-time']}s;}\n`;

        stylesheet += "\n/*-The slide elements-*/"
        // Generate styles for objects that are in the next slide, but not this one
        stylesheet += "\n/*The next slide*/\n"
        next = slide_id+1;
        if (data["slides"][next] !== undefined) {
            console.log("there exists a next slide")
            for (object_id in data["slides"][next]["visible"]) {
                object_id = parseInt(object_id)
                if (slide["styles"][object_id] == undefined){
                    stylesheet += generate_css(slide_id, object_id, data["slides"][next]["styles"][object_id]);
                }
            }
        }


        // Generate styles for objects that are in the next slide, but not this one
        stylesheet += "\n/*The previous slide*/\n"
        prev = slide_id-1;
        if (prev >= 0) {
            console.log("there exists a prev slide")
            for (object_id in data["slides"][prev]["visible"]) {
                object_id = parseInt(object_id)
                if (slide["styles"][object_id] == undefined){
                    stylesheet += generate_css(slide_id, object_id, data["slides"][prev]["styles"][object_id]);
                }
            }
        }

        // Generate styles for this slide
        stylesheet += "\n/*This slide*/\n"
        for (object_id in slide["styles"]) {
            console.log("F")
            console.log(object_id)
            stylesheet += generate_css(slide_id, object_id, slide["styles"][object_id]);
        }

        // Make visible things visible
        stylesheet += "\n/*Visibility and pointer events*/\n"
        for (object_id in slide["visible"]) {
            stylesheet += `#slide-${slide_id} #object-${object_id} {opacity: 1; pointer-events: auto}\n`
        }

    }

    // Add a style element
    style = document.createElement("style");
    style.innerHTML = stylesheet;
    document.body.appendChild(style)
    console.log(stylesheet);
}

var slideshow = document.querySelector(".slideshow");
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
        object.classList.add("object")
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
    else if (charCode == 70){
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
        
    }
    console.log(slideId)
    document.querySelector(".slideshow").id = "slide-"+slideId
};


function start_slides(data) {
    make_full_css(data);
    addObject(data);
}

start_slides(data)
