<template>
  <div class="dx-swatch-additional side-navigation-menu" @click="forwardClick">
    <slot />
    <div class="menu-container">
      <dx-tree-view
        ref="treeViewRef"
        :items="items"
        key-expr="path"
        selection-mode="single"
        :focus-state-enabled="true"
        expand-event="click"
        @item-click="handleItemClick"
        width="100%"
      />
    </div>
  </div>
</template>

<script>
import DxTreeView from "devextreme-vue/tree-view";
import { sizes } from "../utils/media-query";
import { onMounted, ref, /* watch */ } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import errorAlert from "@/components/error-alert.vue";

export default {
  props: {
    compactMode: Boolean,
  },

  setup(props, context) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const isLargeScreen = sizes()["screen-large"];
    const items = ref([]);
    const treeViewRef = ref(null);

    function forwardClick(...args) {
      context.emit("click", args);
    }

    function handleItemClick(e) {
      // const proxy_target_copy = Object.assign({}, e.itemData);
      const proxy_target_copy = JSON.parse(JSON.stringify(e.itemData));
      if (!proxy_target_copy.path || props.compactMode) {
        return;
      }

      router.push(proxy_target_copy.path);
      const pointerEvent = e.event;
      pointerEvent.stopPropagation();
    }

    function updateSelection() {
      if (!treeViewRef.value || !treeViewRef.value.instance) {
        return;
      }

      treeViewRef.value.instance.selectItem(route.path);
      treeViewRef.value.instance.expandItem(route.path);
    }

    async function getMenuList() {
      const apiParams = {
        api: "PKG_MANAGER_MAIN.GET_USER_MENU",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: "IEMSDEV" },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result = await store.dispatch("api/kcfemsAPI", apiParams);
      return result;
    }

    function makeCodeNameList(list) {
      const templist = list.map((row) => {
        let arr = {};
        arr.MENUCODE = row.MENUCODE;
        arr.MENUNAME = row.MENUNAME;
        arr.GROUP_MENU = row.GROUP_MENU;
        arr.UPMENUCODE = row.UPMENUCODE;
        return arr;
      });
      return templist;
    }

    function makeMenuHierarchy(list) {
      const templist = list.map((row) => {
        row.path = `/${row.MENUCODE}`;
        row.text = row.MENUNAME;
        row.key = row.DISP_NO.replaceAll(". 0", "");
        if (row.DEPTH === 1) {
          row.icon = "folder";
        }
        if (row.DEPTH === 2) {
          row.text = `\u2000${row.MENUNAME}`;
        }
        if (row.DEPTH === 3) {
          row.text = `\u2000\u2003${row.MENUNAME}`;
        }
        return { ...row };
      });

      const makeBrandTree = (inputList, outputList, index, key) => {
        let tempList = [];
        // 상위메뉴와 하위메뉴 관계 => 0 > 01 > 011, 0 > 02 > 021,022
        tempList = inputList.filter(
          (row) =>
            row.key.length === index + 1 && row.key.substr(0, index) === key
        );

        // 해당하는 하위메뉴가 더이상 없을때 return
        if (tempList.length == 0) {
          return outputList;
        }

        for (let i = 0; i < tempList.length; i++) {
          if (tempList[i].items == undefined) {
            tempList[i].items = [];
          }
          // important!!!! children 배열을 던져줘야한다. index는 메뉴키의 자릿수로 이용함, 상위메뉴의 key도 줘야함.
          makeBrandTree(
            inputList,
            tempList[i].items,
            index + 1,
            tempList[i].key
          );
          outputList.push(tempList[i]);
        }

        return outputList;
      };

      const meunuTreeList = makeBrandTree(templist, [], 0, "");
      return meunuTreeList;
    }

    onMounted(async () => {
      updateSelection();
      if (props.compactMode) {
        treeViewRef.value.instance.collapseAll();
      }
      let result;
      let menuList;
      if (store.getters["menu/menuList"][0]) {
        menuList = store.getters["menu/menuList"];

        // 아래 8줄은 현재 if에도 아래 else문에도 존재함
        const menulisttemp = makeMenuHierarchy(menuList);
        const items2 = menulisttemp.map((item) => {
          if (item.path && !/^\//.test(item.path)) {
            item.path = `/${item.path}`;
          }
          return { ...item, expanded: isLargeScreen };
        });
        items.value = items2;
      } else {
        // 메뉴리스트 db 조회 및 가공
        result = await getMenuList();
        if (!result.result) {
          errorAlert(result.errmsg);
        } else {
          menuList = result.resultSet[0];
          // 처음에만 api 호출로 사용하고 이후로는 store 활용하기 위해서
          store.dispatch("menu/setMenuList", menuList);
          const menulisttemp = makeMenuHierarchy(menuList);
          const items2 = menulisttemp.map((item) => {
            if (item.path && !/^\//.test(item.path)) {
              item.path = `/${item.path}`;
            }
            return { ...item, expanded: isLargeScreen };
          });
          items.value = items2;

          // 메뉴 코드 및 이름 스토어 저장
          const menuCodeNameList = makeCodeNameList(menuList);
          store.dispatch("menu/setMenuCodeNameList", menuCodeNameList);
        }
      }
    });

   /*  watch(
      () => route.path,
      () => {
        updateSelection();
      }
    );

    watch(
      () => props.compactMode,
      () => {
        if (props.compactMode) {
          treeViewRef.value.instance.collapseAll();
        } else {
          updateSelection();
        }
      }
    ); */

    return {
      treeViewRef,
      items,
      forwardClick,
      handleItemClick,
      updateSelection,
    };
  },
  components: {
    DxTreeView,
  },
};
</script>

<style lang="scss">
@import "../dx-styles.scss";
@import "../themes/generated/variables.additional.scss";

.side-navigation-menu {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  width: 250px !important;
  border-right: 1px solid #dddddd;
  background-color: #f6f6f7;

  .menu-container {
    min-height: 100%;
    display: flex;
    flex: 1;

    .dx-treeview {
      // ## Long text positioning
      white-space: nowrap;
      // ##

      // ## Icon width customization
      .dx-treeview-item {
        padding-left: 0;
        padding-right: 0;

        .dx-icon {
          width: $side-panel-min-width !important;
          margin: 0 !important;
        }
      }
      // ##

      // ## Arrow customization
      .dx-treeview-node {
        padding: 0 0 !important;
      }

      .dx-treeview-toggle-item-visibility {
        right: 10px;
        left: auto;
      }

      .dx-rtl .dx-treeview-toggle-item-visibility {
        left: 10px;
        right: auto;
      }
      // ##

      // ## Item levels customization
      .dx-treeview-node {
        &[aria-level="1"] {
          font-weight: bold;
          border-bottom: 1px solid $base-border-color;
        }

        &[aria-level="2"] .dx-treeview-item-content {
          font-weight: normal;
          padding: 0 $side-panel-min-width;
        }
      }
      // ##
    }

    // ## Selected & Focuced items customization
    .dx-treeview {
      .dx-treeview-node-container {
        .dx-treeview-node {
          &.dx-state-selected:not(.dx-state-focused) > .dx-treeview-item {
            background: transparent;
          }

          &.dx-state-selected > .dx-treeview-item * {
            color: #333;
            font-weight: bold;
          }

          &:not(.dx-state-focused) > .dx-treeview-item.dx-state-hover {
            background-color: lighten($base-bg, 4);
          }
        }
      }
    }

    .dx-theme-generic .dx-treeview {
      .dx-treeview-node-container
        .dx-treeview-node.dx-state-selected.dx-state-focused
        > .dx-treeview-item
        * {
        color: inherit;
      }
    }
    // ##
  }
}
</style>
