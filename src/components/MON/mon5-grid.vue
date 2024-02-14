<template>
  <dx-data-grid
    id="Grid"
    key-expr="SERVICELOADID"
    :data-source="dataList"
    :show-borders="true"
    :show-column-lines="true"
    :show-row-lines="false"
    :column-auto-width="true"
    :column-hiding-enabled="true"
  >
    <dx-column
      data-field="SERVICELOADID"
      caption="프로세스로드ID"
    />
    <dx-column
      data-field="SERVICELOADNAME"
      caption="프로세스로드명"
    />
    <dx-column
      data-field="SERVICELOADIP"
      caption="프로세스로드IP"
      :allow-sorting="false"
    />
    <dx-column
      data-field="SCHEDULE_PROSESS_YN"
      caption="스케쥴사용여부"
    />
    <dx-column
      data-field="TRIGGER_PROSESS_YN"
      caption="트리거사용여부"
    />
    <dx-column
      data-field="SERVICELOADNAME_ENG"
      caption="프로세스로드명_영어"
    />
    <dx-column
      data-field="SERVICELOADNAME_CHA"
      caption="프로세스로드명_중국어"
    />
    <dx-column
      data-field="REMARKS"
      caption="비고"
    />
    <dx-column
      data-field="USEFLAG"
      caption="사용여부"
    />
    <DxScrolling mode="virtual" />
  </dx-data-grid>
</template>

<script>
import DxDataGrid, {
  DxScrolling,
  DxColumn,
} from "devextreme-vue/data-grid";
import { onMounted, reactive } from "vue";

export default {
  props: {
    data: Array
  },
  setup(props) {
    const dataList = reactive(props.data);
    
    onMounted(() => {
    });

    return {
      dataList,
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxScrolling
  },
};
</script>
<style scoped>
#Grid {
  padding: 2% 10px 0 10px;
  height: 45%;
}
#Grid::v-deep .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
  background-color: #ebebeb;
  text-align: center !important;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
