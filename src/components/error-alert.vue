<script>
import notify from "devextreme/ui/notify";

export default function errorAlert(pmsg) {
  let messsage = "데이터 처리중 오류가 발생하였습니다."
  if(pmsg) {
    messsage = pmsg;
  }
  notify(
    {
      message: messsage,
      height: 55,
      width: 300,
      minWidth: 300,
      type: "error",
      displayTime: 1000,
    },
    { position: "center" }
  );
}
</script>