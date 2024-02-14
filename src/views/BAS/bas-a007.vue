<template>
  <div>
    <div>
      <title-name></title-name>
      <div class="wrap">
        <div class="grid-box inner">
          <DxDataGrid
            id="controlPointGrid"
            key-expr="CONTROLPOINTID"
            ref="controlPointGridRef"
            :data-source="data.controlPointList"
            :show-borders="true"
            :show-column-lines="true"
            :show-row-lines="false"
            :focused-row-enabled="true"
            :column-auto-width="true"
            :column-hiding-enabled="true"
            :rowAlternationEnabled="true"
            @selection-changed="onSelectionChanged"
            :selected-row-keys="selectedRowkeys"
            >
            <DxEditing mode="row" />
            <DxScrolling mode="virtual" />
            <DxSelection mode="multiple" />
            <DxFilterRow :visible="true" />
            <DxSearchPanel :visible="false" /> <!-- true로 변경시 검색됨 디자인이 필요해보임 -->
            <DxColumn 
              data-field="CONTROLPOINTNAME" 
              caption="관제포인트명" 
              :allow-editing="data.editingYN" 
              >
            </DxColumn>
            <DxColumn 
              data-field="CONTROLPOINTID" 
              caption="관제포인트ID" 
              :allow-editing="data.editingYN" 
              >
            </DxColumn>
            <DxColumn 
              data-field="GATEWAYNAME" 
              caption="IOT장비명" 
              :allow-editing="data.editingYN" 
              :hiding-priority="1"
              >
            </DxColumn>
            <DxSelection
              show-check-boxes-mode="onClick"
              mode="multiple"
            />
            <DxSummary>
              <DxTotalItem column="CONTROLPOINTNAME" summary-type="count" />
            </DxSummary>
          </DxDataGrid>
          <DxTreeList
            id="cpgroupListAttrGrid"
            key-expr="CODE"
            ref="cpgroupListAttrGridRef"
            :data-source="data.cpgroupAttrList"
            parent-id-expr="UPCODE"
            :auto-expand-all="true"
            :expanded-row-keys="data.expandedRowKeys"
            :show-borders="true"
            :show-column-lines="true"
            :show-row-lines="false"
            :column-auto-width="true"
            :column-hiding-enabled="true"
            :rowAlternationEnabled="true"
            :focused-row-enabled="true"
          >
            
            <DxColumn
              data-field="NAME"
              caption="관제포인트그룹명"
              :allow-editing="data.editingYN"
            >
            </DxColumn>
            <DxColumn data-field="REMARKS" caption="비고"  />
            <DxColumn data-field="USEFLAG" caption="사용여부">
              <dx-lookup
                display-expr="value"
                value-expr="key"
                :data-source="data.useFlag"
              />
              <DxRequiredRule message="필수 값입니다." />
            </DxColumn>
            <DxColumn caption="" cell-template="temp-edit" />
            <template #temp-edit="{ data: cellData }">
              <ul>
                <li>
                  <div
                    class="dx-icon-edit btn-com"
                    @click="onTempEditClick(cellData.data)"
                    >
                    수정
                  </div>
                </li>
                <li>
                  <div
                    class="dx-icon-add btn-com"  
                    @click="onTempGoupAddClick(cellData.data)"
                    v-if="cellData.data.CPTYPE != 1"
                    >
                    그룹추가
                  </div>
                </li>
                <li>
                  <div
                    class="dx-icon-add btn-com"  
                    @click="onTempCPAddClick(cellData.data)"
                    v-if="cellData.data.CPTYPE != 1"
                    >
                    컨트롤포인트추가
                  </div>
                </li>
              </ul>
              
            </template>
  
            <DxToolbar>
              <DxItem name="addRowButton" :disabled="data.disableYN" />
            </DxToolbar>
            <DxSummary>
              <DxTotalItem column="NAME" summary-type="count" />
            </DxSummary>
          </DxTreeList>
        </div>
      </div>
      <DxPopup
          v-model:visible="editData.showEditPopup"
          :show-close-button="false"
          :show-title="true"
          :title="(editData.addType && '컨트롤포인트그룹 추가' ) || (editData.selectRow.CPTYPE != 1 ? `컨트롤포인트그룹 수정` : '컨트롤포인트 수정')"
          :width="800"
          :height="750"
        >
        <div v-show="editData.selectRow.CPTYPE == 1">
          <p>관제포인트명</p>
          <div class="cpgrouppointname">{{editData.selectRow.NAME}}</div>
          <p>효율속성</p>
          <DxLookup
            :data-source="data.efficiencyattrList"
            :value="editData.selectRow.EFFICIENCYTYPE"
            v-model="editData.selectRow.EFFICIENCYTYPE"
            value-expr="CODEDEF"
            display-expr="CODEVALUE"
          />
          <p>유저컨트롤초기사용여부</p>
          <DxLookup
            :data-source="data.useFlag"
            :value="editData.selectRow.STARTDISP_YN"
            v-model="editData.selectRow.STARTDISP_YN"
            value-expr="key"
            display-expr="value"
          />
        </div>

        <div v-show="editData.selectRow.CPTYPE != 1">
          <ul class="popupList">
            <li>
              <p>관제포인트그룹명</p>
              <DxTextBox
                :value="editData.selectRow.NAME"
                v-model="editData.selectRow.NAME"
              />
            </li>
            <li>
              <p>관제포인트그룹타입</p>
              <DxLookup
                :data-source="data.cpgroupTypeList"
                :value="editData.selectRow.CPGROUPTYPE"
                v-model="editData.selectRow.CPGROUPTYPE"
                value-expr="CODEDEF"
                display-expr="CODEVALUE"
              />
            </li>
            <li>
              <p>에너지원</p>
              <DxLookup
                :data-source="data.energyTypeList"
                :value="editData.selectRow.ENERGYTYPE"
                v-model="editData.selectRow.ENERGYTYPE"
                value-expr="CODEDEF"
                display-expr="CODEVALUE"
              />
            </li>
            <li>
              <p>효율단위</p>
              <DxLookup
                :data-source="data.efficiencyunitList"
                :value="editData.selectRow.EFFICIENCYUNIT"
                v-model="editData.selectRow.EFFICIENCYUNIT"
                value-expr="UNITCODE"
                display-expr="UNITDISP"
              />
            </li>
            <li>
              <p>원단위단위</p>
              <DxLookup
                :data-source="data.basicvalueunitList"
                :value="editData.selectRow.BASICVALUEUNIT"
                v-model="editData.selectRow.BASICVALUEUNIT"
                value-expr="UNITCODE"
                display-expr="UNITDISP"
              />
            </li>
            <li>
              <p>공간</p>
              <DxLookup
                :data-source="data.spaceList"
                :value="editData.selectRow.SPACEID"
                v-model="editData.selectRow.SPACEID"
                value-expr="SPACEID"
                display-expr="SPACENAME"
              >
                <DxRequiredRule message="공간를 선택해주세요." />
              </DxLookup>
            </li>
            <li>
              <p>부하율단위</p>
              <DxLookup
                :data-source="data.loadfacourunitList"
                :value="editData.selectRow.LOADFACORUNIT"
                v-model="editData.selectRow.LOADFACORUNIT"
                value-expr="UNITCODE"
                display-expr="UNITDISP"
              />
            </li>
            <li>
              <p>정격용량 <span>{{ onlyForAirCompResultFlow(editData.selectRow.NAME) }}</span></p>
              <DxTextBox
                :value="editData.selectRow.RATEDCAPACITY"
                v-model="editData.selectRow.RATEDCAPACITY"
              />
            </li>
            <li>
              <p>정격용량단위</p>
              <DxLookup
                :data-source="data.ratedcapacityList"
                :value="editData.selectRow.RATEDCAPACITYUNIT"
                v-model="editData.selectRow.RATEDCAPACITYUNIT"
                value-expr="UNITCODE"
                display-expr="UNITDISP"
              />
            </li>
            <li>
              <p>사용자컨트롤</p>
              <DxLookup
                :data-source="data.usercontrollList"
                :value="editData.selectRow.USERCONTROLCODE"
                v-model="editData.selectRow.USERCONTROLCODE"
                value-expr="CODEDEF"
                display-expr="CODEVALUE"
              />
            </li>
            <li>
              <p>효율여부</p>
              <DxLookup
                :data-source="data.useFlag"
                :value="editData.selectRow.EFFICIENCYYN"
                v-model="editData.selectRow.EFFICIENCYYN"
                value-expr="key"
                display-expr="value"
              />
            </li>
            <li>
              <p>상위입력량 합산</p>
              <DxLookup
                :data-source="data.useFlag"
                :value="editData.selectRow.UPINSUMYN"
                v-model="editData.selectRow.UPINSUMYN"
                value-expr="key"
                display-expr="value"
              />
            </li>
            <li>
              <p>상위생산량 합산</p>
              <DxLookup
                :data-source="data.useFlag"
                :value="editData.selectRow.UPOUTSUMYN"
                v-model="editData.selectRow.UPOUTSUMYN"
                value-expr="key"
                display-expr="value"
              />
            </li>
            <li>
              <p>표시 순서</p>
              <DxTextBox
                :value="editData.selectRow.DISPSEQ"
                v-model="editData.selectRow.DISPSEQ"
              />
            </li>
          </ul>
        </div>

        <p>사용여부</p>
        <DxLookup
          :data-source="data.useFlag"
          :value="editData.selectRow.USEFLAG"
          v-model="editData.selectRow.USEFLAG"
          value-expr="key"
          display-expr="value"
        />
        <p>비고 <span>{{ onlyForAirCompResultElec(editData.selectRow.NAME) }}</span></p>
        <DxTextBox
          :value="editData.selectRow.REMARKS"
          v-model="editData.selectRow.REMARKS"
        />
        <div class="btnBox">
          <DxButton icon="save" id="updateBtn" text="저장" @click="updateCont" v-show="!editData.addType" />
          <DxButton icon="save" id="updateBtn" text="추가" @click="updateCont" v-show="editData.addType" />
          <DxButton icon="close" id="closeBtn" text="취소" @click="closeCont" />
        </div>
      </DxPopup>
    </div>
  </div>
</template>

<script>
import DxButton from "devextreme-vue/button";
import { DxPopup } from "devextreme-vue/popup";
import DxTextBox from "devextreme-vue/text-box";
import { DxLookup } from "devextreme-vue/lookup";
import { DxTreeList, DxColumn, DxEditing, DxRequiredRule, DxScrolling } from "devextreme-vue/tree-list";
import DxDataGrid, {
  DxSelection,
  DxSummary,
  DxTotalItem,
  DxToolbar,
  DxItem,
  DxFilterRow,
  DxSearchPanel
} from "devextreme-vue/data-grid";
import { useStore } from "vuex";
import { onMounted, reactive, ref, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import OBJtoXML from "@/utils/jsontoxml";
import { utilArray } from '@/utils/utilArray';

const controlPointGridRef = ref(null);

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    const cpgroupListAttrGridRef = ref(null);
    let selectedControlPoint = reactive([]);
    let selectedRowkeys = reactive([]);

    const data = reactive({
      cpgroupAttrList: [],      
      controlPointList: [],     // 컨트롤포인트
      cpgroupTypeList: [],      // 관제포인트 그룹타입
      energyTypeList: [],       // 에너지 타입
      efficiencyunitList: [],   // 효율단위
      basicvalueunitList: [],   // 원단위단위
      loadfacourunitList: [],   // 부하율단위
      ratedcapacityList: [],    // 정격용량단위
      spaceList: [],            // 공간정보
      usercontrollList: [],     // 사용자 컨트롤
      efficiencyattrList: [],   // 효율속성
      expandedRowKeys: [],
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
      editingYN: true,
    });

    const editData = reactive({
      selectRow: {},
      showEditPopup: false,
      addType: false,
    })
    

    const cpgroupAttrData = reactive({
      BASICVALUEUNIT: "",
      CODE: "",
      CPGROUPTYPE: "",
      CPTYPE: "",
      DISPSEQ: "",
      EFFICIENCYTYPE: "",
      EFFICIENCYUNIT: "",
      EFFICIENCYYN: "",
      ENERGYTYPE: "",
      FACILITYTYPE: "",
      LOADFACTORUNIT: "",
      NAME: "",
      RATEDCAPACITY: "",
      RATEDCAPACITYUNIT: "",
      REMARKS: "",
      SPACEID: "",
      STARTDISP_YN: "",
      UPCODE: "",
      UPINSUMYN: "",
      UPOUTSUMYN: "",
      USEFLAG: "",
      USERCONTROLCODE: "",
    })

    onMounted(() => {
      getMainData();
    });

    function onTempEditClick(row) {
      console.log(row)
      editData.showEditPopup = true;
      editData.selectRow = row;
    }

    async function onTempGoupAddClick(row) {
      console.log(row)
      editData.showEditPopup = true;
      editData.addType = true;
      editData.selectRow.CPTYPE = '0';
      editData.selectRow.USEFLAG = 'Y';
      editData.selectRow.CODE = 'NEW_1';
      editData.selectRow.UPCODE = row.CODE;
    }

    async function onTempCPAddClick(row) {
      editData.addType = false;
      if(!selectedControlPoint[0]) {
        alert('선택된 컨트롤포인트가 없습니다.')
        return;
      }
      const userChk = confirm(`선택한 컨트롤포인트(${selectedControlPoint.length}개)를 "${row.NAME}"에 추가하시겠습니까?`)
      if(!userChk) return; // 선택취소하면 아래코드 실행 X

      for (let step = 0; step < selectedControlPoint.length; step++) {
        const e = {
          data: {}
        }
        e.data = JSON.parse(JSON.stringify(row))
        // CPTYPE 1 => 컨트롤포인트 그룹에 반영
        e.data.CPTYPE = '1'
        e.data.NAME = selectedControlPoint[step].CONTROLPOINTNAME
        e.data.CODE = `${e.data.CODE}.${selectedControlPoint[step].CONTROLPOINTID}`
        e.data.STARTDISP_YN = "Y"
        e.data.USEFLAG = "Y"
        e.data.UPCODE = row.CODE
        insertData(e)
      } 

      await getMainData();
      data.expandedRowKeys = [];
      data.expandedRowKeys.push(row.CODE)
      // 선택했던 컨트롤포인트 초기화
      deselectRows()
    }

    async function getMainData() {
      const params = {
        api: "PKG_MANAGER_BASA.GET_BASA007_LOAD",
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
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
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
      data.controlPointList = utilArray.ascSort(result.resultSet[0], "CONTROLPOINTID"); // 컨트롤포인트
      data.cpgroupTypeList = result.resultSet[1]; // 관제포인트 그룹타입
      data.energyTypeList = result.resultSet[2]; // 에너지 타입
      data.efficiencyunitList = result.resultSet[3]; // 효율단위
      data.basicvalueunitList = result.resultSet[4]; // 원단위단위
      data.loadfacourunitList = result.resultSet[5]; // 부하율단위
      data.ratedcapacityList = result.resultSet[6];  // 정격용량단위
      data.spaceList = utilArray.ascSort(result.resultSet[7], "SPACENAME"); // 공간정보 가나다 오름차순정렬
      data.usercontrollList = result.resultSet[8]; // 사용자 컨트롤
      data.efficiencyattrList = result.resultSet[9]; // 효율속성

      const apiParams = {
        api: "PKG_MANAGER_BASA.GET_BASA007_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA007" }, //메뉴코드
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
      data.cpgroupAttrList = result1.resultSet[0]
      data.cpgroupAttrList.filter((row) => {
        if(!row.UPCODE) {
          data.expandedRowKeys.push(row.CODE)
          return data.expandedRowKeys;
        }
      })
    }

    async function updateCpgroupAttrInfo() {
      let param = {};
      let keys = Object.keys(editData.selectRow);

      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        param[fieldName] = editData.selectRow[fieldName];
      }

      const jsonData = {"DocumentElement": {"DATA": param}}
      const xmlresult = `${OBJtoXML(jsonData)}`

      console.log(xmlresult)

      const apiParams = {
        api: "PKG_MANAGER_BASA.PUT_BASA007_DATA",
        params: [
          { dir: "in", val: xmlresult },
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA007" }, //메뉴코드
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
        ],
        needUser: false,
      };

      const result = await store.dispatch("api/kcfemsAPI", apiParams);
      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
    }

    async function addCpGroupInfo() {
      const e = {
        data: {}
      }
      e.data = JSON.parse(JSON.stringify(editData.selectRow))
      await insertData(e)
      await getMainData();
      data.expandedRowKeys.push(editData.selectRow.UPCODE)
    }

    // 컨트롤포인트 선택
    function onSelectionChanged(e) {
      if (e.selectedRowKeys.length == 0) {
        return;
      }
      data.disableYN = false;
      selectedControlPoint = [...e.selectedRowsData];
    }

    async function insertData(e) {
      let keys = Object.keys(cpgroupAttrData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        cpgroupAttrData[fieldName] = e.data[fieldName];
        if (cpgroupAttrData[fieldName] == undefined) {
          cpgroupAttrData[fieldName] = null;
        }
      }

      const jsonData = {"DocumentElement": {"DATA": cpgroupAttrData}}
      const xmlresult = `${OBJtoXML(jsonData)}`

      const apiParams = {
        api: "PKG_MANAGER_BASA.PUT_BASA007_DATA",
        params: [
          { dir: "in", val: xmlresult },
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA007" }, //메뉴코드
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
        ],
        needUser: false,
      };

      const result = await store.dispatch("api/kcfemsAPI", apiParams);
      selectedControlPoint = [];
      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
    }

    function allowAdding(e) {
      return e.row.data.CPTYPE != 1
    }

    function closeCont() {
      editData.showEditPopup = false;
      editData.addType = false;
      editData.selectRow = {};
    }

    function updateCont() {
      if(editData.addType) {
        // 필수값 popup인경우 dev에서 활용방법 찾지 못해서 일단 아래 처럼 작업
        if(!editData.selectRow.NAME) {
          alert("그룹명을 입력해주세요");
          return;
        } else if(!editData.selectRow.SPACEID) {
          alert("공간을 선택해주세요");
          return;
        }
        addCpGroupInfo();
      } else {
        updateCpgroupAttrInfo();
      }
      editData.showEditPopup = false;
      editData.selectRow = {};
    }

    function onlyForAirCompResultFlow(name) {
      const nm = String(name)
      if(nm.includes('호기') || nm.includes('터보')) {
        return '(표준유량)'
      } else {
        return ''
      }
    }

    function onlyForAirCompResultElec(name) {
      const nm = String(name)
      if(nm.includes('호기') || nm.includes('터보')) {
        return '(표준전력)'
      } else {
        return ''
      }
    }

    function deselectRows() {
      selectedRowkeys = [];
      controlPointGridRef.value.instance.deselectAll();
    }

    function updateHeight(n, o) {
      console.log(n, o)
      const layout = document.querySelector('#controlPointGrid')
      const layout2 = document.querySelector('#cpgroupListAttrGrid')
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
      editData,
      cpgroupListAttrGridRef,
      onSelectionChanged,
      allowAdding,
      onTempEditClick,
      onTempGoupAddClick,
      onTempCPAddClick,
      closeCont,
      updateCont,
      selectedRowkeys,
      controlPointGridRef,
      onlyForAirCompResultFlow,
      onlyForAirCompResultElec
    };
  },
  components: {
    DxTreeList,
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
    DxPopup,
    DxTextBox,
    DxButton,
    DxFilterRow,
    DxSearchPanel
  },
};
</script>
<style scoped>
#controlPointGrid {
  height: calc(100vh - 140px);
  flex-basis: 30%;
}
#cpgroupListAttrGrid {
  height: calc(100vh - 140px);
  padding: 0px 0 0 15px;
  flex-basis: 70%;
}
#controlPointGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td,
#cpgroupListAttrGrid::v-deep .dx-treelist-headers .dx-treelist-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
.grid-box {
  display: flex;
}

#cpgroupListAttrGrid::v-deep .dx-treelist-borders > .dx-treelist-header-panel {
  display: none;
}

ul {
  list-style: none;
  position: relative;
  right: 25px;
  margin: 0px;
  display: flex;
  gap: 10px;
}

.popupList{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.popupList li{
  flex-basis: 45%;
}

.btnBox{
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}
.btn-com{
  padding: 7px;
  border-radius: 5px;
  border: 1px solid #a5a5a5;
}
.cpgrouppointname{
  font-size: larger;
  font-weight: 700;
}
</style>
