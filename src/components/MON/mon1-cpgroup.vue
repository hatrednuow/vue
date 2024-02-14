<template>
  <div class="topMargin">
    <DxTreeList
      id="cpgroupListAttrGrid"
      key-expr="CODE"
      ref="cpgroupListAttrGridRef"
      :data-source="data.cpgrouppointList"
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
      @selection-changed="selectCpgrouppoint"
    >
      <DxSelection mode="single" />
      <DxScrolling mode="virtual" />
      <DxColumn
        data-field="NAME"
        caption="관제포인트그룹명"
        :allow-editing="data.editingYN"
      >
      </DxColumn>
    </DxTreeList>
  </div>
</template>

<script>
import { DxTreeList, DxColumn, DxSelection, DxScrolling } from "devextreme-vue/tree-list";
import { reactive, onMounted, onBeforeUnmount, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const data = reactive({
      cpgrouppointList: [],
      expandedRowKeys: [],
      selectedCpgrouppoint: [],
    })

    onMounted(() => {
      emitter.on("sendCpgrouppointList", (item) => {
        data.cpgrouppointList = item.sort((a, b)=>{
          if(a.NAME > b.NAME) return 1;
          if(a.NAME === b.NAME) return 0;
          if(a.NAME < b.NAME) return -1;
        })

        // 펼쳐놓기 위해서
        const uniqueUpcodes = Array.from(new Set(data.cpgrouppointList.map(item => item.UPCODE)));
        uniqueUpcodes.sort();
        data.expandedRowKeys = uniqueUpcodes;
      });
    });

    onBeforeUnmount(() => {
      emitter.off("sendCpgrouppointList");
    });

    function selectCpgrouppoint(e) {
      e.component.byKey(e.currentSelectedRowKeys[0]).done(cpgrouppoint => {
        if(cpgrouppoint) {
          data.selectedCpgrouppoint = cpgrouppoint;
          emitter.emit("sendSelectedCpgrouppoint", data.selectedCpgrouppoint)
        }
      });
    }

    function updateHeight(n, o) {
      console.log(n, o)
      const layout = document.querySelector('#cpgroupListAttrGrid')
      if(n == false) {
        layout.style.height = '776px'
      } else {
        layout.style.height = '720px'
      }
    }

    watch(() => store.state.menu.headerOpen, (newValue, oldValue) => {
      updateHeight(newValue, oldValue)
    })

    return {
      data, selectCpgrouppoint
    }  
  },
  components: {
    DxTreeList, DxColumn, DxSelection, DxScrolling
  }
}
</script>

<style scoped>
.topMargin{
  margin-top: 10px;
}
#cpgroupListAttrGrid {
  height: 776px;
}
</style>