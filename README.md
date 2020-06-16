# CSSlides
**Winner in the Best Educational Hack category of [IC Hack 2020](https://ichack.org/)**

# What is it?
It's a slideshow editor focusing on giving you complete freedom in designing delightful transitions. Elements present on two slides will smoothly transform to their new position, rotation, scale, colour, and any other CSS parameter you may want! You can also design in and out transitions for appearing and disappearing elements.

Try it out! https://csslides.netlify.app/

![A screenshot of the application working](https://i.imgur.com/7bnXZBS.png "A screenshot of the application working")

# How does it work?
The editor is built on top of the [Vue.js](https://vuejs.org/) framework, using the [Vuetify](https://vuetifyjs.com/en/) library for the UI. This generates a JSON description of the slideshow (which describes all the objects and their styles on each slide). This is then passed to a viewer document, which uses it to construct all of the DOM elements, and generate CSS for the entire slideshow. The slide `div` element has an id that depends on which slide should be currently active. This way we can just change the id and let css (and the browser) handle all of the transitions, so there's very little js overhead during the presentation itself.

For now local storage of the browser is used to store presentations.

**Most of the code and build instructions are in the [`slideshow-editor`](slideshow-editor) folder!**
