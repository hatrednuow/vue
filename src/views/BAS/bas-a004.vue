<template>
  <div>
    <div>
      <title-name></title-name>
      <div class="wrap">
        <div class="grid-box inner">
          <DxDataGrid
            id="collectorGrid"
            key-expr="COLLECTORID"
            :data-source="data.collector"
            :show-borders="true"
            :show-column-lines="true"
            :show-row-lines="false"
            :focused-row-enabled="true"
            :column-auto-width="true"
            :column-hiding-enabled="true"
            :rowAlternationEnabled="true"
            @init-new-row="initNewRow"
            @selection-changed="onFocusedCollector"
            @row-inserting="insertData"
            @editing-start="getUpdateInfo"
            @row-updating="updatecollectorInfo"
            >
            <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
            <DxScrolling mode="virtual" />
            <DxSelection mode="single" />
            <DxColumn 
              data-field="COLLECTORID" 
              caption="수집기ID" 
              :allow-editing="data.editingYN" 
              >
              <DxRequiredRule message="필수 값입니다." />
            </DxColumn>
            <DxColumn data-field="COLLECTORNAME" caption="수집기명" :allow-editing="data.editingYN" />
            <DxColumn data-field="CONTROLYN" caption="서버제어여부">
              <dx-lookup
                display-expr="value"
                value-expr="key"
                :data-source="data.useFlag"
              />
            </DxColumn>
            <DxColumn data-field="ONOFFYN" caption="ON/OFF제어여부">
              <dx-lookup
                display-expr="value"
                value-expr="key"
                :data-source="data.useFlag"
              />
            </DxColumn>
            <DxColumn data-field="REMARKS" caption="비고" />
            <DxColumn data-field="USEFLAG" caption="사용여부">
              <dx-lookup
                display-expr="value"
                value-expr="key"
                :data-source="data.useFlag"
              />
              <DxRequiredRule message="필수 값입니다." />
            </DxColumn>
            <DxColumn data-field="COLLECTORNAME_ENG" caption="수집기명_영어" />
            <DxColumn data-field="COLLECTORNAME_CHA" caption="수집기명_중국어" />
            <DxSummary>
              <DxTotalItem column="COLLECTORID" summary-type="count" />
            </DxSummary>
          </DxDataGrid>
          <DxDataGrid
            id="collectorAttrGrid"
            key-expr="COLLECTORATTRID"
            ref="collectorAttrGridRef"
            :data-source="data.collectorAttr"
            :show-borders="true"
            :show-column-lines="true"
            :show-row-lines="false"
            :column-auto-width="true"
            :column-hiding-enabled="true"
            :rowAlternationEnabled="true"
            @init-new-row="initNewRowAttr"
            @row-inserting="insertAttrData"
            @editing-start="getUpdateAttrInfo"
            @row-updating="updatecollectorAttrInfo"
          >
            <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
            <DxColumn
              data-field="COLLECTORATTRID"
              caption="수집기속성ID"
              :allow-editing="data.editingYN"
            >
              <DxRequiredRule message="필수 값입니다." />
            </DxColumn>
            <DxColumn
              data-field="COLLECTORATTRNAME"
              caption="수집기속성명"
              :hiding-priority="2"
              :allow-editing="data.editingYN"
            />
            <DxColumn data-field="REMARKS" caption="비고" />
            <DxColumn data-field="USEFLAG" caption="사용여부">
              <dx-lookup
                display-expr="value"
                value-expr="key"
                :data-source="data.useFlag"
              />
              <DxRequiredRule message="필수 값입니다." />
            </DxColumn>
            <!-- <DxColumn data-field="COLLECTORNAME_ENG" caption="수집기명_영어" />
            <DxColumn data-field="COLLECTORNAME_CHA" caption="수집기명_중국어" /> -->
            <DxToolbar>
              <DxItem name="addRowButton" :disabled="data.disableYN" />
            </DxToolbar>
            <DxSummary>
              <DxTotalItem column="COLLECTORATTRID" summary-type="count" />
            </DxSummary>
          </DxDataGrid>
        </div>
      </div>
    </div>
   
  </div>
</template>

<script>
import DxDataGrid, {
  DxScrolling,
  DxSelection,
  DxColumn,
  DxLookup,
  DxEditing,
  DxSummary,
  DxTotalItem,
  DxToolbar,
  DxRequiredRule,
  DxItem,
} from "devextreme-vue/data-grid";
import { useStore } from "vuex";
import { onMounted, reactive, ref, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    const collectorAttrGridRef = ref(null);

    const data = reactive({
      collector: [],
      collectorAttr: [],
      disableYN: true,
      selectCollector: null,
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
      editingYN: true,
    });
    
    const collectorData = reactive({
      COLLECTORID: "",
      COLLECTORNAME: "",
      COLLECTORNAME_CHA: "",
      COLLECTORNAME_ENG: "",
      CONTROLYN: "",
      ONOFFYN: "",
      REMARKS: "",
      USEFLAG: ""
    })

    const collectorAttrData = reactive({
      COLLECTORATTRID: "",
      COLLECTORATTRNAME: "",
      COLLECTORATTRNAME_CHA: "",
      COLLECTORATTRNAME_ENG: "",
      COLLECTORID: "",
      REMARKS: "",
      USEFLAG: ""
    })

    onMounted(() => {
      getMainData();
    });
    async function getMainData() {
      const params = {
        api: "PKG_MANAGER_BASA.GET_BASA004_LOAD",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };

      const result = await store.dispatch("api/kcfemsAPI", params);
      if (result.result == true) {
        // console.log('185', result.resultSet)
      }

      const apiParams = {
        api: "PKG_MANAGER_BASA.GET_BASA004_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA004" }, //메뉴코드
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };

      const result1 = await store.dispatch("api/kcfemsAPI", apiParams);
      if (result1.result != true) {
        errorAlert(result1.errmsg);
        return;
      }
      data.collector = result.resultSet[0]
    }

    function onFocusedCollector(e) {
      if (e.selectedRowKeys.length == 0) {
        return;
      }
      data.disableYN = false; //단위타입선택안하면 등록row생성x
      data.selectCollector = e.selectedRowKeys[0];
      getCollectorAttr();
    }

    async function getCollectorAttr() {
      const attrParams = {
        api: "PKG_MANAGER_BASA.GET_BASA004_ATTR",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: data.selectCollector }, 
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };

      const result2 = await store.dispatch("api/kcfemsAPI", attrParams);
      if(!result2.result) {
        errorAlert(result2.errmsg);
        return;
      }
        data.collectorAttr = result2.resultSet[0]
        collectorAttrGridRef.value.instance.cancelEditData();
    }

    async function insertData(e) {
      let keys = Object.keys(collectorData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        collectorData[fieldName] = e.data[fieldName];
        if (collectorData[fieldName] == undefined) {
          collectorData[fieldName] = null;
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_BASA.PUT_BASA004_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: collectorData.COLLECTORID },
          { dir: "in", val: collectorData.COLLECTORNAME },
          { dir: "in", val: collectorData.CONTROLYN },
          { dir: "in", val: collectorData.ONOFFYN },
          { dir: "in", val: collectorData.REMARKS },
          { dir: "in", val: collectorData.USEFLAG },
          { dir: "in", val: collectorData.COLLECTORNAME_ENG },
          { dir: "in", val: collectorData.COLLECTORNAME_CHA },
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
      getCollectorAttr();
    }

    //등록
    function initNewRow() {
      data.editingYN = true;
    }

    // Attr 등록
    function initNewRowAttr() {
      data.editingYN = true;
    }
   
    async function insertAttrData(e) {
      let keys = Object.keys(collectorAttrData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        collectorAttrData[fieldName] = e.data[fieldName];
        if (collectorAttrData[fieldName] == undefined) {
          collectorAttrData[fieldName] = null;
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_BASA.PUT_BASA004_ATTR",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: data.selectCollector }, // 콜렉터
          { dir: "in", val: collectorAttrData.COLLECTORATTRID },
          { dir: "in", val: collectorAttrData.COLLECTORATTRNAME },
          { dir: "in", val: collectorAttrData.REMARKS },
          { dir: "in", val: collectorAttrData.USEFLAG },
          { dir: "in", val: collectorAttrData.COLLECTORATTRNAME_ENG },
          { dir: "in", val: collectorAttrData.COLLECTORATTRNAME_CHA },
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
      getCollectorAttr();
    }

    //수정
    function getUpdateAttrInfo(e) {
      data.editingYN = false;
      data.getUpdateData = e.data;
    }
    
    //수정
    function getUpdateInfo(e) {
      data.editingYN = false;
      data.getUpdateData = e.data;
    }

    async function updatecollectorAttrInfo(e) {
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
        api: "PKG_MANAGER_BASA.PUT_BASA004_ATTR",
        params: [
        { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: param.COLLECTORID },
          { dir: "in", val: param.COLLECTORATTRID },
          { dir: "in", val: param.COLLECTORATTRNAME },
          { dir: "in", val: param.REMARKS },
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.COLLECTORATTRNAME_ENG },
          { dir: "in", val: param.COLLECTORATTRNAME_CHA },
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

    async function updatecollectorInfo(e) {
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
        api: "PKG_MANAGER_BASA.PUT_BASA004_DATA",
        params: [
        { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: param.COLLECTORID },
          { dir: "in", val: param.COLLECTORNAME },
          { dir: "in", val: param.CONTROLYN },
          { dir: "in", val: param.ONOFFYN },
          { dir: "in", val: param.REMARKS },
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.COLLECTORNAME_ENG },
          { dir: "in", val: param.COLLECTORNAME_CHA },
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
      const layout = document.querySelector('#collectorGrid')
      const layout2 = document.querySelector('#collectorAttrGrid')
      if(n == false) {
        layout.style.height = '91vh'
        layout2.style.height = '91vh'
      } else {
        layout.style.height = '85vh'
        layout2.style.height = '85vh'
      }
    }

    watch(() => store.state.menu.headerOpen, (newValue, oldValue) => {
      updateHeight(newValue, oldValue)
    })

    return {
      data,
      collectorAttrGridRef,
      onFocusedCollector,
      initNewRow,
      initNewRowAttr,
      insertData,
      insertAttrData,
      getUpdateAttrInfo,
      getUpdateInfo,
      updatecollectorAttrInfo,
      updatecollectorInfo
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxSelection,
    DxScrolling,
    DxLookup,
    DxEditing,
    DxSummary,
    DxTotalItem,
    DxToolbar,
    DxRequiredRule,
    DxItem,
    TitleName,
  },
};
</script>
<style scoped>
#collectorGrid {
  height: calc(100vh - 140px);
  flex-basis: 40%;
}
#collectorAttrGrid {
  height: calc(100vh - 140px);
  padding: 0px 0 0 15px;
  flex-basis: 60%;
}
#collectorGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td,
#collectorAttrGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
.grid-box {
  display: flex;
}
</style>
