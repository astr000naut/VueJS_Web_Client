import { createApp } from "vue";
import App from "./App.vue";
import "./css/main.css";
import BaseButton from "./components/base/BaseButton.vue";
import BaseTextfield from "./components/base/BaseTextfield.vue";
import router from "./js/router/router";
import commonVal from "./js/common/value";
import axios from "axios";
import i18n from "./js/lang";

var Emitter = require("tiny-emitter");
const emitter = new Emitter();

const app = createApp(App);

app.component("BaseButton", BaseButton);
app.component("BaseTextfield", BaseTextfield);

app.use(i18n);
app.use(router);

app.provide("$emitter", emitter);
app.provide("$common", commonVal);
app.provide("$axios", axios);
app.mount("#app");
