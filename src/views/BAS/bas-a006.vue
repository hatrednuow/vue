<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap">
      <DxTreeList
      class="inner"
      id="Grid"
      key-expr="KEY_"
      parent-id-expr="PARENT_"
      root-value=""
      :data-source="data.spaceList"
      :show-borders="true"
        :show-row-lines="true"
        :column-auto-width="true"
        :auto-expand-all="true"
        :expanded-row-keys="data.expandedRowKeys"
        @init-new-row="initNewRow"
        @row-inserting="insertData"
        @editing-start="getUpdateInfo"
        @row-updating="updateSpaceInfo"
      >
        <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
        <DxLoadPanel :enabled="true" />
        <DxColumn 
        data-field="NAME_" 
        caption="공간명" 
        :allow-editing="data.editingYN"
        >
          <DxRequiredRule message="필수 값입니다." />
        </DxColumn>
        <DxColumn 
        data-field="PARENT_" 
        caption="상위공간명" 
        :allow-editing="data.editingYN"
        >
          <dx-lookup
            display-expr="SPACENAME"
            value-expr="SPACEID"
            :data-source="data.spaceNameIdList"
          />
        </DxColumn>
        <DxColumn 
        data-field="SPACETYPE" 
        caption="공간타입" 
        >
          <DxLookup
            display-expr="CODEVALUE"
            value-expr="CODEDEF"
            :data-source="data.buildingTypeList"
          />
        </DxColumn>
        <DxColumn 
        data-field="BUILDINGNO" 
        caption="건물동" 
        />
        <DxColumn 
        data-field="FLOORNO" 
        caption="층" 
        />
        <DxColumn 
        data-field="ROOMNO" 
        caption="호" 
        />
        <DxColumn 
        data-field="ISPUBSPACE" 
        caption="공용공간여부" 
        >
          <dx-lookup
            display-expr="value"
            value-expr="key"
            :data-source="data.useFlag"
          />
        </DxColumn>
        <DxColumn 
        data-field="USEFLAG" 
        caption="사용여부" 
        >
          <dx-lookup
            display-expr="value"
            value-expr="key"
            :data-source="data.useFlag"
          />
          <DxRequiredRule message="필수 값입니다." />
        </DxColumn>
        <DxColumn 
        data-field="REMARKS" 
        caption="비고" 
        />
      </DxTreeList>
    </div>
  </div>
</template>

<script>
import { DxTreeList, DxColumn, DxLoadPanel, DxEditing, DxRequiredRule, DxLookup } from "devextreme-vue/tree-list";
import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      spaceList: [],
      spaceNameIdList: [], // 상위공간 옵션용
      expandedRowKeys: [], // 기본으로 확장용 
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
      editingYN: true,
    });

    const spaceData = reactive({
      KEY_: "",
      NAME_: "",
      PARENT_: "",
      SPACETYPE: "",
      BUILDINGNO: "",
      FLOORNO: "",
      ROOMNO: "",
      ISPUBSPACE: "",
      USEFLAG: "",
      REMARKS: "",
    })

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      const params = {
        api: "PKG_MANAGER_BASA.GET_BASA006_LOAD",
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
        ],
        needUser: false,
      };
      const result = await store.dispatch("api/kcfemsAPI", params);

      if (result.result != true) {
        errorAlert(result.errmsg);
        return;
      }
      data.spaceNameIdList = result.resultSet[0];
      data.buildingTypeList = result.resultSet[1];

      const apiParams = {
        api: "PKG_MANAGER_BASA.GET_BASA006_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA006" }, //메뉴코드
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
      data.spaceList = result1.resultSet[0]
      data.spaceList.filter((row) => {
        if(!row.PARENT_) {
          data.expandedRowKeys.push(row.KEY_)
          return data.expandedRowKeys;
        }
      })
    }

    function getUpdateInfo(e) {
      data.editingYN = false;
      data.getUpdateData = e.data;
    }

    async function updateSpaceInfo(e) {
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
        api: "PKG_MANAGER_BASA.PUT_BASA006_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA006" }, //메뉴코드
          { dir: "in", val: param.KEY_ }, // SPACEID
          { dir: "in", val: param.NAME_ }, // SPACENAME
          { dir: "in", val: param.PARENT_ }, // UPSPACEID
          { dir: "in", val: param.SPACETYPE },
          { dir: "in", val: param.BUILDINGNO },
          { dir: "in", val: param.FLOORNO },
          { dir: "in", val: param.ROOMNO },
          { dir: "in", val: param.ISPUBSPACE },
          { dir: "in", val: param.USEFLAG },
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

    //등록
    function initNewRow() {
      data.editingYN = true;
    }

    async function insertData(e) {
      let keys = Object.keys(spaceData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        spaceData[fieldName] = e.data[fieldName];
        if (spaceData[fieldName] == undefined) {
          spaceData[fieldName] = null;
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_BASA.PUT_BASA006_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA006" }, //메뉴코드
          { dir: "in", val: spaceData.KEY_ }, // SPACEID
          { dir: "in", val: spaceData.NAME_ }, // SPACENAME
          { dir: "in", val: spaceData.PARENT_ }, // UPSPACEID
          { dir: "in", val: spaceData.SPACETYPE },
          { dir: "in", val: spaceData.BUILDINGNO },
          { dir: "in", val: spaceData.FLOORNO },
          { dir: "in", val: spaceData.ROOMNO },
          { dir: "in", val: spaceData.ISPUBSPACE },
          { dir: "in", val: spaceData.USEFLAG },
          { dir: "in", val: spaceData.REMARKS },
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
      updateSpaceInfo,
      initNewRow,
      insertData
    };
  },
  components: {
    DxTreeList,
    DxColumn,
    DxLoadPanel,
    TitleName,
    DxEditing,
    DxRequiredRule,
    DxLookup
  },
};
</script>
<style scoped>
#Grid {
  height: calc(100vh - 140px);
}
#Grid::v-deep .dx-treelist-headers .dx-treelist-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
