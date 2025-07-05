import { createRouter, createWebHistory } from "vue-router";
import Desktop from "@/views/Desktop.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Desktop",
      component: Desktop,
    },
    {
      path: "/echarts",
      name: "Echarts",
      component: () => import("@/views/Echarts.vue"),
    },
  ],
});

export default router;
