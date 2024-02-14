<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap">
      <DxDataGrid
        class="inner"
        id="formCodeGrid"
        key-expr="FORMCODE"
        :data-source="data.getFormList"
        :show-borders="true"
        :show-column-lines="true"
        :show-row-lines="false"
        :focused-row-enabled="true"
        :column-auto-width="true"
        :column-hiding-enabled="true"
        :rowAlternationEnabled="true"
      >
        <DxLoadPanel :enabled="true" />
        <DxScrolling mode="virtual" />
        <DxSelection mode="single" />
        <DxEditing :allow-adding="false" mode="row" />
        <dx-column
          data-field="FORMCODE"
          caption="화면코드"
          :allow-sorting="false"
        />
        <dx-column
          data-field="FORMNAME"
          caption="화면명"
          :allow-sorting="false"
        />
        <DxToolbar>
          <DxItem name="addRowButton" :disabled="true" />
        </DxToolbar>
        <DxSummary>
          <DxTotalItem column="FORMCODE" summary-type="count" />
        </DxSummary>
      </DxDataGrid>
    </div>
  </div>
</template>

<script>
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxSelection,
  DxSummary,
  DxTotalItem,
  DxScrolling,
  DxLoadPanel,
  DxToolbar,
  DxItem,
} from "devextreme-vue/data-grid";
import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      getFormList: [],
    });

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_SYSB.GET_SYSB001_DATA",
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
      data.getFormList = result.resultSet[0];
    }

    function updateHeight(n, o) {
      console.log(n, o)
      const layout = document.querySelector('#formCodeGrid')
      if(n == false) {
        layout.style.height = '91vh'
      } else {
        layout.style.height = '85vh'
      }
    }

    watch(() => store.state.menu.headerOpen, (newValue, oldValue) => {
      updateHeight(newValue, oldValue)
    })

    return { data };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxSelection,
    DxSummary,
    DxTotalItem,
    DxScrolling,
    DxLoadPanel,
    DxToolbar,
    DxItem,
    TitleName,
  },
};
</script>
<style scoped>
#formCodeGrid {
  height: calc(100vh - 140px);
}
#formCodeGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
