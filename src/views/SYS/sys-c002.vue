<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap">
      <DxDataGrid
        class="inner"
        id="userGrid"
        key-expr="USERID"
        :data-source="data.getUserList"
        :show-borders="true"
        :show-column-lines="true"
        :show-row-lines="false"
        :column-auto-width="true"
        :column-hiding-enabled="true"
        :rowAlternationEnabled="true"
        @editor-preparing="onEditorPreparing"
        @init-new-row="initNewRow"
        @row-inserting="insertData"
        @editing-start="getUpdateInfo"
        @row-updating="updateUserInfo"
      >
        <DxSelection mode="single" />
        <DxEditing :allow-adding="true" :allow-updating="true" mode="row" />
        <DxColumn
          data-field="USERID"
          caption="사용자ID"
          :width="130"
          :allow-editing="data.editingYN"
        >
          <DxRequiredRule message="사용자ID를 입력해주세요." />
        </DxColumn>
        <DxColumn
          data-field="PASSWORD"
          caption="비밀번호"
          :width="100"
          :hiding-priority="0"
          :cell-template="passwordHide"
          :calculate-cell-value="decryptPassword"
        />
        <DxColumn
          data-field="EHRCODE"
          caption="사원번호"
          :hiding-priority="7"
        />
        <DxColumn data-field="USERNAME" caption="사용자명" :width="100">
          <DxRequiredRule message="사용자명를 입력해주세요." />
        </DxColumn>
        <DxColumn
          data-field="USERGRADE"
          caption="직급"
          :hiding-priority="6"
          :width="100"
        >
          <dx-lookup
            display-expr="CODEVALUE"
            value-expr="CODEDEF"
            :data-source="data.userGrade"
          />
        </DxColumn>
        <DxColumn
          data-field="EMAILADDRESS"
          caption="이메일"
          :hiding-priority="3"
          :allow-sorting="false"
        />
        <DxColumn
          data-field="USEFLAG"
          caption="사용여부"
          :hiding-priority="1"
          :width="100"
          :allow-sorting="false"
        >
          <dx-lookup
            display-expr="value"
            value-expr="key"
            :data-source="data.useFlag"
          />
        </DxColumn>
        <DxColumn
          data-field="PHONNO"
          caption="연락처"
          :hiding-priority="5"
          :allow-sorting="false"
        />
        <DxColumn
          data-field="DEPARTMENTNAME"
          caption="부서명"
          :hiding-priority="4"
        />
        <DxColumn
          data-field="USERGROUPCODE"
          caption="권한그룹명"
          :hiding-priority="2"
          :width="100"
        >
          <dx-lookup
            display-expr="USERGROUPNAME"
            value-expr="USERGROUPCODE"
            :data-source="data.userGroup"
          />
        </DxColumn>
        <DxSummary>
          <DxTotalItem column="USERID" summary-type="count" />
        </DxSummary>
      </DxDataGrid>
    </div>
  </div>
</template>

<script>
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxSummary,
  DxTotalItem,
  DxSelection,
  // DxToolbar,
  // DxItem,
  DxLookup,
  DxRequiredRule,
} from "devextreme-vue/data-grid";
import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import security from "@/utils/security";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const data = reactive({
      getUserList: [],
      getUpdateData: [],
      userGrade: [],
      userGroup: [],
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
      editingYN: true,
    });

    const userData = reactive({
      USERID: "",
      PASSWORD: "",
      EHRCODE: "",
      USERNAME: "",
      USERGROUPCODE: "",
      DEPARTMENT: "",
      USERGRADE: "",
      EMAILADDRESS: "",
      USEFLAG: "",
      REMARKS: "",
      USERNAME_ENG: "",
      USERNAME_CHA: "",
      TELNO: "",
      PHONNO: "",
    });

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      const apiParams = {
        api: "PKG_MANAGER_SYSC.GET_SYSC002_LOAD",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
          { dir: "out", val: "oci.CURSOR" },
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
      data.userGrade = result.resultSet[1];
      data.userGroup = result.resultSet[2];

      const apiParams2 = {
        api: "PKG_MANAGER_SYSC.GET_SYSC002_DATA",
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
      const result2 = await store.dispatch("api/kcfemsAPI", apiParams2);
      if (result2.result != true) {
        errorAlert(result2.errmsg);
        return;
      }
      data.getUserList = result2.resultSet[0];
    }

    function onEditorPreparing(e) {
      if (e.dataField === "USEFLAG") {
        e.editorOptions.value = "Y";
        e.setValue("Y");
      }
    }

    //등록
    function initNewRow() {
      data.editingYN = true;
    }

    async function insertData(e) {
      let keys = Object.keys(userData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        userData[fieldName] = e.data[fieldName];
        if (userData[fieldName] == undefined) {
          userData[fieldName] = null;
        }
      }
      if (userData.PASSWORD == null) {
        userData.PASSWORD = security.encryptstring("12345");
      } else {
        userData.PASSWORD = security.encryptstring(userData.PASSWORD);
      }

      const apiParams = {
        api: "PKG_MANAGER_SYSC.PUT_SYSC002_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: userData.USERID },
          { dir: "in", val: userData.PASSWORD },
          { dir: "in", val: userData.EHRCODE },
          { dir: "in", val: userData.USERNAME },
          { dir: "in", val: userData.USERGROUPCODE },
          { dir: "in", val: userData.DEPARTMENT },
          { dir: "in", val: userData.USERGRADE },
          { dir: "in", val: userData.EMAILADDRESS },
          { dir: "in", val: "99991231" },
          { dir: "in", val: userData.USEFLAG },
          { dir: "in", val: userData.REMARKS },
          { dir: "in", val: userData.USERNAME_ENG },
          { dir: "in", val: userData.USERNAME_CHA },
          { dir: "in", val: userData.TELNO },
          { dir: "in", val: userData.PHONNO },
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
      getMainData();
    }

    //수정
    function getUpdateInfo(e) {
      data.editingYN = false;
      data.getUpdateData = e.data;
    }

    async function updateUserInfo(e) {
      let param = {};
      let keys = Object.keys(data.getUpdateData);
      if (e.newData.PASSWORD != undefined) {
        e.newData.PASSWORD = security.encryptstring(e.newData.PASSWORD);
        changePassWord(e.key, e.newData.PASSWORD);
      }

      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        if (e.newData[fieldName] != undefined) {
          param[fieldName] = e.newData[fieldName];
        } else {
          param[fieldName] = data.getUpdateData[fieldName];
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_SYSC.PUT_SYSC002_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: param.USERID },
          { dir: "in", val: param.PASSWORD },
          { dir: "in", val: param.EHRCODE },
          { dir: "in", val: param.USERNAME },
          { dir: "in", val: param.USERGROUPCODE },
          { dir: "in", val: param.DEPARTMENT },
          { dir: "in", val: param.USERGRADE },
          { dir: "in", val: param.EMAILADDRESS },
          { dir: "in", val: "99991231" },
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.REMARKS },
          { dir: "in", val: param.USERNAME_ENG },
          { dir: "in", val: param.USERNAME_CHA },
          { dir: "in", val: param.TELNO },
          { dir: "in", val: param.PHONNO },
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

    async function changePassWord(id, pass) {
      const apiParams = {
        api: "PKG_MANAGER_SYSC.PUT_SYSC002_PASS",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: id },
          { dir: "in", val: pass },
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

    function decryptPassword(data) {
      if (data.PASSWORD == undefined) {
        return;
      } else if (data.VALIDTODATE == undefined) {
        return;
      }
      return security.decryptstring(data.PASSWORD);
    }

    function passwordHide(container, options) {
      const dataValue = options.value;
      const displayValue = dataValue ? "●".repeat(dataValue.length) : "";
      const div = document.createElement("div");

      div.textContent = displayValue;

      container.appendChild(div);
    }

    function updateHeight(n, o) {
      console.log(n, o);
      const layout = document.querySelector("#userGrid");
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
      userData,
      onEditorPreparing,
      initNewRow,
      insertData,
      getUpdateInfo,
      updateUserInfo,
      passwordHide,
      decryptPassword,
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxSummary,
    DxTotalItem,
    DxLookup,
    DxRequiredRule,
    DxSelection,
    TitleName,
  },
};
</script>
<style scoped>
#userGrid {
  height: calc(100vh - 140px);
}
#userGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
