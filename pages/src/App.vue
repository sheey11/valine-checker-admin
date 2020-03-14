<template lang="pug">
  router-view
</template>

<script>
import Vue from "vue";
import ZeitUI from "@zeit-ui/vue";
import "@zeit-ui/vue/dist/zeit-ui.css";
import axios from "axios";

Vue.use(ZeitUI);
Vue.prototype.$http = axios

export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

body {
  box-sizing: border-box;
}
</style>
