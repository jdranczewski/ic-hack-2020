<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" permanent app>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title" center>Slides App</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item-group color="primary" v-model="currentSlide" mandatory>
          <v-list-item v-for="(s, i) in slides" :key="i">
            <v-list-item-content>
              <v-card
                outlined
                class="d-inline-block mx-auto"
                height="120px"
                :style="getCardStyle(s)"
                :dark="luminance(s['background_colour']) < 80"
                >
                  <v-card-title>{{i+1}}
                  </v-card-title>
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
                        <v-menu
                          :close-on-content-click="false"
                          :nudge-width="200"
                          offset-x
                        >
                          <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon><v-icon>mdi-format-color-fill</v-icon></v-btn>
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
      <v-spacer></v-spacer>
      <v-btn @click="present" light right>
        <v-icon left>mdi-presentation-play</v-icon>
        Present
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <v-card
          class="d-inline-block mx-auto"
          height="600px"
          width="1000px"
          :style="getCardStyle(slides[currentSlide])"
        >
          <div v-for="i in slides[currentSlide].visible" :key="i">
            <drr
              :x="slides[currentSlide].styles[i].x"
              :y="slides[currentSlide].styles[i].y"
              :w="slides[currentSlide].styles[i].width"
              :h="slides[currentSlide].styles[i].height"
              :angle="slides[currentSlide].styles[i].angle"
              :hasActiveContent="true"
              v-on="{change: itemChange(i)}"
            >
              <img v-if="objects[i].type == 'img'" :src="objects[i].src" class="slideObject" />
              <div v-if="objects[i].type == 'div'" class="slideObject">{{objects[i].content}}</div>
            </drr>
          </div>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    drawer: null,
    currentSlide: 0,
    slides: [
      {
        background_colour: "#FFFFFF",
        visible: [],
        transition_time: 0,
        styles: {}
      }
    ],
    objects: []
  }),

  methods: {
    addSlide(slide_index) {
      const slide = {
        background_colour: "#FFFFFF",
        visible: [],
        transition_time: 0,
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

    addImage(slide_index) {
      const style = { height: 100, width: 100, x: 100, y: 100, angle: 0 };
      this.slides[slide_index].styles[this.objects.length] = style;
      this.objects.push({
        type: "img",
        src:
          "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
      });
      this.slides[slide_index].visible.push(this.objects.length - 1);
    },

    addDiv(slide_index) {
      const style = { height: 100, width: 100, x: 100, y: 100, angle: 0 };
      this.slides[slide_index].styles[this.objects.length] = style;
      this.objects.push({
        type: "div",
        content: "Insert Text Here"
      });
      this.slides[slide_index].visible.push(this.objects.length - 1);
    },

    itemChange(i) {
      return rect => {
        console.log(rect, i);
        let style = this.slides[this.currentSlide].styles[i];
        style.width = rect.w;
        style.height = rect.h;
        style.x = rect.x;
        style.y = rect.y;
        style.angle = rect.angle;
      };
    },

    getCardStyle(s) {
      return { "background-color": s.background_colour };
    },

    luminance(hex) {
      var bigint = parseInt(hex.substring(1), 16);
      var r = (bigint >> 16) & 255;
      var g = (bigint >> 8) & 255;
      var b = bigint & 255;
      console.log(0.299*r + 0.587*g + 0.114*b);
      return (0.299*r + 0.587*g + 0.114*b);
    },

    present() {
        console.log(this);
        var transfer = {
            "slides": this.slides,
            "objects": this.objects
        }
        localStorage.setItem("data", JSON.stringify(transfer));
        window.open("/viewer.html", "Slideshow", "width=auto, height=auto");
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
