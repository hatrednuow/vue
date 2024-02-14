<template>
  <div class="title-name">
    <div class="menu-title">
      {{ menuName }} 관제점통합감시
    </div>
    <div class="menu-path">
      {{ path }} 에너지모니터링-계측통합감시-관제점통합감시
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import menugagongLocal from '@/data/menugagong'

export default {
  props: {
    menuToggleEnabled: Boolean,
    title: String,
    toggleMenuFunc: Function,
    logOutFunc: Function,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const path = ref("");
    const menuName = ref("");

    const pathStr = route.path.replace("/", "");
    // const menuInfoList = store.getters["menu/menuCodeNameList"];
    // db 로컬    
    const menuInfoList = ref(menugagongLocal)

    function getMenuName() {
      const currentPathInfoList = filteredDataList(
        menuInfoList,
        pathStr,
        "MENUCODE"
      );
      return currentPathInfoList[0].MENUNAME;
    }

    function filteredDataList(targetDataArray, p_filterKey, targetKey) {
      let findIndex = p_filterKey.indexOf("-");
      if (findIndex > -1) {
        let splitName = p_filterKey.split("-");
        p_filterKey = splitName[0];
      }

      if (typeof p_filterKey === "string") {
        p_filterKey = p_filterKey.toLowerCase();
      }
      let filterKey = p_filterKey;
      let data = targetDataArray;
      if (filterKey) {
        // db 로컬로 할때 아래 코드 한줄넣어줘야함...
        data = JSON.parse(JSON.stringify(data._value))
        data = data.filter((row) => {
          return Object.keys(row).some((key) => {
            // return String(row[targetKey || key]).toLowerCase().indexOf(filterKey) > -1
            return String(row[targetKey || key]).toLowerCase() == filterKey;
          });
        });
      }
      return data;
    }

    function storeCurrentPath() {
      const pathStr = route.path.replace("/", "");
      if (pathStr != "home" && pathStr != "login") {
        store.dispatch("menu/setCurrentMenuCode", pathStr);
        const menuInfoList = menuInfoList;
        const currentPathInfoList = filteredDataList(
          menuInfoList,
          pathStr,
          "MENUCODE"
        );
        const groupMenuCodeInfoList = filteredDataList(
          menuInfoList,
          currentPathInfoList[0].GROUP_MENU,
          "MENUCODE"
        );
        const upmenuCodeInfoList = filteredDataList(
          menuInfoList,
          currentPathInfoList[0].UPMENUCODE,
          "MENUCODE"
        );
        path.value = `${groupMenuCodeInfoList[0].MENUNAME} > ${upmenuCodeInfoList[0].MENUNAME} > ${currentPathInfoList[0].MENUNAME}`;
      } else if (pathStr == "home") {
        store.dispatch("menu/resetCurrentMenuCode");
        path.value = "";
      }
    }

    onMounted(() => {
      // menuName.value = getMenuName();
      // storeCurrentPath();
    });

    watch(
      () => route.path,
      () => {
        // storeCurrentPath();
      }
    );

    return {
      path,
      menuName,
    };
  },
};
</script>
<style scoped>
.title-name {
  display: flex;
  align-items: center;
  padding: 15px;
  position: relative;
  z-index: 10;
  width: fit-content;
}

.menu-title {
  font-size: 1.55rem;
  letter-spacing: -0.5px;
  line-height: 40px;
  font-weight: 600;
  margin-right: 15px;
}

.menu-path {
  color: #666;
  font-size: 0.85rem;
}
</style>
