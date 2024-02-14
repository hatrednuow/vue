<template>
  <div>
    <title-name></title-name>
  </div>
  <div class="wrap">
    <div class="inner">
      <div class="search-box">
        <DxDateRangeBox
          class="search-date"
          display-format="yyyy-MM-dd"
          :start-date="data.startDate"
          :end-date="data.endDate"
          :open-on-field-click="true"
          stylingMode="outlined"
          startDateLabel="시작일"
          endDateLabel="종료일"
          @value-changed="dateChange"
          height="30px"
        />
        <DxSelectBox
          class="search-select"
          :data-source="data.userList"
          display-expr="USERNAME"
          value-expr="USERID"
          v-model:value="data.userId"
          stylingMode="outlined"
          @value-changed="userChange"
          label="사용자"
          height="30px"
        />
        <DxButton
          class="search-btn"
          :width="150"
          :height="40"
          text="조회"
          type="default"
          @click="SearchButton()"
        />
      </div>
      <DxDataGrid
        id="logRecordGrid"
        :data-source="data.getlogList"
        :show-borders="true"
        :show-column-lines="true"
        :show-row-lines="false"
        :column-auto-width="true"
        :column-hiding-enabled="true"
        :rowAlternationEnabled="true"
      >
        <DxLoadPanel :enabled="true" />
        <DxScrolling mode="virtual" />
        <DxSelection mode="single" />
        <DxColumn data-field="USERID" caption="아이디" :allow-sorting="false" />
        <DxColumn data-field="USERNAME" caption="이름" :allow-sorting="false" />
        <DxColumn data-field="로그인시간" />
        <DxColumn
          data-field="로그인일시"
          data-type="date"
          format="yyyy년 MM월 dd일"
        />
      </DxDataGrid>
    </div>
  </div>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxScrolling,
  DxLoadPanel,
} from "devextreme-vue/data-grid";
import DxDateRangeBox from "devextreme-vue/date-range-box";
import DxSelectBox from "devextreme-vue/select-box";
import DxButton from "devextreme-vue/button";
import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];

    const msInDay = 1000 * 60 * 60 * 24;
    const now = new Date();

    const data = reactive({
      getlogList: [],
      userList: [],
      startDate: new Date(now.getTime() - msInDay * 7),
      endDate: now,
      userId: null,
    });

    onMounted(() => {
      getMainData();
    });

    async function getMainData() {
      if (data.userId == null) {
        data.userId = "ALL";
      }
      const apiParams = {
        api: "PKG_MANAGER_SYSA.GET_SYSA006_LOAD",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: formatDate(data.startDate, "yyyy-mm-dd") }, //조회일
          { dir: "in", val: formatDate(data.endDate, "yyyy-mm-dd") }, //시작일
          { dir: "in", val: data.userId }, //유저아이디
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
      data.userList = result.resultSet[0];
      const apiParams2 = {
        api: "PKG_MANAGER_SYSA.GET_SYSA006_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" },
          { dir: "in", val: "" },
          { dir: "in", val: formatDate(data.startDate, "yyyy-mm-dd") }, //조회일
          { dir: "in", val: formatDate(data.endDate, "yyyy-mm-dd") }, //시작일
          { dir: "in", val: data.userId }, //유저아이디
          { dir: "in", val: "" },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };
      const result2 = await store.dispatch("api/kcfemsAPI", apiParams2);
      if (result2.result != true) {
        errorAlert(result2.errmsg);
        return;
      }
      data.getlogList = result2.resultSet[0];
    }

    //날짜변경
    function dateChange(e) {
      data.startDate = e.value[0];
      data.endDate = e.value[1];
    }
    //사용자변경
    function userChange(e) {
      data.userId = e.value;
    }

    //날짜변환
    function formatDate(date, format) {
      const map = {
        mm: (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1),
        dd: date.getDate(),
        yyyy: date.getFullYear(),
      };
      return format.replace(/mm|dd|yyyy/gi, (matched) => map[matched]);
    }

    //조회
    function SearchButton() {
      getMainData();
    }

    function updateHeight(n, o) {
      console.log(n, o);
      const layout = document.querySelector("#logRecordGrid");
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
      userChange,
      dateChange,
      SearchButton,
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxSelection,
    DxScrolling,
    DxDateRangeBox,
    DxSelectBox,
    DxButton,
    DxLoadPanel,
    TitleName,
  },
};
</script>
<style scoped>
#logRecordGrid {
  height: calc(100vh - 220px);
}
#logRecordGrid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}

.search-box {
  display: flex;
  gap: 6px;
  margin: 15px 15px 10px;
  align-items: center;
}
.search-date,
.search-select {
  flex: 1 1;
}

.search-btn {
  font-size: 1rem;
}
</style>
