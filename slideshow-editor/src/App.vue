<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" clipped permanent app>
      <v-list dense>
        <v-list-item-group color="primary">
          <v-list-item v-for="(s, i) in slides" :key="i">
            <v-list-item-content>
              <v-card
                outlined
                class="d-inline-block mx-auto"
                height="120px"
                :style="getCardStyle(s)"
              >{{i}}</v-card>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="blue darken-3" dark>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span>Best Slides App</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" item>
          <v-img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify" />
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-card class="d-inline-block mx-auto" height="600px" width="1000px">
          <!-- <v-row justify="space-between"> -->
          <!-- <v-img src="https://cdn.vuetifyjs.com/images/cards/store.jpg"></v-img> -->
          <!-- </v-row> -->
        </v-card>
        <!-- <v-row align="center" justify="center">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn :href="source" icon large target="_blank" v-on="on">
                <v-icon large>mdi-code-tags</v-icon>
              </v-btn>
            </template>
            <span>Source</span>
          </v-tooltip>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                large
                href="https://codepen.io/johnjleider/pen/MNYLdL"
                target="_blank"
                v-on="on"
              >
                <v-icon large>mdi-codepen</v-icon>
              </v-btn>
            </template>
            <span>Codepen</span>
          </v-tooltip>
        </v-row>-->
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
    slides: [
      {
        background_colour: "black",
        visible: [0],
        transition_time: 1,
        styles: []
      }
    ]
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

    getCardStyle(s) {
      return { "background-color": s.background_colour };
    }
  }
};
</script>