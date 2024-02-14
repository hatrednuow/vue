import { createRouter, createWebHashHistory } from "vue-router";
import store from "@/store";

import Home from "./views/home-page";
import defaultLayout from "./layouts/side-nav-outer-toolbar";
import simpleLayout from "./layouts/single-card";

function loadView(view) {
  return () => import(/* webpackChunkName: "login" */ `./views/${view}.vue`);
}

function loadSysView(view) {
  return () => import(/* webpackChunkName: "sys" */ `./views/SYS/${view}.vue`);
}
function loadBasView(view) {
  return () => import(/* webpackChunkName: "bas" */ `./views/BAS/${view}.vue`);
}
function loadMonView(view) {
  return () => import(/* webpackChunkName: "mon" */ `./views/MON/${view}.vue`);
}
function loadAnsView(view) {
  return () => import(/* webpackChunkName: "ans" */ `./views/ANS/${view}.vue`);
}
function loadRptView(view) {
  return () => import(/* webpackChunkName: "rpt" */ `./views/RPT/${view}.vue`);
}
const router = new createRouter({
  routes: [
    {
      path: "/home",
      name: "home",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: Home,
    },
    {
      path: "/SYS",
      redirect: "/SYSA",
    },
    {
      path: "/SYSA",
      redirect: "/SYSA001",
    },
    {
      path: "/SYSA001",
      name: "sysa001",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-a001"),
    },
    {
      path: "/SYSA002",
      name: "sysa002",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-a002"),
    },
    {
      path: "/SYSA003",
      name: "sysa003",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-a003"),
    },
    {
      path: "/SYSA004",
      name: "sysa004",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-a004"),
    },
    {
      path: "/SYSA005",
      name: "sysa005",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-a005"),
    },
    {
      path: "/SYSA006",
      name: "sysa006",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-a006"),
    },
    {
      path: "/SYSB",
      redirect: "/SYSB001",
    },
    {
      path: "/SYSB001",
      name: "sysb001",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-b001"),
    },
    {
      path: "/SYSB002",
      name: "sysb002",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-b002"),
    },
    {
      path: "/SYSC",
      redirect: "/SYSC001",
    },
    {
      path: "/SYSC001",
      name: "sysc001",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-c001"),
    },
    {
      path: "/SYSC002",
      name: "sysc002",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-c002"),
    },
    {
      path: "/SYSD",
      redirect: "/SYSD001",
    },
    {
      path: "/SYSD001",
      name: "sysd001",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-d001"),
    },
    {
      path: "/SYSD002",
      name: "sysd002",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadSysView("sys-d002"),
    },
    {
      path: "/BAS",
      redirect: "/BASA",
    },
    {
      path: "/BASA",
      redirect: "/BASA001",
    },
    {
      path: "/BASA001",
      name: "basa001",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadBasView("bas-a001"),
    },
    {
      path: "/BASA002",
      name: "basa002",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadBasView("bas-a002"),
    },
    {
      path: "/BASA003",
      name: "basa003",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadBasView("bas-a003"),
    },
    {
      path: "/BASA004",
      name: "basa004",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadBasView("bas-a004"),
    },
    {
      path: "/BASA005",
      name: "basa005",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadBasView("bas-a005"),
    },
    {
      path: "/BASA006",
      name: "basa006",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadBasView("bas-a006"),
    },
    {
      path: "/BASA007",
      name: "basa007",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadBasView("bas-a007"),
    },
    {
      path: "/BASM",
      redirect: "/BASM001",
    },
    {
      path: "/BASM001",
      name: "basm001",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadBasView("bas-m001"),
    },
    {
      path: "/MON",
      redirect: "/MONA",
    },
    {
      path: "/MONA",
      redirect: "/MONA001",
    },
    {
      path: "/MONA001",
      name: "mona001",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadMonView("mon-a001"),
    },
    {
      path: "/MONA002",
      name: "mona002",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadMonView("mon-a002"),
    },
    {
      path: "/MONA003",
      name: "mona003",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadMonView("mon-a003"),
    },
    {
      path: "/MONA003-1",
      name: "mona003-1",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadMonView("mon-a003-1"),
    },
    {
      path: "/MONA004",
      name: "mona004",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadMonView("mon-a004"),
    },
    {
      path: "/MONA005",
      name: "mona005",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadMonView("mon-a005"),
    },
    {
      path: "/MONA006",
      name: "mona006",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadMonView("mon-a006"),
    },
    {
      path: "/MONA007",
      name: "mona007",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadMonView("mon-a007"),
    },
    {
      path: "/MONA008",
      name: "mona008",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadMonView("mon-a008"),
    },
    {
      path: "/ANS",
      redirect: "/ANSA",
    },
    {
      path: "/ANSA",
      redirect: "/ANSA001",
    },
    {
      path: "/ANSA001",
      name: "ansa001",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadAnsView("ans-a001"),
    },
    {
      path: "/ANSA002",
      name: "ansa002",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadAnsView("ans-a002"),
    },
    {
      path: "/RPT",
      redirect: "/RPTA",
    },
    {
      path: "/RPTA",
      redirect: "/RPTA001",
    },
    {
      path: "/RPTA001",
      name: "rpta001",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadRptView("rpt-a001"),
    },
    {
      path: "/RPTA002",
      name: "rpta002",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadRptView("rpt-a002"),
    },
    {
      path: "/rmonitoring/data",
      name: "rmonitoringData",
      meta: {
        requiresAuth: true,
        layout: defaultLayout,
      },
      component: loadView("rmonitoring-data"),
    },
    {
      path: "/login",
      name: "login",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "로그인",
      },
      component: loadView("login-form"),
    },
    // redirect
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/recovery",
      redirect: "/home",
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/home",
    },
  ],
  history: createWebHashHistory(),
});

router.beforeEach((to, from, next) => {
  const userInfo = store.getters["user/userInfo"];
  let isLogin = userInfo.groupCode == "" ? false : true;
  // if (to.name === "login" && isLogin == true) {
  //   next({ name: "home" });
  // }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isLogin == false) {
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
