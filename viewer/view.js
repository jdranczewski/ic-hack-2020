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
                    "position": "auto, auto, 0, 0"
                }
            },
        }
    }
}

function generate_css(slide_id, object_id, styles, show) {
    current_style = "";
    if (show) {
        current_style += "opacity: 1;"
    }
    for (key in styles) {
        current_style += `${key}: ${styles[key]};`
    }
    return `#slide-${slide_id} #object-${object_id} {${current_style}}\n`
}

function render(data) {
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
                if (slide["visible"].indexOf(object_id) == -1){
                    stylesheet += generate_css(slide_id, object_id, data["slides"][next]["styles"][object_id], false);
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
                if (slide["visible"].indexOf(object_id) == -1){
                    stylesheet += generate_css(slide_id, object_id, data["slides"][prev]["styles"][object_id], false);
                }
            }
        }


        // Generate styles for this slide
        stylesheet += "\n/*This slide*/\n"
        for (object_id in slide["visible"]) {
            console.log("F")
            console.log(object_id)
            stylesheet += generate_css(slide_id, object_id, slide["styles"][object_id], true);
        }

    }

    // Add a style element
    style = document.createElement("style");
    style.innerHTML = stylesheet;
    document.body.appendChild(style)
    console.log(stylesheet);
}

render(data)
