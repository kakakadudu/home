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
  ],
});

export default router;
