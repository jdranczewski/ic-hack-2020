<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" permanent app>
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Slides App</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item-group color="primary">
          <v-list-item v-for="(s, i) in slides" :key="i" @click="currentIndex=i">
            <v-list-item-content>
              <v-card
                outlined
                class="d-inline-block mx-auto"
                height="120px"
                :style="getCardStyle(s)"
              >{{i+1}}</v-card>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="blue darken-3" dark>
      <v-btn icon @click="addImage(currentIndex)">
        <v-icon>mdi-image</v-icon>
      </v-btn>
      <v-btn icon @click="addDiv(currentIndex)">
        <v-icon>mdi-code-tags</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-card
          class="d-inline-block mx-auto"
          height="600px"
          width="1000px"
          :style="getCardStyle(slides[currentIndex])"
        >
          <div v-for="i in slides[currentIndex].visible" :key="i">
            <drr :x="100" :y="100" :w="100" :h="100" :angle="0" v-on="{change: itemChange(i)}">
              <img
                v-if="objects[i].type == 'img'"
                :src="objects[i].src"
                style="width: 100%; height: 100%"
              />
              <div
                v-if="objects[i].type == 'div'"
                style="width: 100%; height: 100%"
              >{{objects[i].content}}</div>
            </drr>
          </div>
        </v-card>
      </v-container>
      <v-btn bottom color="pink" dark fab fixed right @click="addSlide()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    drawer: null,
    currentIndex: 0,
    slides: [
      {
        background_colour: "white",
        visible: [],
        transition_time: 1,
        styles: []
      }
    ],
    objects: []
  }),

  methods: {
    addSlide() {
      const slide = {
        background_colour: "white",
        visible: [],
        transition_time: 0,
        styles: []
      };

      this.slides.push(slide);
    },

    addImage(slide_index) {
      const style = { height: 100, width: 100, x: 0, y: 0 };
      this.slides[slide_index].styles.push(style);
      this.objects.push({
        type: "img",
        src:
          "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
      });
      this.slides[slide_index].visible.push(this.objects.length - 1);
    },

    addDiv(slide_index) {
      const style = { height: 100, width: 100, x: 0, y: 0 };
      this.slides[slide_index].styles.push(style);
      this.objects.push({
        type: "div",
        content: "Insert Text Here"
      });
      this.slides[slide_index].visible.push(this.objects.length - 1);
    },

    // itemChange(i) {
    //   return rect => {
    //     let style = this.slides[this.currentIndex].styles[i];

    //     style.width = rect.w;
    //     style.height = rect.h;
    //     style.left = rect.x - rect.w / 2;
    //     style.top = rect.y - rect.h / 2;

    //     console.log(rect, i, style);
    //   };

    itemChange(i) {
      return rect => {
        console.log(rect, i);
      };
    },

    getCardStyle(s) {
      return { "background-color": s.background_colour };
    }
  }
};
</script>

<style scoped>
.slideobject {
  width: 100%;
  height: 100%;
}
</style>