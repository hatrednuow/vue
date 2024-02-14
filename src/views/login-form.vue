<template>
  <form class="login-form" @submit.prevent="onSubmit">
    <dx-form :form-data="formData" :disabled="loading">
      <dx-item
        data-field="userId"
        editor-type="dxTextBox"
        :editor-options="{
          stylingMode: 'outlined',
          placeholder: '아이디',
          mode: 'text',
        }"
      >
        <dx-required-rule message="아이디를 입력하세요." />
        <dx-label :visible="false" />
      </dx-item>
      <dx-item
        data-field="password"
        editor-type="dxTextBox"
        :editor-options="{
          stylingMode: 'outlined',
          placeholder: '비밀번호',
          mode: 'password',
        }"
      >
        <dx-required-rule message="비밀번호를 입력하세요." />
        <dx-label :visible="false" />
      </dx-item>
      <!-- <dx-item
        data-field="rememberMe"
        editor-type="dxCheckBox"
        :editor-options="{
          text: 'Remember me',
          elementAttr: { class: 'form-text' },
        }"
      >
        <dx-label :visible="false" />
      </dx-item> -->
      <dx-button-item css-class="add-phone-button">
        <dx-button-options
          width="100%"
          type="default"
          template="signInTemplate"
          :use-submit-behavior="true"
        >
        </dx-button-options>
      </dx-button-item>

      <template #signInTemplate>
        <div>
          <span class="dx-button-text">
            <dx-load-indicator
              v-if="loading"
              width="24px"
              height="24px"
              :visible="true"
            />
            <span v-if="!loading">로그인</span>
          </span>
        </div>
      </template>
    </dx-form>
  </form>
</template>

<script>
import DxLoadIndicator from "devextreme-vue/load-indicator";
import DxForm, {
  DxItem,
  DxRequiredRule,
  DxLabel,
  DxButtonItem,
  DxButtonOptions,
} from "devextreme-vue/form";

import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import notify from "devextreme/ui/notify";
import authUtil from "../utils/security";

// db 로컬
import userLocal from "@/data/user"

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const formData = reactive({
      userId: "",
      password: "",
    });
    const loading = ref(false);

    async function onSubmit() {
      loading.value = true;
      const userId = formData.userId.toUpperCase();
      const apiParams = {
        api: "PKG_MANAGER_MAIN.GET_USERID_INFO",
        params: [
          { dir: "in", val: "KCFEMS" },
          { dir: "in", val: userId },
          { dir: "in", val: "" },
          { dir: "out", val: "oci.NUMBER" },
          { dir: "out", val: "oci.STRING" },
          { dir: "out", val: "oci.CURSOR" },
        ],
        needUser: false,
      };

      // const result = await store.dispatch("api/kcfemsAPI", apiParams);
      // db 로컬
      const result = {
        resultSet: userLocal
      }

      if (result.resultSet[0].length != 0) {
        const encPasswd = authUtil.decryptstring(
          result.resultSet[0][0].PASSWORD
        );
        if (encPasswd != formData.password) {
          loading.value = false;
          notify(
            {
              message: "비밀번호를 확인해주세요.",
              height: 55,
              width: 220,
              minWidth: 220,
              type: "error",
              displayTime: 2000,
            },
            { position: "center" }
          );
        } else {
          store.dispatch("user/setUser", {
            userId: result.resultSet[0][0].USERID,
            userName: result.resultSet[0][0].USERNAME,
            userGroupCode: result.resultSet[0][0].USERGROUPCODE,
          });
          router.push("/home");
        }
      } else {
        loading.value = false;
        notify(
          {
            message: "등록되지않은 사용자입니다.",
            height: 55,
            width: 220,
            minWidth: 220,
            type: "error",
            displayTime: 2000,
          },
          { position: "center" }
        );
      }
    }

    return {
      formData,
      loading,
      onSubmit,
    };
  },
  components: {
    DxLoadIndicator,
    DxForm,
    DxRequiredRule,
    DxItem,
    DxLabel,
    DxButtonItem,
    DxButtonOptions,
  },
};
</script>

<style lang="scss">
@import "../themes/generated/variables.base.scss";

.login-form {
  .link {
    text-align: center;
    font-size: 16px;
    font-style: normal;

    a {
      text-decoration: none;
    }
  }

  .form-text {
    margin: 10px 0;
    color: rgba($base-text-color, alpha($base-text-color) * 0.7);
  }
}
.add-phone-button > .dx-button {
  height: 50px;
  font-size: 1.45rem;
  font-weight: bold !important;
  border-radius: 30px;
}
.dx-field-item:not(.dx-field-item-has-group):not(.dx-field-item-has-tabs):not(
    .dx-first-row
  ):not(.dx-label-v-align) {
  padding-top: 15px !important;
}
</style>
