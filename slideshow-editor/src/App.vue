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
              </v-btn> <v-btn @click="removeSlide(currentSlide)">
                <v-icon>mdi-minus</v-icon>
              </v-btn><v-btn @click="copySlide(currentSlide)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-row>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="darken-3" dark>
      <!--<v-btn icon @click="addImage(currentSlide)">
        <v-icon>mdi-image</v-icon>
      </v-btn> -->
      <template>
      <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-btn icon @click="addImage(currentSlide)" dark right v-on="on">
        <v-icon left>mdi-image</v-icon>
      
      </v-btn>
      </template>
      <span>Add Image</span>
      </v-tooltip>
      </template>
      
      <!--<v-btn icon @click="addDiv(currentSlide)">
        <v-icon>mdi-code-tags</v-icon>
      </v-btn>

      <v-spacer></v-spacer> -->
    <template>
      <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-btn icon @click="addDiv(currentSlide)" dark right v-on="on">
        <v-icon left>mdi-code-tags</v-icon>
      
      </v-btn>
      </template>
      <span>Add Div element</span>
      </v-tooltip>
      </template>
      <v-btn icon v-if="selected_items.length > 0" @click="copySelectedObject">
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
      <v-btn icon v-if="clipboard !== null" @click="pasteFromClipboard">
        <v-icon>mdi-content-paste</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <!--
      <v-btn @click="generateOut" dark right>
        <v-icon left>mdi-floppy</v-icon>
      </v-btn>
      -->
    <template>
      <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-btn icon @click="generateOut" dark right v-on="on">
        <v-icon left>mdi-floppy</v-icon>
        </v-btn>
      </template>
      <span>Save presentation</span>
      </v-tooltip>
     </template>

      

    <template>
      <v-tooltip bottom>
      <template v-slot:activator="{ on }">

      <v-btn icon @click="loadIn" dark right v-on="on">
        <v-icon left>mdi-download</v-icon>
      
      </v-btn>
      </template>
      <span>Load presentation</span>
      </v-tooltip>
      </template>
      <v-btn @click="present" light right>
        <v-icon left>mdi-presentation-play</v-icon>Present
      </v-btn>
      
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
    <v-navigation-drawer permanent right app>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title" center>Properties</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

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
              <!-- <v-button v-if="i == 'background-color'">
                Colour
                <v-color-picker v-model="slides[currentSlide]['styles']['background-colour']"></v-color-picker>
              </v-button> -->

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
        </v-list-item-group>
      </v-list>

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
    </v-navigation-drawer>

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
  name: "",


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
        // console.log(rect, i);
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
        // console.log(rect, i);
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
        console.log(this.selected_items);
      };
    },

    itemDeselect(i) {
      return rect => {
        console.log(rect, i);
        // this.selected_items.pop(i)
        console.log(this.selected_items);
      };
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
        console.log(i);
        //console.log(this.slides[i]["styles"]["height"])
        for (var j in this.slides[i].styles) {
          //var box_height = this.$refs.renderbox.clientHeight -24;
          //var box_width = this.$refs.renderbox.clientWidth -24 ;
          var box_height = 600;
          var box_width = 1067;
          var angle = (this.slides[i].styles[j].angle * Math.PI) / 180;
          console.log(angle);
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
          //console.log("top is (in percent): ", top)
          console.log("box height: ", box_height);
          console.log("box width: ", box_width);

          var fontSize = 0;
          if (this.slides[i].styles[j]["font-size"]) {
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
      styles_str = styles_str
        .slice(1, -1)
        .split('"')
        .join("")
        .split(",")
        .join(";")
        .split("#arbitrary-style:")
        .join("");
      return styles_str;
      // return "background-color: #FF0000FF"
    },

    present() {
        //console.log(this);
        var transfer = {
            //"slides": this.slides,
            //"objects": this.objects,
            "slides" :JSON.parse(JSON.stringify(this.slides)),
            "objects" :JSON.parse(JSON.stringify(this.objects)),

        }
        this.scaleStyleDataBeforeTransfer(transfer)
        localStorage.setItem("data", JSON.stringify(transfer));
        window.open("/viewer.html", "Slideshow", "width=960, height=540");
      },
    generateOut(){
      var transfer = {
            "slides": this.slides,
            "objects": this.objects,
            //"slides" :JSON.parse(JSON.stringify(this.slides)),
            //"objects" :JSON.parse(JSON.stringify(this.objects)),

        }
        var fileName = prompt("What is presentation id in local storage?")
        localStorage.setItem(fileName, JSON.stringify(transfer));
        console.log(name)
        //window.open("/out.html", "outshow", "width=960, height=540");

    },
    loadIn(){
      var fileName = prompt("What is presentation id in local storage?")
      console.log("name", fileName)
      var loaded = localStorage.getItem(fileName)
      console.log("s2 is :",loaded)
      console.log(this.slides)
      console.log(this.objects)
      console.log("parse, stringify", JSON.parse(JSON.stringify(loaded)))
      this.slides = JSON.parse(loaded)["slides"]
      this.objects = JSON.parse(loaded)["objects"]
      console.log(this.slides)
      console.log(this.objects)

      //window.open("/out.html", "outshow", "width=960, height=540");
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
