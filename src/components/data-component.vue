<template>
  <div class="datawrap">
    <div>
      <table>
        <caption>{{ data.name }}</caption>
        <tr>
          <th></th>
          <th>사용량</th>
          <th>요금</th>
        </tr>
        <tr>
          <td>연간</td>
          <td>{{ data.perYear }}</td>
          <td>{{ data.perYearMoney }}</td>
        </tr>
        <tr>
          <td>월간</td>
          <td>{{ data.perMonth }}</td>
          <td>{{ data.perMonthMoney }}</td>
        </tr>
        <tr>
          <td>일간</td>
          <td>{{ data.perDay }}</td>
          <td>{{ data.perDayMoney }}</td>
        </tr>
        <tr>
          <td>
            <table>
              <tr>
                <td rowspan="8">요일별</td>
              </tr>
              <tr><td>월</td></tr>
              <tr><td>화</td></tr>
              <tr><td>수</td></tr>
              <tr><td>목</td></tr>
              <tr><td>금</td></tr>
              <tr><td>토</td></tr>
              <tr><td>일</td></tr>
            </table>
          </td>
          <td>
            <table>
              <!-- <tr><td>1</td></tr>
              <tr><td>2</td></tr>
              <tr><td>3</td></tr>
              <tr><td>4</td></tr>
              <tr><td>5</td></tr>
              <tr><td>6</td></tr>
              <tr><td>7</td></tr> -->
              <tr v-for="(qty, key) in data.perDayofWeek" :key="key"><td>{{ qty }}</td></tr>
            </table>
          </td>
          <td>
            <table>
              <tr v-for="(qty, key) in data.perDayofWeekMoney" :key="key"><td>{{ qty }}</td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table>
              <tr>
                <td rowspan="25">시간별</td>
              </tr>
              <tr><td>00시</td></tr>
              <tr><td>01시</td></tr>
              <tr><td>02시</td></tr>
              <tr><td>03시</td></tr>
              <tr><td>04시</td></tr>
              <tr><td>05시</td></tr>
              <tr><td>06시</td></tr>
              <tr><td>07시</td></tr>
              <tr><td>08시</td></tr>
              <tr><td>09시</td></tr>
              <tr><td>10시</td></tr>
              <tr><td>11시</td></tr>
              <tr><td>12시</td></tr>
              <tr><td>13시</td></tr>
              <tr><td>14시</td></tr>
              <tr><td>15시</td></tr>
              <tr><td>16시</td></tr>
              <tr><td>17시</td></tr>
              <tr><td>18시</td></tr>
              <tr><td>19시</td></tr>
              <tr><td>20시</td></tr>
              <tr><td>21시</td></tr>
              <tr><td>22시</td></tr>
              <tr><td>23시</td></tr>
            </table>
          </td>
          <td>
            <table>
              <tr><td>00</td></tr>
              <tr><td>01</td></tr>
              <tr><td>02</td></tr>
              <tr><td>03</td></tr>
              <tr><td>04</td></tr>
              <tr><td>05</td></tr>
              <tr><td>06</td></tr>
              <tr><td>07</td></tr>
              <tr><td>08</td></tr>
              <tr><td>09</td></tr>
              <tr><td>10</td></tr>
              <tr><td>11</td></tr>
              <tr><td>12</td></tr>
              <tr><td>13</td></tr>
              <tr><td>14</td></tr>
              <tr><td>15</td></tr>
              <tr><td>16</td></tr>
              <tr><td>17</td></tr>
              <tr><td>18</td></tr>
              <tr><td>19</td></tr>
              <tr><td>20</td></tr>
              <tr><td>21</td></tr>
              <tr><td>22</td></tr>
              <tr><td>23</td></tr>
            </table>
          </td>
          <td>
            <table>
              <tr><td>00</td></tr>
              <tr><td>01</td></tr>
              <tr><td>02</td></tr>
              <tr><td>03</td></tr>
              <tr><td>04</td></tr>
              <tr><td>05</td></tr>
              <tr><td>06</td></tr>
              <tr><td>07</td></tr>
              <tr><td>08</td></tr>
              <tr><td>09</td></tr>
              <tr><td>10</td></tr>
              <tr><td>11</td></tr>
              <tr><td>12</td></tr>
              <tr><td>13</td></tr>
              <tr><td>14</td></tr>
              <tr><td>15</td></tr>
              <tr><td>16</td></tr>
              <tr><td>17</td></tr>
              <tr><td>18</td></tr>
              <tr><td>19</td></tr>
              <tr><td>20</td></tr>
              <tr><td>21</td></tr>
              <tr><td>22</td></tr>
              <tr><td>23</td></tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

  </div>
</template>

<script>
export default{
  props: {
    data: Object
  }
}
</script>

<style scoped>
.datawrap{
  border: 1px solid black;
}
.datawrap div > table > tr > td{
  border: 1px solid #000;
}
th, td {
  text-align: center;
}
td table{
  margin: auto;
}
</style>