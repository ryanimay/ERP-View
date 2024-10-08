# ERP-view

erp的前端部分  
主要就練習Vue.js(Vue3)，接ERP-Base的API，並且主要搭配element-plus做畫面處理  
~~Vue.js筆記:https://hackmd.io/0HEbLvzQQViCfIFTtY9TZQ~~
***
## 2024.3.15
舊設計棄置(branch master_abandoned)  
後端API重寫完，前端重寫  
主要希望改善code的css  
不要寫hardCode  
多利用套件(element-plus)做畫面效果  
~~figma熟練~~(做不到啊)  
~~Router配置的部分整合到後端讀資料庫~~  
(思考其實好像沒必要，前後端分離了要新增菜單勢必前端也必須同步做修改，全部綁在同一邊沒必要)  
新筆記: https://hackmd.io/@S1MNxjTORYSfAfivxMlEQw/Bkf-N7Y0a

## 流程   
註冊由有權限的用戶協助新增帳號，第一次登入帳號密碼相同，須改密碼，登記email  
登入:  
用戶輸入帳號密碼，經API由後端驗證  
如果未勾選rememberMe，只會返回accessToken  
如果勾選rememberMe，會返回accessToken和refreshToken  
並且後續把使用者帳號及回傳的JWT(accessToken && refreshToken)記在localStorage，  
密碼記錄由瀏覽器端控制自動儲存，後續瀏覽器操作就是先驗證localStorage中的accessToken  
未通過則利用refreshToken呼叫後端取得新的Token，  
如果沒有refreshToken這邊就會直接要求重登  
localStorage記錄帳號顯示於inputText  

關於請求權限:
JWT的驗證，前端只負責做時效驗證，加減篩選掉一些無效請求發送至後端導致不必要的資源浪費，  
簽名驗證的部分因為有安全性問題所以由後端負責驗證

## 關於權限
原先是希望用RBAC的方式，但後面發現如果有區分部門的需求就變得有點混亂，關於這，有兩種想法:  
1. 一樣貫徹RBAC，所有權限都是基於role的角色，每個部門的不同需求權限就是創一個新角色，部門單純就是用來掛名，無關權限，但要用到部門的操作場合就會變很複雜。  
2. (目前嘗試)讓部門跟權限掛勾，部門都會有個基本權限，就是用一個role，並且權限都加了一個屬性是level代表層級，也是用RBAC的方式加role給用戶，但部門搜尋就可以按層級去區分部門職位，大致能做到功能但總感覺哪裡有問題。  
另外，還有延伸想法就是做到更細，每個部門的role就是固定幾個(比如說部門經理、課長、職員)，然後從部門的層面去分配role給用戶，也可以同時用RBAC做部門以外的權限操作。  
  
操作畫面來說就是  
用戶操作: 給用戶分配部門  
部門管理: 把部門Role分配給部門內的用戶  
權限管理: 部門調整權限Role, Role調整細部權限Permission  

## 2024.10.4
專案整體都完成了，剩下比較有疑慮的就是一些從設計層面就有問題的
要從頭改也難，就這邊做個紀錄(針對前端)
1. 整體流程來說，那些按鈕需要二次確認，哪些按鈕點擊立即生效，要先想好
2. 讀取畫面的待機畫面v-loading，如果頁面區分多個components會有部分重疊或是衝突
3. 用戶系統提示訊息是用websocket做，單向感覺SSE比較好，然後連線錯誤目前是限制重連次數，驗證方式是連線請求參數帶Token給後端驗證，不確定這樣有沒有問題
4. 請求統一做成封裝類，一開始想說錯誤都會由後端處理，前端統一分辨成功還是錯誤顯示提示訊息，但後面發現還是有些請求錯誤要另外處理(比如webSocket連線錯誤，原因是因為Token驗證過期或錯誤)，正常處理流程應該就跳轉登入頁面，但現在因為封裝在統一的請求處理，變成websocket連線失敗後重複連線，次數到就直接掛掉(也許可以錯誤次數到直接用Router跳轉?)
5. 整體權限設計目前是可以細分到每個人可以使用哪支API和顯示什麼Menu，但實務上有些複雜，因為頁面操作有時候是需要複數API支撐，某一支如果沒有成功請求就會一連串爆炸類似NullPointer那樣，這部分都是一開始沒想好，邊做邊改的問題，想不到什麼解決方式，如果單純限制前端畫面顯示Menu，不限制API權限也很奇怪
6. 用戶驗證機制主要是登入後用JWT，並且有換發機制，前端請求驗證如果Token過期會用refreshToken請求後端換發accessToken，機制上不確定有沒有什麼問題，本來是設計都由後端驗證換發，但會變成每次請求不管有沒有過期或是有沒有換發權限都要先進到後端，所以前端先擋下確認有沒有過期 反之直接踢出用戶
7. 能擴充的部分還有前端的緩存，包含像是頁分頁緩存避免同用戶多次重覆加載元件，有大概構想，但這部分暫時就先不做了，keep-alive目前只用在header和sideBar menu上，要做分頁換存就是要在擴充header，用類似store的方式綁定tab，再用keep-alive讓生命週期持續

其實最大問題就是事前的系統設計沒有做好，包含專案進行中還整個大改了一次，很多細部功能也都是在做的當下才才發現邏輯缺失或是錯誤，但主要想練習的部分是有做到，還行