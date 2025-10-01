import DefaultTheme from "vitepress/theme";
import { Theme, useRoute } from "vitepress";
import "./tailwind.css";
import "./var.css";
import "./article.css";
import "./print.css";
// 引入elmeent-plux
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import LinkCard from "../components/LinkCard.vue";
import HText from "../components/HText.vue";
import Timeline from '../components/Timeline.vue';
import mediumZoom from "medium-zoom";
import { onMounted, watch, nextTick } from "vue";

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    ctx.app.component("LinkCard", LinkCard);
    ctx.app.component("HText", HText);
    ctx.app.component("Timeline", Timeline);
    // 使用 ElementPlus
    ctx.app.use(ElementPlus);
    
  },

  setup() {
    const route = useRoute();
    const initZoom = () => {
      mediumZoom(".main img", { background: "var(--vp-c-bg)", margin: 24 });
    };
    onMounted(() => initZoom());
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
} satisfies Theme;
