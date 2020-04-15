<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" permanent app>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title" center>CSSlides</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item-group color="pink" v-model="currentSlide" mandatory>
          <v-list-item v-for="(s, i) in slides" :key="i">
            <v-list-item-content>
              <v-card
                outlined
                class="d-inline-block mx-auto"
                height="120px"
                :style="getCardStyle(s)"
                :dark="luminance(s['background_colour']) < 80"
              >
                <v-card-title>{{i+1}}</v-card-title>
                <v-card-subtitle>
                  <v-container>
                    <v-row>
                      <v-col></v-col>
                      <v-col class="pa-0" :cols="3.5">
                        <v-text-field
                          suffix="s"
                          v-model="slides[i]['transition_time']"
                          label="Time"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col :cols="3">
                        <v-menu :close-on-content-click="false" :nudge-width="200" offset-x>
                          <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon>
                              <v-icon>mdi-format-color-fill</v-icon>
                            </v-btn>
                          </template>

                          <v-card>
                            <v-color-picker v-model="slides[currentSlide]['background_colour']"></v-color-picker>
                          </v-card>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-subtitle>
              </v-card>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <v-row align="center" justify="center">
          <div class="pa-2">
            <v-btn-toggle rounded>
              <v-btn @click="addSlide(currentSlide)" color="pink" dark>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn @click="removeSlide(currentSlide)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <v-btn @click="copySlide(currentSlide)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-row>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="darken-3" dark>
      <v-btn icon @click="addImage(currentSlide)">
        <v-icon>mdi-image</v-icon>
      </v-btn>
      <v-btn icon @click="addDiv(currentSlide)">
        <v-icon>mdi-code-tags</v-icon>
      </v-btn>
      <v-btn icon v-if="selected_items.length > 0" @click="copySelectedObject">
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
      <v-btn icon v-if="clipboard !== null" @click="pasteFromClipboard">
        <v-icon>mdi-content-paste</v-icon>
      </v-btn>
      <v-btn icon v-if="selected_items.length > 0" @click="itemDelete">
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn @click="login" dark icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn @click="generateOut" dark icon>
        <v-icon>mdi-floppy</v-icon>
      </v-btn>
      <v-btn icon @click="loadIn" dark>
        <v-icon>mdi-download</v-icon>
      </v-btn>
      <v-btn @click="present" light right>
        <v-icon left>mdi-presentation-play</v-icon>Present
      </v-btn>

      <!--<template>
      
      <v-card>
        <v-card-title>
          <span class="headline">Output file</span>
        </v-card-title>
        <v-text-field v-model="name" label="Slideshow name" required></v-text-field>
      <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click='loadIn("name"), dialog = false'>Output</v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
      </template> -->

    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <v-card
          id="renderbox"
          ref="renderbox"
          class="d-inline-block mx-auto"
          height="600px"
          width="1067px"
          :style="getCardStyle(slides[currentSlide])"
        >
          <div v-for="i in slides[currentSlide].visible" :key="i">
            <drr
              :x="slides[currentSlide].styles[i].x"
              :y="slides[currentSlide].styles[i].y"
              :w="slides[currentSlide].styles[i].width"
              :h="slides[currentSlide].styles[i].height"
              :angle="slides[currentSlide].styles[i].angle"
              v-on="{change: itemChange(i), select: itemSelect(i), deselect: itemDeselect(i)}"
            >
              <img
                v-if="objects[i].type == 'img'"
                :src="objects[i].src"
                class="slideObject"
                :style="make_style(slides[currentSlide].styles[i])"
              />
              <div
                v-if="objects[i].type == 'div'"
                class="slideObject"
                :style="make_style(slides[currentSlide].styles[i])"
              >{{objects[i].content}}</div>
            </drr>
          </div>
        </v-card>
      </v-container>
    </v-content>
    
    <v-navigation-drawer right app>
      
      <v-list v-if="seen" id ="hide">
        <v-card><v-card-text class="headline mb-1" ><p class = "text-center">Properties</p></v-card-text></v-card>
        
        <v-list-item-group color="pink" v-if="selected_items.length > 0" mandatory>
          
          
          <v-list-item v-if="objects[last_item()]['type']=='img'">
            <v-list-item-content>
              <v-text-field label="src" v-model="objects[last_item()]['src']"></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item-content>
              <v-text-field label="text" v-model="objects[last_item()]['content']"></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-for="(s, i) in slides[currentSlide]['styles'][last_item()]" :key="i">
            <v-list-item-content>
                    <v-col :cols="3" v-if="i =='color'" >
                        <v-menu
                          :close-on-content-click="false"
                          :nudge-width="200"
                          offset-x
                        >
                          <template v-slot:activator="{ on }">
                            <v-btn v-on="on">Colour</v-btn>
                          </template>

                          <v-card>
                            <v-color-picker v-model="slides[currentSlide]['styles'][last_item()]['color']"></v-color-picker>

                          </v-card>
                        </v-menu>
                    </v-col>
                    <v-col :cols="3" v-else-if="i == 'background-color'" >
                        <v-menu
                          :close-on-content-click="false"
                          :nudge-width="200"
                          offset-x
                        >
                          <template v-slot:activator="{ on }">
                            <v-btn v-on="on">Background-colour</v-btn>
                          </template>

                          <v-card>

                            <v-color-picker v-model="slides[currentSlide]['styles'][last_item()]['background-color']" ></v-color-picker>
                          </v-card>
                        </v-menu>
                    </v-col>

              <v-text-field v-else
                :label="i"
                :type="(['angle', 'x', 'y', 'width', 'height'].includes(i)) ? 'number' : 'text'"
                v-model="slides[currentSlide]['styles'][last_item()][i]"
              ></v-text-field>

            </v-list-item-content> <!--ADD A CHECK FOR COLOUR, THEN ADD COLOUR PICKER ELEMENT <v-color-picker v-model="slides[currentSlide]['background_colour']"></v-color-picker> -->
          </v-list-item>
        <v-list-item>
          <v-list-item-content>
                <v-btn  v-on:click="switchToCSSPane">CSS <v-icon>mdi-arrow-right</v-icon></v-btn>
          </v-list-item-content>
        </v-list-item>
        </v-list-item-group>
        
      </v-list>
      <v-list v-show="!seen" id ="hide">
        <v-card><v-card-text class="headline mb-1" ><p class = "text-center">CSS</p></v-card-text></v-card>
        
        <v-list-item>
          <textarea id="CSS" ref ="CSS" rows="20" auto-grow counter= 250>test</textarea>
        </v-list-item>
        <v-list-item>
          <v-btn  v-on:click="switchToPropPane"><v-icon>mdi-arrow-left</v-icon>Properties</v-btn>
        </v-list-item>
      </v-list>
      </v-navigation-drawer>
    

      <template v-slot:append>
        <v-row align="center" justify="center">
          <div class="pa-2">
            <v-btn @click="copyElement(currentSlide-1)" icon>
              <v-icon style="transform: scaleX(-1)" left>mdi-content-duplicate</v-icon>
            </v-btn>
            <v-btn-toggle rounded>
              <v-btn @click="editStyleOverlay(currentSlide-1)">
                <v-icon>mdi-chevron-double-left</v-icon>
              </v-btn>
              <v-btn @click="editStyleOverlay(currentSlide+1)">
                <v-icon>mdi-chevron-double-right</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-btn @click="copyElement(currentSlide+1)" icon>
              <v-icon right>mdi-content-duplicate</v-icon>
            </v-btn>
          </div>
        </v-row>
      </template>
    
    <v-overlay
        :value="overlay"
        z-index="100"
    >
    <v-card id="renderbox" ref="renderbox"
      class="d-inline-block mx-auto"
      height="600px"
      width="1067px"
      :style="getCardStyle(slides[currentSlide])"
    >
      <div v-for="i in slides[slide_overlay].visible" :key="i"  style="opacity: 0.25">
        <drr
          :x="slides[slide_overlay].styles[i].x"
          :y="slides[slide_overlay].styles[i].y"
          :w="slides[slide_overlay].styles[i].width"
          :h="slides[slide_overlay].styles[i].height"
          :angle="slides[slide_overlay].styles[i].angle"
          :selectable="false"
        >
          <img v-if="objects[i].type == 'img'" :src="objects[i].src" class="slideObject" :style="make_style(slides[slide_overlay].styles[i])"/>
          <div v-if="objects[i].type == 'div'" class="slideObject" :style="make_style(slides[slide_overlay].styles[i])">{{objects[i].content}}</div>
        </drr>
      </div>
      <div v-if="object_overlay !== null">
        <drr
          :x="slides[slide_overlay].styles[object_overlay].x"
          :y="slides[slide_overlay].styles[object_overlay].y"
          :w="slides[slide_overlay].styles[object_overlay].width"
          :h="slides[slide_overlay].styles[object_overlay].height"
          :angle="slides[slide_overlay].styles[object_overlay].angle"
          v-on="{change: itemChangeOverlay()}"
        >
          <img v-if="objects[object_overlay].type == 'img'" :src="objects[object_overlay].src" class="slideObject" :style="make_style(slides[slide_overlay].styles[object_overlay])"/>
          <div v-if="objects[object_overlay].type == 'div'" class="slideObject" :style="make_style(slides[slide_overlay].styles[object_overlay])">{{objects[object_overlay].content}}</div>
        </drr>
      </div>
    </v-card>
    <v-row align="center" justify="center">
      <v-btn
        color="success"
        class="mt-2"
        @click="overlay = !overlay"
      >
        Done!
      </v-btn>
    </v-row>
    </v-overlay>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    drawer: null,
    currentSlide: 0,
    selected_item: null,
    selected_items: [],
    clipboard: null,
    seen: true,
    slides: [
      {
        background_colour: "#FFFFFF",
        visible: [],
        transition_time: 1,
        styles: {}
      }
    ],
    objects: [],
    overlay: false,
    slide_overlay: 0,
    object_overlay: null
  }),
  name: "slide-editor",

  methods: {
    addSlide(slide_index) {
      const slide = {
        background_colour: "#FFFFFF",
        visible: [],
        transition_time: 1,
        styles: {}
      };

      this.slides.splice(slide_index + 1, 0, slide);
      this.currentSlide = slide_index + 1;
    },

    removeSlide(slide_index) {
      if (this.slides.length > 1) {
        this.slides.splice(slide_index, 1);
      }
      if (this.slides.length == slide_index) {
        this.currentSlide = slide_index - 1;
      } else {
        this.currentSlide = slide_index;
      }
    },

    copySlide(slide_index) {
      this.slides.splice(
        slide_index,
        0,
        JSON.parse(JSON.stringify(this.slides[slide_index]))
      );
      this.currentSlide = slide_index + 1;
    },

    copyElement(into_s) {
      if (this.slides[into_s] !== undefined && this.selected_items.length > 0) {
        this.slides[into_s].visible.push(this.last_item());
        this.slides[into_s].styles[this.last_item()] = JSON.parse(
          JSON.stringify(
            this.slides[this.currentSlide].styles[this.last_item()]
          )
        );
        this.currentSlide = into_s;
      }
    },

    editStyleOverlay(into_s) {
      console.log(this.slides);
      console.log("into_s", into_s);
      if (this.slides[into_s] !== undefined && this.selected_items.length > 0) {
        console.log("We're in", this.overlay);
        this.slide_overlay = into_s;
        this.object_overlay = this.last_item();
        this.slides[into_s].styles[this.last_item()] = JSON.parse(
          JSON.stringify(
            this.slides[this.currentSlide].styles[this.last_item()]
          )
        );
        this.overlay = !this.overlay;
        console.log("We're out", this.overlay);
      }
      console.log(this.slides);
    },

    addImage(slide_index) {
      const style = {
        height: 100,
        width: 100,
        x: 100,
        y: 100,
        angle: 0,
        "background-color": "#00000000",
        "border-radius": 0,
        "#arbitrary-style": ""
      };
      this.slides[slide_index].styles[this.objects.length] = style;
      this.objects.push({
        type: "img",
        src:
          "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081"
      });
      this.slides[slide_index].visible.push(this.objects.length - 1);
    },

    addDiv(slide_index) {
      const style = {
        height: 100,
        width: 100,
        x: 100,
        y: 100,
        angle: 0,
        "font-family": "Arial, Helvetica, sans-serif",
        "font-size": "2vh",
        "text-align": "center",
        color: "#000000FF",
        "background-color": "#00000000",
        "border-radius": 0,
        "#arbitrary-style": ""
      };
      this.slides[slide_index].styles[this.objects.length] = style;
      this.objects.push({
        type: "div",
        content: "Insert Text Here"
      });
      this.slides[slide_index].visible.push(this.objects.length - 1);
    },

    itemChange(i) {
      return rect => {
        let style = this.slides[this.currentSlide].styles[i];
        style.width = rect.w;
        style.height = rect.h;
        style.x = rect.x;
        style.y = rect.y;
        style.angle = rect.angle;
      };
    },

    itemChangeOverlay() {
      return rect => {
        let style = this.slides[this.slide_overlay].styles[this.object_overlay];
        style.width = rect.w;
        style.height = rect.h;
        style.x = rect.x;
        style.y = rect.y;
        style.angle = rect.angle;
      };
    },

    itemSelect(i) {
      return rect => {
        console.log(rect);
        this.selected_items.push(i);
        this.selected_item = i;
        //console.log(this.selected_items);
      };
    },

    itemDeselect(i) {
      return rect => {
        console.log(rect, i);
        //this.selected_items.pop(i)
        //console.log(this.selected_items);
      };
    },

    itemDelete(i) { //sets item to not visible on slide so is "deleted", should preserve
      console.log("selected item: ",this.selected_item, "whatever i is: ", i)
      console.log("style of selected object: ", this.slides[this.currentSlide].styles[this.selected_item])
      this.slides[this.currentSlide].visible.pop(this.selected_item)
    },

    copySelectedObject() {
      this.clipboard = { obj: this.last_item(), fromSlide: this.currentSlide };
    },

    pasteFromClipboard() {
      if (this.clipboard !== null && !this.slides[this.currentSlide].visible.includes(this.clipboard.obj)) {
        this.slides[this.currentSlide].visible.push(this.clipboard.obj);
        this.slides[this.currentSlide].styles[this.clipboard.obj] = JSON.parse(JSON.stringify(
          this.slides[this.clipboard.fromSlide].styles[this.clipboard.obj]));
      }
    },

    last_item() {
      return this.selected_items[this.selected_items.length - 1];
    },

    getCardStyle(s) {
      return { "background-color": s.background_colour };
    },

    scaleStyleDataBeforeTransfer(transfer) {
      for (var i in this.slides) {
        for (var j in this.slides[i].styles) {
          var box_height = 600;
          var box_width = 1067;
          //var angle = (this.slides[i].styles[j].angle * Math.PI) / 180;

          transfer.slides[i].styles[j]["width"] =
            (100 * this.slides[i].styles[j].width) / box_width + "%";
          transfer.slides[i].styles[j]["height"] =
            (100 * this.slides[i].styles[j].height) / box_height + "%";
          transfer.slides[i].styles[j]["left"] =
            (100 *
              (this.slides[i].styles[j].x -
                this.slides[i].styles[j].width / 2)) /
              box_width +
            "%";
          transfer.slides[i].styles[j]["top"] =
            (100 *
              (this.slides[i].styles[j].y -
                this.slides[i].styles[j].height / 2)) /
              box_height +
            "%";
          transfer.slides[i].styles[j]["transform"] =
            "rotate(" + this.slides[i].styles[j].angle + "deg)";
          console.log(
            "left is (in percent): ",
            transfer.slides[i].styles[j]["left"]
          );
          console.log(
            "angle is (in percent): ",
            "rotate(" + this.slides[i].styles[j].angle + "deg)"
          );

          if (this.slides[i].styles[j]["font-size"] != undefined) {
            var fontSize = this.slides[i].styles[j]["font-size"];
            if (fontSize.endsWith("vh")) {
              const n = parseInt(fontSize.substring(0, fontSize.length - 2));
              transfer.slides[i].styles[j]["font-size"] =
                (n * window.innerHeight) / box_height + "vh";
            }
          }
        }
      }
    },

    luminance(hex) {
      var bigint = parseInt(hex.substring(1), 16);
      var r = (bigint >> 16) & 255;
      var g = (bigint >> 8) & 255;
      var b = bigint & 255;
      console.log(0.299 * r + 0.587 * g + 0.114 * b);
      return 0.299 * r + 0.587 * g + 0.114 * b;
    },

    make_style(styles) {
      var styles_str = JSON.stringify(styles);
      console.log("input data",styles_str)
      styles_str = styles_str
        .slice(1, -1)
        .split('"')
        .join("")
        .split(",")
        .join(";")
        .split("#arbitrary-style:")
        .join("");
      //console.log(styles_str)
      return styles_str;
      // return "background-color: #FF0000FF"
    },

    switchToCSSPane(){ //function that sets textarea text to CSS of selected object
      this.seen = !this.seen
      
      var current_style = this.slides[this.currentSlide].styles[this.selected_item]
      var current_style_string = this.make_style(current_style)
      var edited_current_style_string = current_style_string.replace(/;/g, "; \n")

      this.$refs.CSS.value = edited_current_style_string
    },

    switchToPropPane(){
      var current_style_string = this.$refs.CSS.value
      this.seen = !this.seen
      //var edited_current_style_string = current_style_string
      var edited_current_style_string = current_style_string.replace(/\r?\n|\r/g, ', "')
      
      var output_style_string = edited_current_style_string.replace(/; /g, '').
        replace(/:/g, '":'); //ERROR HERE
      output_style_string = '{"' + output_style_string
      var colour_string = output_style_string.match(/"background-color":(.*).{1,9}/)[1].slice(0,9)
      var regex1 = new RegExp(colour_string, "g")
      output_style_string = output_style_string.replace(regex1, '"'+colour_string+'"')
      console.log(output_style_string)
      var arbitrary_string = output_style_string.match(/"border-radius":[^,],*(.*)/)
      console.log(arbitrary_string)
      arbitrary_string = arbitrary_string[1]
      if (arbitrary_string != ' "'){
        var regex2 = new RegExp(arbitrary_string, "g")
        output_style_string = output_style_string.replace(regex2, '"#arbitrary-style":"'+arbitrary_string.replace(/"/g,"").replace(/, /g, ';')+'"}')
      } 
      else {
        output_style_string = output_style_string.slice(0,-3)+', "#arbitrary-style":""}'
      }
      console.log(arbitrary_string)
      //output_style_string = output_style_string
      console.log("output data", output_style_string)
      this.slides[this.currentSlide].styles[this.selected_item] = JSON.parse(output_style_string)
    },

    present() {
        var transfer = {
            "slides" :JSON.parse(JSON.stringify(this.slides)),
            "objects" :JSON.parse(JSON.stringify(this.objects)),
        }
        this.scaleStyleDataBeforeTransfer(transfer)
        localStorage.setItem("data", JSON.stringify(transfer));
        window.open("/viewer.html", "Slideshow", "width=960, height=540");
      },


    login(){
      window.location = "/login.html"
    },

    generateOut(){
      var transfer = {
            "slides": this.slides,
            "objects": this.objects,

        }
        var fileName = prompt("What is presentation id in local storage?")
        localStorage.setItem(fileName, JSON.stringify(transfer));
        console.log(name)
    },
    loadIn(){
      var fileName = prompt("What is presentation id in local storage?")
      var loaded = localStorage.getItem(fileName)
      this.slides = JSON.parse(loaded)["slides"]
      this.objects = JSON.parse(loaded)["objects"]
    }
  }
};
</script>

<style scoped>
.slideObject {
  width: 100%;
  height: 100%;
}
</style>
