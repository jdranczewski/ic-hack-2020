<template>
  <v-app id="textbox2">
    <div v-if="!editing">
      <span class="text" @click="enableEditing">{{value}}</span>
    </div>
    <div v-if="editing">
      <input v-model="tempValue" class="input" />
      <button @click="disableEditing">Cancel</button>
      <button @click="saveEdit">Save</button>
    </div>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    value: "Click Me!",
    tempValue: null,
    editing: false
  }),
  methods: {
    enableEditing: function() {
      this.tempValue = this.value;
      this.editing = true;
    },
    disableEditing: function() {
      this.tempValue = null;
      this.editing = false;
    },
    saveEdit: function() {
      // However we want to save it to the database
      this.value = this.tempValue;
      this.disableEditing();
    }
  }
};
