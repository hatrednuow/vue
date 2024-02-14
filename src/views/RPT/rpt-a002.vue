<template>
  <div>
    <div>
      <title-name></title-name>
    </div>
   
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted } from "vue";
import TitleName from "@/components/title-name";

export default {
  setup() {
    const store = useStore();
    const userInfo = store.getters["user/userInfo"];
    
    onMounted(() => {
      getMainData();

      console.log(userInfo)

    });
    async function getMainData() {
    
    }

   
    return {
    };
  },
  components: {
    TitleName
  },
};
</script>
<style scoped>
</style>
