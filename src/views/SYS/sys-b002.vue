<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap">
      <DxTreeList
        class="inner"
        id="menuCodeGrid"
        key-expr="VMENUCODE"
        parent-id-expr="UPMENUCODE"
        root-value="IEMS"
        :data-source="data.getMenuList"
        :show-borders="true"
        :show-row-lines="true"
        :column-auto-width="true"
        :auto-expand-all="true"
        :expanded-row-keys="data.expandedRowKeys"
      >
        <DxLoadPanel :enabled="true" />
        <DxColumn data-field="MENUNAME" caption="메뉴명" />
        <DxColumn data-field="VMENUCODE" caption="메뉴코드" />
        <DxColumn data-field="FORMCODE" caption="화면코드" />
      </DxTreeList>
    </div>
  </div>
</template>

<script>
import { DxTreeList, DxColumn, DxLoadPanel } from "devextreme-vue/tree-list";
import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      getMenuList: [],
      expandedRowKeys: [],
    });

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_SYSB.GET_SYSB002_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result = await store.dispatch("api/kcfemsAPI", apiParams);

      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
      data.getMenuList = result.resultSet[0];
      data.getMenuList.filter((item) => {
        if (item.MENUCODE.length <= 4) {
          data.expandedRowKeys.push(item.MENUCODE);
          return data.expandedRowKeys;
        }
      });
    }

    function updateHeight(n, o) {
      console.log(n, o);
      const layout = document.querySelector("#menuCodeGrid");
      if (n == false) {
        layout.style.height = "91vh";
      } else {
        layout.style.height = "85vh";
      }
    }

    watch(
      () => store.state.menu.headerOpen,
      (newValue, oldValue) => {
        updateHeight(newValue, oldValue);
      }
    );

    return {
      data,
    };
  },
  components: {
    DxTreeList,
    DxColumn,
    DxLoadPanel,
    TitleName,
  },
};
</script>
<style scoped>
#menuCodeGrid {
  height: calc(100vh - 140px);
}
#menuCodeGrid::v-deep .dx-treelist-headers .dx-treelist-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
