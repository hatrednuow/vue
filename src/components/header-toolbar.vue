<template>
  <!-- v-if="headerOpen" -->
  <transition>
    <div>
      <header
        class="header-component"
        :class="headerOpen ? 'showHeader' : 'hideHeader'"
      >
        <dx-toolbar class="header-toolbar">
          <dx-item
            :visible="menuToggleEnabled"
            location="before"
            css-class="menu-button"
          >
            <template #default>
              <dx-button
                icon="menu"
                styling-mode="text"
                @click="toggleMenuFunc"
              />
            </template>
          </dx-item>

          <dx-item
            v-if="title"
            location="before"
            css-class="header-title dx-toolbar-label"
            @click="goHome"
          >
            <div>{{ title }}</div>
          </dx-item>

          <dx-item>
            <header-menu></header-menu>
          </dx-item>

          <dx-item location="after">
            <div class="user-name">{{ userName }}</div>
          </dx-item>
          <dx-item location="after">
            <dx-button
              class="logoutBtn"
              type="normal"
              styling-mode="text"
              :hover-state-enabled="false"
              :focus-state-enabled="false"
              :active-state-enabled="false"
              :width="125"
              height="80%"
              text="로그아웃"
              @click="logOut"
            />
          </dx-item>
        </dx-toolbar>
      </header>
      <span class="hamburger" :class="{ on: headerOpen }"
        ><span @click.prevent="showHideHeader()"></span
      ></span>
    </div>
  </transition>
</template>

<script>
import HeaderMenu from "@/components/header-menu.vue";
import DxButton from "devextreme-vue/button";
import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, watch } from "vue";

export default {
  props: {
    menuToggleEnabled: Boolean,
    title: String,
    toggleMenuFunc: Function,
    logOutFunc: Function,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const userName = store.state.user.name;
    const headerOpen = ref(store.getters["menu/headerOpen"]);

    function goHome() {
      router.push("/home");
    }

    function logOut() {
      store.dispatch("user/logout");
      router.push("/login");
    }

    function hideHeader() {
      const pathStr = route.path.replace("/", "").slice(0, 3);
      if (pathStr == "MON") {
        headerOpen.value = false;
      } else {
        headerOpen.value = true;
      }
    }

    function showHideHeader() {
      headerOpen.value = !headerOpen.value;
      store.dispatch("menu/setHeaderOpen", headerOpen.value);
    }

    watch(
      () => route.path,
      () => {
        hideHeader();
      }
    );

    return {
      userName,
      goHome,
      logOut,
      headerOpen,
      showHideHeader,
    };
  },
  components: {
    DxButton,
    DxToolbar,
    DxItem,
    HeaderMenu,
  },
};
</script>

<style lang="scss">
@import "../themes/generated/variables.base.scss";
@import "../dx-styles.scss";

.header-component {
  flex: 0 0 auto;
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  .dx-toolbar .dx-toolbar-item.menu-button > .dx-toolbar-item-content .dx-icon {
    color: $base-accent;
  }
}

.header-component.showHeader {
  display: block;
}

.header-component.hideHeader {
  display: none;
}

/* .slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
} */

.dx-toolbar.header-toolbar .dx-toolbar-items-container .dx-toolbar-after {
  padding: 0 40px;

  .screen-x-small & {
    padding: 0 20px;
  }
}

.dx-toolbar .dx-toolbar-item.dx-toolbar-button.menu-button {
  width: $side-panel-min-width;
  text-align: center;
  padding: 0;
}

.header-title .dx-item-content {
  padding: 0;
  margin: 0;
}

.dx-theme-generic {
  .dx-toolbar {
    padding: 10px 0;
  }

  .user-button > .dx-button-content {
    padding: 3px;
  }
}
.dx-toolbar .dx-toolbar-item.path {
  vertical-align: bottom;
  padding-left: 20px;
  padding-bottom: 10px;
}
.logoutBtn {
  font-size: 1.05rem;
  margin-right: 20px;
}
.user-name {
  font-size: 1.05rem;
  font-weight: 500;
  line-height: normal;
}
span.hamburger {
  z-index: 99;
  position: absolute;
  top: 28px;
  right: 30px;
  display: block;
  width: 28px;
  height: 4px;
  &::after,
  &::before {
    content: "";
    position: absolute;
    display: block;
    // require로 준것이 아니라서 빌드한 경우 잘 동작하는지 확인 필요
    background: url(../assets/ic_util_menubar.png) no-repeat;
    height: 3px;
    width: 28px;
    right: 0;
    top: 0;
    transition: 0.3s;
  }
  &::after {
    top: -5px;
  }
  &::before {
    top: 5px;
  }
  &.on::after {
    transform: rotate(45deg);
    top: 1px;
  }
  &.on::before {
    transform: rotate(-45deg);
    top: 0px;
  }
  span {
    position: relative;
    display: block;
    width: inherit;
    height: 30px;
    top: -15px;
  }
}
</style>
