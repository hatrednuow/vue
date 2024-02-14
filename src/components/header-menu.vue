<template>
  <div>
    <DxMenu
      class="menu"
      :data-source="items"
      show-first-submenu-mode="onHover"
      orientation="horizontal"
      :hide-submenu-on-mouse-leave="true"
      display-expr="MENUNAME"
      @item-click="itemClick"
    />
    <div v-if="currentMenu" id="product-details">
      <div class="MENUNAME">{{ currentMenu.MENUNAME }}</div>
    </div>
  </div>
</template>

<script>
import { sizes } from "../utils/media-query";
import { onMounted, ref /* watch */ } from "vue";
import { useRouter } from "vue-router";
import DxMenu from "devextreme-vue/menu";
import { useStore } from "vuex";
import errorAlert from "@/components/error-alert.vue";

// db 로컬
import menulistLocal from '@/data/menulist'
import menuallLocal from '@/data/menuall'
import menugagongLocal from '@/data/menugagong'


export default {
  props: {},

  setup(/* props */) {
    const store = useStore();
    const router = useRouter();
    const isLargeScreen = sizes()["screen-large"];
    const items = ref([]);
    const currentMenu = ref(null);

    function itemClick(e) {
      currentMenu.value = e.itemData.MENUNAME;
      router.push(e.itemData.path);
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

    onMounted(async () => {
      let result;
      let menuList;
      // if (store.getters["menu/menuList"][0]) {
      // db 로컬
      if (store.getters["menu/menuList"][0] || menulistLocal[0]) {
        menuList = store.getters["menu/menuList"];
        // db 로컬
        menuList = menulistLocal;

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
        // result = await getMenuList();
        // db 로컬
        result = {
          result: true
        }
        if (!result.result) {
          errorAlert(result.errmsg);
        } else {
          // menuList = result.resultSet[0];
          // db 로컬
          menuList = menuallLocal

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
          // const menuCodeNameList = makeCodeNameList(menuList);
          // db 로컬
          const menuCodeNameList = menugagongLocal
          store.dispatch("menu/setMenuCodeNameList", menuCodeNameList);
        }
      }
    });

    return {
      currentMenu,
      items,
      itemClick,
    };
  },
  components: {
    DxMenu,
  },
};
</script>

<style>
.menu .dx-icon-folder {
  display: none !important;
}
</style>
