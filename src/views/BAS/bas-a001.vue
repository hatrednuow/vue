<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap">
      <dx-data-grid
        class="inner"
        id="Grid"
        key-expr="SERVICELOADID"
        :data-source="data.processLoader"
        :show-borders="true"
        :show-column-lines="true"
        :show-row-lines="false"
        :focused-row-enabled="true"
        :column-auto-width="true"
        :column-hiding-enabled="true"
        @init-new-row="initNewRow"
        @row-inserting="insertData"
        @editing-start="getUpdateInfo"
        @row-updating="updateSystemInfo"
      >
        <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
        <dx-column
          data-field="SERVICELOADID"
          caption="프로세스로드ID"
          :hiding-priority="7"
          :allow-editing="false"
        >
          <DxRequiredRule message="필수 값입니다." />
        </dx-column>
        <dx-column
          data-field="SERVICELOADNAME"
          caption="프로세스로드명"
          :hiding-priority="6"
          :allow-editing="data.editingYN"
        />
        <dx-column
          data-field="SERVICELOADIP"
          caption="프로세스로드IP"
          :allow-sorting="false"
          :hiding-priority="5"
          :allow-editing="data.editingYN"
        />
        <dx-column
          data-field="SCHEDULE_PROSESS_YN"
          caption="스케쥴사용여부"
          :allow-sorting="false"
          :hiding-priority="5"
          >
          <dx-lookup
            display-expr="value"
            value-expr="key"
            :data-source="data.useFlag"
          />
        </dx-column>
        <dx-column
          data-field="TRIGGER_PROSESS_YN"
          caption="트리거사용여부"
          :allow-sorting="false"
          :hiding-priority="4"
          >
          <dx-lookup
            display-expr="value"
            value-expr="key"
            :data-source="data.useFlag"
          />
        </dx-column>
        <!-- <dx-column
          data-field="SERVICELOADNAME_ENG"
          caption="프로세스로드명_영어"
          :allow-sorting="false"
          :hiding-priority="1"
        />
        <dx-column
          data-field="SERVICELOADNAME_CHA"
          caption="프로세스로드명_중국어"
          :allow-sorting="false"
          :hiding-priority="0"
        /> -->
        <dx-column
          data-field="REMARKS"
          caption="비고"
          :allow-sorting="false"
          :hiding-priority="3"
        />
        <dx-column
          data-field="USEFLAG"
          caption="사용여부"
          :allow-sorting="false"
          :hiding-priority="2"
          :width="100"
        >
          <dx-lookup
            display-expr="value"
            value-expr="key"
            :data-source="data.useFlag"
          />
          <DxRequiredRule message="필수 값입니다." />
        </dx-column>
        <DxSummary>
          <DxTotalItem column="SERVICELOADID" summary-type="count" />
        </DxSummary>      
      </dx-data-grid>
    </div>
  </div>
</template>

<script>
import DxDataGrid, {
  DxColumn,
  DxLookup,
  DxEditing,
  DxRequiredRule,
  DxSummary,
  DxTotalItem,
} from "devextreme-vue/data-grid";
import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import { utilNumber } from "@/utils/utilNumber";
import { utilArray } from "@/utils/utilArray";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    const data = reactive({
      processLoader: [],
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
      editingYN: true,
      processLoaderIdList : [],
    });

    const processLoaderData = reactive({
      REMARKS: "",
      SCHEDULE_PROSESS_YN: "",
      SERVICELOADID: "",
      SERVICELOADIP: "",
      SERVICELOADNAME: "",
      SERVICELOADNAME_CHA: "",
      SERVICELOADNAME_ENG: "",
      TRIGGER_PROSESS_YN: "",
      USEFLAG: ""
    })
    
    onMounted(() => {
      getMainData();
    });
    async function getMainData() {
      const params = {
        api: "PKG_MANAGER_BASA.GET_BASA001_LOAD",
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
      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
      data.processLoader = result.resultSet[0];
      utilArray.ascSort(data.processLoader, 'SERVICELOADID')

      const idList = []
      data.processLoader.forEach(load => {
        idList.push(load.SERVICELOADID)
      })
      data.processLoaderIdList = idList;
    }

    function getUpdateInfo(e) {
      data.editingYN = false;
      data.getUpdateData = e.data;
    }

    async function updateSystemInfo(e) {
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
        api: "PKG_MANAGER_BASA.PUT_BASA001_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA001" }, //메뉴코드
          { dir: "in", val: param.SERVICELOADID },
          { dir: "in", val: param.SERVICELOADNAME },
          { dir: "in", val: param.SERVICELOADIP },
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.REMARKS },
          { dir: "in", val: param.SERVICELOADNAME_ENG },
          { dir: "in", val: param.SERVICELOADNAME_CHA },
          { dir: "in", val: param.SCHEDULE_PROSESS_YN },
          { dir: "in", val: param.TRIGGER_PROSESS_YN },
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


    //등록
    function initNewRow(e) {
      if (data.processLoaderIdList.length === 0) {
        e.data.SERVICELOADID = 'IEMS_001';  
      }

      data.processLoaderIdList.sort();
      const lastValue = data.processLoaderIdList[data.processLoaderIdList.length - 1];

      // 마지막 값을 분리하여 접두사와 숫자 부분을 구분
      const prefix = lastValue.substring(0, 5);
      const number = parseInt(lastValue.substring(5));

      e.data.SERVICELOADID = prefix + utilNumber.pad(number + 1, 3);
      e.data.SCHEDULE_PROSESS_YN = 'N'
      e.data.TRIGGER_PROSESS_YN = 'N'
      e.data.USEFLAG = 'Y'


      data.editingYN = true;
    }

    async function insertData(e) {
      let keys = Object.keys(processLoaderData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        processLoaderData[fieldName] = e.data[fieldName];
        if (processLoaderData[fieldName] == undefined) {
          processLoaderData[fieldName] = null;
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_BASA.PUT_BASA001_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA001" }, //메뉴코드
          { dir: "in", val: processLoaderData.SERVICELOADID },
          { dir: "in", val: processLoaderData.SERVICELOADNAME },
          { dir: "in", val: processLoaderData.SERVICELOADIP },
          { dir: "in", val: processLoaderData.USEFLAG },
          { dir: "in", val: processLoaderData.REMARKS },
          { dir: "in", val: processLoaderData.SERVICELOADNAME_ENG },
          { dir: "in", val: processLoaderData.SERVICELOADNAME_CHA },
          { dir: "in", val: processLoaderData.SCHEDULE_PROSESS_YN },
          { dir: "in", val: processLoaderData.TRIGGER_PROSESS_YN },
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
      const layout = document.querySelector('#Grid')
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
      getUpdateInfo,
      updateSystemInfo,
      insertData,
      initNewRow
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxLookup,
    DxRequiredRule,
    DxEditing,
    DxSummary,
    DxTotalItem,
    TitleName
  },
};
</script>
<style scoped>
#Grid {
  height: calc(100vh - 140px);
}
#Grid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
