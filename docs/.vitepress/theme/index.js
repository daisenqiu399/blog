import DefaultTheme from "vitepress/theme";
import "./tailwind.css";
import "./var.css";
import "./artical.css";

import LinkCard from "../components/LinkCard.vue";

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    ctx.app.component("LinkCard", LinkCard);
  },
};
