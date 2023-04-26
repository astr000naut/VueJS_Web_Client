import { createApp } from "vue";
import App from "./App.vue";
import "./css/main.css";
import BaseButton from "./components/base/BaseButton.vue";
import BaseTextfield from "./components/base/BaseTextfield.vue";

const app = createApp(App);
app.component("BaseButton", BaseButton);
app.component("BaseTextfield", BaseTextfield);

app.mount("#app");
