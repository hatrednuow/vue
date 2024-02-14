<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
    <div class="wrap">
      <dx-data-grid
        class="inner"
        id="Grid"
        key-expr="EVENTSERVERID"
        :data-source="data.eventServer"
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
          data-field="EVENTSERVERID"
          caption="이벤트서버ID"
          :hiding-priority="7"
          :allow-editing="data.editingYN"
          >
          <DxRequiredRule message="필수 값입니다." />
        </dx-column>
        <dx-column
          data-field="EVENTSERVERNAME"
          caption="이벤트서버명"
          :allow-sorting="false"
          :hiding-priority="5"
          :allow-editing="data.editingYN"
        />
        <dx-column
          data-field="RUNMQ"
          caption="수집MQ"
          :allow-sorting="false"
          :hiding-priority="4"
          :allow-editing="data.editingYN"
        />
        <!-- <dx-column
          data-field="SERVICELOADNAME"
          caption="프로세스로더명"
          :hiding-priority="6"
          :allow-editing="data.editingYN"
          >
          <dx-lookup
            display-expr="SERVICELOADNAME"
            value-expr="SERVICELOADNAME"
            :data-source="data.serviceLoad"
            @item-click="initNewRowServiceload"
          />
        </dx-column> -->
        <dx-column
          data-field="SERVICELOADID"
          caption="프로세스로더ID"
          :hiding-priority="6"
          :allow-editing="data.editingYN"
          >
          <dx-lookup
            display-expr="SERVICELOADID"
            value-expr="SERVICELOADID"
            :data-source="data.serviceLoad"
          />
        </dx-column>
        <!-- <dx-column
          data-field="EVENTSERVERNAME_ENG"
          caption="이벤트서버명_영어"
          :allow-sorting="false"
          :hiding-priority="1"
        />
        <dx-column
          data-field="EVENTSERVERNAME_CHA"
          caption="이벤트서버명_중국어"
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
          <DxTotalItem column="EVENTSERVERID" summary-type="count" />
        </DxSummary>      
      </dx-data-grid>
    </div>
    <DxPopup
      :height="200"
      :width="300"
      title="공장을 선택해주세요."
      v-model:visible="isPopupVisible"
      content-template="popup-content"
      :hide-on-outside-click="true">
      <template #popup-content>
        <div>
          <div class="btnFacFlex">
            <DxButton
              text="성서"
              type="normal"
              width="100"
              height="50"
              styling-mode="outlined"
              @click="selectFactory('SS')"
            />
            <DxButton
              text="현풍"
              type="normal"
              width="100"
              height="50"
              styling-mode="outlined"
              @click="selectFactory('HP')"
            />
          </div>
          <div class="btnFlex">
            <DxButton
              text="닫기"
              type="normal"
              styling-mode="outlined"
              @click="togglePopup"
            />
          </div>
        </div>
    </template> 
    </DxPopup>
  </div>
</template>

<script>
import DxDataGrid, {
  DxColumn,
  DxLookup,
  DxEditing,
  DxSummary,
  DxRequiredRule,
  DxTotalItem,
} from "devextreme-vue/data-grid";
import { DxPopup } from 'devextreme-vue/popup';
import { DxButton } from "devextreme-vue/button";
import { useStore } from "vuex";
import { onMounted, reactive, watch, ref } from "vue";
import TitleName from "@/components/title-name";
import errorAlert from "@/components/error-alert.vue";
import { utilArray } from "@/utils/utilArray";
import { utilNumber } from "@/utils/utilNumber";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    let isPopupVisible = ref(false);
    let newEventSVRID = ref(null);
    const data = reactive({
      serviceLoad: [],
      eventServer: [],
      useFlag: [
        { key: "Y", value: "사용" },
        { key: "N", value: "미사용" },
      ],
      editingYN: true,
      eventserverIdList: [],
    });

    const eventServerData = reactive({
      EVENTSERVERID: "",
      EVENTSERVERNAME: "",
      RUNMQ: "",
      WCFPORT: "",
      SERVICELOADID: "",
      USEFLAG: "",
      REMARKS: "",
      EVENTSERVERNAME_ENG: "",
      EVENTSERVERNAME_CHA: ""
    })

    onMounted(() => {
      getMainData();
    });
    async function getMainData() {
      const params = {
        api: "PKG_MANAGER_BASA.GET_BASA002_LOAD",
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

      const result = await store.dispatch("api/kcfemsAPI", params);
      if (result.result == true) {
        data.serviceLoad = result.resultSet[0];
      }

      const apiParams = {
        api: "PKG_MANAGER_BASA.GET_BASA002_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA002" }, //메뉴코드
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
      data.eventServer = result1.resultSet[0];
      utilArray.ascSort(data.eventServer, 'EVENTSERVERID')
      
      data.eventServer.forEach(event => {
        let serviceload = data.serviceLoad.find(load => load.SERVICELOADID == event.SERVICELOADID)

        if(serviceload) {
          event.SERVICELOADNAME = serviceload.SERVICELOADNAME;
        }
      })

      const idList = []
      data.eventServer.forEach(eventserver => {
        idList.push(eventserver.EVENTSERVERID)
      })
      data.eventserverIdList = idList;
    }

    function initNewRowServiceload(e) {
      console.log(e)
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
        api: "PKG_MANAGER_BASA.PUT_BASA002_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA002" }, //메뉴코드
          { dir: "in", val: param.EVENTSERVERID },
          { dir: "in", val: param.EVENTSERVERNAME },
          { dir: "in", val: param.RUNMQ },
          { dir: "in", val: param.WCFPORT },
          { dir: "in", val: param.SERVICELOADID },
          { dir: "in", val: param.USEFLAG },
          { dir: "in", val: param.REMARKS },
          { dir: "in", val: param.EVENTSERVERNAME_ENG },
          { dir: "in", val: param.EVENTSERVERNAME_CHA },
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
      if (data.eventserverIdList.length === 0) {
        e.data.EVENTSERVERID = 'HP_EVENTSVR01';  
      }

      data.eventserverIdList.sort();
      const lastValue = data.eventserverIdList[data.eventserverIdList.length - 1];

      // 마지막 값을 분리하여 접두사와 숫자 부분을 구분
      const prefix = lastValue.substring(0, 11);
      const number = parseInt(lastValue.substring(11));

      e.data.EVENTSERVERID = prefix + utilNumber.pad(number + 1, 2);
      e.data.USEFLAG = 'Y'
      // TODO 성서인지 현풍인지 선택 후 처리 되도록 수정 필요
      /*
      togglePopup();
      if (data.eventserverIdList.length === 0) {
        e.data.EVENTSERVERID = 'HP_EVENTSVR01';  
      } else {
        e.promise = selectFactory('HP').then(data => {
          e.data.EVENTSERVERID = data;  
        });
      } */
      data.editingYN = true;
    }

    async function insertData(e) {
      let keys = Object.keys(eventServerData);
      for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];
        eventServerData[fieldName] = e.data[fieldName];
        if (eventServerData[fieldName] == undefined) {
          eventServerData[fieldName] = null;
        }
      }

      const apiParams = {
        api: "PKG_MANAGER_BASA.PUT_BASA002_DATA",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userInfo.id },
          { dir: "in", val: "" }, //언어
          { dir: "in", val: "BASA002" }, //메뉴코드
          { dir: "in", val: eventServerData.EVENTSERVERID },
          { dir: "in", val: eventServerData.EVENTSERVERNAME },
          { dir: "in", val: eventServerData.RUNMQ },
          { dir: "in", val: eventServerData.WCFPORT },
          { dir: "in", val: eventServerData.SERVICELOADID },
          { dir: "in", val: eventServerData.USEFLAG },
          { dir: "in", val: eventServerData.REMARKS },
          { dir: "in", val: eventServerData.EVENTSERVERNAME_ENG },
          { dir: "in", val: eventServerData.EVENTSERVERNAME_CHA },
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

    function togglePopup() {
      isPopupVisible.value = !isPopupVisible.value
    }

    function selectFactory(type) {
      return new Promise((resolve, reject) => {
        let result;
        if(type == 'SS') {
          // 성서인 경우
          newEventSVRID.value = 'SSSSS'
          result = newEventSVRID.value
        } else if(type == 'HP') {
          // 현풍인 경우
          result = newEventSVRID.value
        }
        togglePopup();
        if (result) {
          resolve(result);
        } else {
          reject("reject001");
        }
      })
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
      isPopupVisible,
      getUpdateInfo,
      updateSystemInfo,
      initNewRow,
      insertData,
      togglePopup,
      selectFactory,
      initNewRowServiceload
    };
  },
  components: {
    DxPopup,
    DxButton,
    DxDataGrid,
    DxColumn,
    DxLookup,
    DxEditing,
    DxSummary,
    DxRequiredRule,
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

.btnFacFlex{
  margin-bottom: 15px;
  display: flex;
  gap: 20px;
  justify-content: center;
}
.btnFlex{
  display: flex;
  gap: 5px;
  justify-content: flex-end; 
}
</style>
