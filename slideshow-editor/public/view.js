function generate_css(slide_id, object_id, styles) {
    current_style = "";
    for (key in styles) {
        if (key=="#arbitrary-style") {
            current_style += `;${styles[key]};`
        } else {
            current_style += `${key}: ${styles[key]};`
        }
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
        slide = data["slides"][slide_id];

        // Generate styles for the slide itself
        stylesheet += "\n/*-The slide-*/\n"
        current_style = ""
        current_style += `background-color: ${slide['background_colour']};`;
        current_style += `transition: all ${slide['transition_time']}s;`;
        stylesheet += `#slide-${slide_id} {${current_style}}\n`;
        stylesheet += `#slide-${slide_id} * {transition: all ${slide['transition_time']}s;}\n`;

        stylesheet += "\n/*-The slide elements-*/"
        // Generate styles for objects that are in the next slide, but not this one
        stylesheet += "\n/*The next slide*/\n"
        next = slide_id+1;
        if (data["slides"][next] !== undefined) { //loop may be broken
            for (i in data["slides"][next]["visible"]) {
                object_id = data["slides"][next]["visible"][i]
                if (slide["styles"][object_id] == undefined){
                    stylesheet += generate_css(slide_id, object_id, data["slides"][next]["styles"][object_id]);
                }
            }
        }


        // Generate styles for objects that are in the next slide, but not this one
        stylesheet += "\n/*The previous slide*/\n"
        prev = slide_id-1;
        if (prev >= 0) {
            for (i in data["slides"][prev]["visible"]) {
                object_id = data["slides"][prev]["visible"][i]
                if (slide["styles"][object_id] == undefined){
                    stylesheet += generate_css(slide_id, object_id, data["slides"][prev]["styles"][object_id]);
                }
            }
        }

        // Generate styles for this slide
        stylesheet += "\n/*This slide*/\n"
        for (object_id in slide["styles"]) {
            stylesheet += generate_css(slide_id, object_id, slide["styles"][object_id]);
        }

        // Make visible things visible
        stylesheet += "\n/*Visibility and pointer events*/\n"
        for (i in slide["visible"]) {
            object_id = slide["visible"][i]
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

    for(var item in data.objects){ //ITERATE OVER OBJECTS
        var type = (data.objects[item].type);
        if (type == "div"){ //CREATES DIV BY ADDING CONTENT
            var object = document.createElement(type)
            object.innerHTML = data.objects[item].content
        }
        else if (type == "img"){ //CREATES IMAGE
            var object = document.createElement(type)
            object.src = data.objects[item].src
        }
        object.id = "object-"+item;
        object.classList.add("object")
        slideshow.appendChild(object);
    }
}


//==============SCAN FOR KEY PRESSES=============================

document.onkeydown = function() { //CHECK FOR KEYPRESS
    var evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    if ([32,39].includes(charCode)){ //INCREMENT SLIDE
        if (slideId >= Object.keys(data.slides).length-1){
            var popup = window.confirm("Slideshow finished, exit?")
            if (popup){
                window.close();
            }
            else{

            }
        }
        else {
            slideId=(slideId+1);
        }
    }
    else if (charCode == 37){ //DECREMENT SLIDE
        if (slideId == 0){
        }
        else {
            slideId=(slideId-1);
        }
    }
    else if (charCode == 70){ //TOGGLE FULLSCREEN
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }

    }
    console.log("slide is: ", slideId)
    document.querySelector(".slideshow").id = "slide-"+slideId
};

function start_slides(data) {
    make_full_css(data);
    addObject(data);
}

var data = JSON.parse(localStorage.getItem("data"))
console.log(data)
start_slides(data)
