<template>
  <div>
    <title-name></title-name>
    <div class="ansa2Layout wrap">
      <div class="layout-inner">
        <div class="inner-left">
          <DxSelectBox
            class="devBox"
            :data-source="data.instanceList"
            display-expr="CODEVALUE"
            value-expr="CODEDEF"
            v-model:value="data.instanceCode"
            stylingMode="outlined"
            @value-changed="selectInstance"
            label="계측종류"
            height="30px"
          />
          <DxTreeList
            class="inner"
            id="controlGrid"
            key-expr="KEY_"
            parent-id-expr="PARENT_"
            root-value="null"
            :data-source="data.controlList"
            :show-borders="true"
            :show-row-lines="true"
            :focused-row-enabled="true"
            :column-auto-width="true"
            :auto-expand-all="true"
            :expanded-row-keys="data.expandedRowKeys"
            @selection-changed="selectControl"
          >
            <DxLoadPanel :enabled="true" />
            <DxSelection mode="single" />
            <DxColumn
              data-field="NAME_"
              caption="컨트롤포인트"
              :allow-sorting="false"
            />
          </DxTreeList>
        </div>
        <div class="inner-right">
          <div class="search-box">
            <div class="seach-boxText">기간</div>
            <DxDateBox
              class="devBox"
              type="datetime"
              :value="data.startDate"
              display-format="yyyy-MM-dd HH:mm"
              @value-changed="changeStartDate"
              applyButtonText="선택"
              cancelButtonText="취소"
              height="30px"
            />
            <div class="seach-boxText">~</div>
            <DxDateBox
              class="devBox"
              type="datetime"
              :value="data.endDate"
              display-format="yyyy-MM-dd HH:mm"
              @value-changed="changeEndDate"
              applyButtonText="선택"
              cancelButtonText="취소"
              height="30px"
            />
            <DxSelectBox
              class="devBox"
              :data-source="data.dataType"
              display-expr="CODEVALUE"
              value-expr="CODEDEF"
              v-model:value="data.dataCode"
              stylingMode="outlined"
              label="DATA"
              @value-changed="selectDataType"
              height="30px"
            />
            <DxButton
              class="search-btn"
              :width="150"
              :height="40"
              text="조회"
              type="default"
              :disabled="data.btnDisabled"
              @click="searchButton()"
            />
            <DxButton
              type="normal"
              :width="70"
              :height="40"
              :hoverStateEnabled="false"
              icon="revert"
              @click="revertData"
            />
          </div>
          <div class="inner-div">
            <div>
              <template v-if="data.selectControlList.length != 0">
                <ul>
                  <template
                    v-for="item in data.selectControlList"
                    :key="item.CONTROLPOINTID"
                  >
                    <li>
                      {{ item.NAME_ }}
                      <span>
                        <DxButton
                          type="normal"
                          styling-mode="outlined"
                          :hoverStateEnabled="false"
                          icon="minus"
                          @click="removeControl(item.CONTROLPOINTID)"
                        />
                      </span>
                    </li>
                  </template>
                </ul>
              </template>
            </div>
            <DxDataGrid
              id="resultListGrid"
              :data-source="data.gridMainList"
              :show-borders="true"
              :show-column-lines="true"
              :show-row-lines="false"
              :column-auto-width="true"
              :column-hiding-enabled="true"
              :rowAlternationEnabled="true"
              ><DxScrolling mode="virtual" />
              <DxLoadPanel :enabled="true" />
              <DxColumn
                data-field="DATATIME"
                caption="데이터시간"
                :hiding-priority="2"
              />
              <DxColumn
                data-field="CONTROLPOINTNAME"
                caption="관제포인트명"
                :allow-sorting="false"
              />
              <DxColumn
                data-field="CPVALUE"
                caption="검침값"
                :allow-sorting="false"
              />
              <DxColumn
                data-field="UNITDISP"
                caption="단위표현"
                :allow-sorting="false"
                :hiding-priority="1"
              />
            </DxDataGrid>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, reactive } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import { extra } from "@/utils/extra.js";
import DxSelectBox from "devextreme-vue/select-box";
import DxDateBox from "devextreme-vue/date-box";
import DxButton from "devextreme-vue/button";
import {
  DxTreeList,
  DxColumn,
  DxLoadPanel,
  DxSelection,
} from "devextreme-vue/tree-list";
import { DxDataGrid, DxScrolling } from "devextreme-vue/data-grid";

export default {
  data() {
    return {};
  },
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    const data = reactive({
      instanceList: [],
      instanceCode: null,
      dataType: [],
      dataCode: null,
      controlList: [],
      startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      endDate: new Date(),
      btnDisabled: false,
      expandedRowKeys: [],
      selectControlList: [],
      controlpointList: null,
      gridMainList: [],
    });

    onMounted(() => {
      getMainData();
      getCpTreeData();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_ANSA.GET_ANSA002_LOAD",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
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
      data.instanceList = result.resultSet[0];
      data.dataType = result.resultSet[2];
    }

    async function getCpTreeData() {
      const apiParams = {
        api: "PKG_MANAGER_ANSA.GET_ANSA002_CPTREE",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: data.instanceCode },
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
      data.controlList = result.resultSet[0];
      const uniqueUpcodes = Array.from(
        new Set(data.controlList.map((item) => item.KEY_))
      );
      uniqueUpcodes.sort();
      data.expandedRowKeys = uniqueUpcodes;
    }

    function selectInstance(e) {
      data.instanceCode = e.value;
      getCpTreeData();
    }

    function selectDataType(e) {
      data.dataCode = e.value;
    }
    function changeStartDate(e) {
      data.startDate = e.value;
    }

    function changeEndDate(e) {
      data.endDate = e.value;
    }

    function selectControl(e) {
      if (e.selectedRowsData[0].CONTROLPOINTID != null) {
        let findIndex = data.selectControlList.findIndex(
          (select) =>
            select.CONTROLPOINTID == e.selectedRowsData[0].CONTROLPOINTID
        );
        if (findIndex == -1) {
          data.selectControlList.push(e.selectedRowsData[0]);
          let datalist = data.selectControlList.map(
            (item) => item["CONTROLPOINTID"]
          );
          data.controlpointList = datalist;
        }
      }
    }
    function getControlPoints() {
      let controlpoints = "";
      for (const point of data.controlpointList) {
        controlpoints += `${point},`; // eslint-disable-line no-unused-vars
      }
      return controlpoints;
    }

    async function searchButton() {
      if (data.dataCode == null) {
        errorAlert("DATA를 선택하세요.");
        return;
      } else if (data.controlpointList == null) {
        errorAlert("선택된 컨트롤포인트가 없습니다");
        return;
      }
      const A_CONTROLPOINTIDS = getControlPoints();
      const startDate = extra.dataTimeToStr(data.startDate);
      const endDate = extra.dataTimeToStr(data.endDate);
      const apiParams = {
        api: "PKG_MANAGER_ANSA.GET_ANSA002_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "" }, //메뉴코드
          { dir: "in", val: A_CONTROLPOINTIDS }, //A_CONTROLPOINTIDS
          { dir: "in", val: startDate }, //A_STARTTIME
          { dir: "in", val: endDate }, //A_ENDTIME
          { dir: "in", val: data.dataCode }, //A_DATATYPE
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
      data.gridMainList = result.resultSet[0];
    }

    function removeControl(control) {
      let findIndex = data.selectControlList.findIndex(
        (select) => select.CONTROLPOINTID == control
      );
      if (findIndex > -1) {
        data.selectControlList.splice(findIndex, 1);
      }
    }
    function revertData() {
      data.selectControlList = [];
      data.dataCode = null;
      data.instanceCode = null;
      getMainData();
    }
    return {
      data,
      selectInstance,
      selectControl,
      selectDataType,
      searchButton,
      changeStartDate,
      changeEndDate,
      removeControl,
      revertData,
    };
  },
  components: {
    TitleName,
    DxSelectBox,
    DxDateBox,
    DxButton,
    DxTreeList,
    DxColumn,
    DxLoadPanel,
    DxSelection,
    DxDataGrid,
    DxScrolling,
  },
};
</script>

<style scoped>
.ansa2Layout {
  height: calc(100vh - 144px);
  padding: 10px;
}
.layout-inner {
  display: flex;
  height: 100%;
}
.inner-left {
  flex-basis: 20%;
  height: 100%;
}
.inner-right {
  flex-basis: 80%;
  height: 100%;
  padding-left: 10px;
}
.search-box {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  align-items: center;
}
.seach-boxText {
  width: 60px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
}
.devBox {
  flex: 1 1;
}
#controlGrid {
  height: calc(100vh - 205px);
  padding-top: 10px;
}
#controlGrid::v-deep .dx-treelist-headers .dx-treelist-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
#resultListGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
.inner-div {
  display: flex;
  height: calc(100vh - 218px);
}
.inner-div div:first-child {
  flex-basis: 20%;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
}
.inner-div div:nth-child(2) {
  flex-basis: 80%;
}
.search-btn {
  font-size: 1rem;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
}
li > span {
  margin-left: auto;
}
</style>
