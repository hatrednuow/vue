<template>
  <div>
    <title-name></title-name>
  </div>
  <div class="wrap">
    <DxDataGrid
      class="inner"
      id="glossaryGrid"
      key-expr="GLOSSARYCD"
      :data-source="data.getGlossaryList"
      :show-borders="true"
      :show-column-lines="true"
      :show-row-lines="false"
      :focused-row-enabled="true"
      :column-auto-width="true"
      :column-hiding-enabled="true"
      :rowAlternationEnabled="true"
      @init-new-row="initNewRow"
      @row-inserting="insertData"
      @editing-start="getUpdateInfo"
      @row-updating="updateGlossaryInfo"
      @row-removing="deleteData"
    >
      <DxEditing
        :allow-adding="true"
        :allow-updating="true"
        :allow-deleting="true"
        mode="row"
      >
        <DxTexts confirm-delete-message="삭제하시겠습니까?" />
      </DxEditing>
      <DxLoadPanel :enabled="true" />
      <DxScrolling mode="virtual" />
      <DxColumn
        data-field="GLOSSARYCD"
        caption="용어 코드"
        :allow-editing="data.editingYN"
        :width="190"
      >
        <DxRequiredRule message="용어코드를 입력해주세요." />
      </DxColumn>
      <DxColumn
        data-field="GLOSSARYKOR"
        caption="용어 한글명"
        :hiding-priority="3"
      >
        <DxRequiredRule message="한글용어명을 입력해주세요." />
      </DxColumn>
      <DxColumn
        data-field="GLOSSARYENG"
        caption="용어 영어명"
        :hiding-priority="2"
      />
      <DxColumn
        data-field="GLOSSARYCHA"
        caption="용어 중국명"
        :hiding-priority="1"
      />
      <DxColumn
        data-field="REMARKS"
        caption="비고"
        :hiding-priority="0"
        :allow-sorting="false"
      />
      <DxSummary>
        <DxTotalItem column="GLOSSARYCD" summary-type="count" />
      </DxSummary>
    </DxDataGrid>
  </div>
</template>
<script>
import DxDataGrid, {
  DxColumn,
  DxScrolling,
  DxEditing,
  DxTexts,
  DxRequiredRule,
  DxSummary,
  DxTotalItem,
  DxLoadPanel,
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
      getGlossaryList: [],
      editingYN: true,
    });

    const glossaryData = reactive({
      GLOSSARYCD: "",
      GLOSSARYKOR: "",
      GLOSSARYENG: "",
      GLOSSARYCHA: "",
      GLOSSARYTYPE: "",
      REMARKS: "",
    });

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_SYSA.GET_SYSA003_DATA",
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
      data.getGlossaryList = result.resultSet[0];
    }

    //등록
    function initNewRow() {
      data.editingYN = true;
    }

    async function insertData(e) {
      let keys = Object.keys(glossaryData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        glossaryData[fieldName] = e.data[fieldName];
        if (glossaryData[fieldName] == undefined) {
          glossaryData[fieldName] = null;
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_SYSA.PUT_SYSA003_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: glossaryData.GLOSSARYCD },
          { dir: "in", val: glossaryData.GLOSSARYKOR },
          { dir: "in", val: glossaryData.GLOSSARYENG },
          { dir: "in", val: glossaryData.GLOSSARYCHA },
          { dir: "in", val: glossaryData.GLOSSARYTYPE },
          { dir: "in", val: glossaryData.REMARKS },
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
    }

    //수정
    function getUpdateInfo(e) {
      data.editingYN = false;
      data.getUpdateData = e.data;
    }

    async function updateGlossaryInfo(e) {
      let param = {};
      let keys = Object.keys(data.getUpdateData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        if (e.newData[fieldName] != undefined) {
          param[fieldName] = e.newData[fieldName];
        } else {
          param[fieldName] = data.getUpdateData[fieldName];
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_SYSA.PUT_SYSA003_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: param.GLOSSARYCD },
          { dir: "in", val: param.GLOSSARYKOR },
          { dir: "in", val: param.GLOSSARYENG },
          { dir: "in", val: param.GLOSSARYCHA },
          { dir: "in", val: param.GLOSSARYTYPE },
          { dir: "in", val: param.REMARKS },
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
    }
    //삭제
    async function deleteData(e) {
      const apiParams = {
        api: "PKG_MANAGER_SYSA.DEL_SYSA003_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: e.key },
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
    }

    function updateHeight(n, o) {
      console.log(n, o)
      const layout = document.querySelector('#glossaryGrid')
      if(n == false) {
        layout.style.height = '91vh'
      } else {
        layout.style.height = '85vh'
      }
    }

    watch(() => store.state.menu.headerOpen, (newValue, oldValue) => {
      updateHeight(newValue, oldValue)
    })

    return {
      data,
      glossaryData,
      initNewRow,
      insertData,
      getUpdateInfo,
      updateGlossaryInfo,
      deleteData,
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxScrolling,
    DxEditing,
    DxTexts,
    DxRequiredRule,
    DxSummary,
    DxTotalItem,
    DxLoadPanel,
    TitleName,
  },
};
</script>
<style scoped>
#glossaryGrid {
  height: calc(100vh - 140px);
}
#glossaryGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
