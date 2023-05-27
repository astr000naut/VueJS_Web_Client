import { createApp } from "vue";
import App from "./App.vue";
import "./css/main.css";
import BaseButton from "./components/base/BaseButton.vue";
import BaseTextfield from "./components/base/BaseTextfield.vue";
import router from "./js/router/router";
import commonVal from "./js/common/value";
import axios from "axios";

var Emitter = require("tiny-emitter");
const emitter = new Emitter();

const app = createApp(App);

// NEED Refactor - tach ra file rieng
app.component("BaseButton", BaseButton);
app.component("BaseTextfield", BaseTextfield);

app.provide("$emitter", emitter);
app.provide("$common", commonVal);
app.provide("$axios", axios);
app.use(router);
app.mount("#app");
