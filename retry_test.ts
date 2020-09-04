//TestcafeのreTryモジュール 
// 9/4
// -q オプションでも可（3回実行）
const MAX_RETRY_COUNT = 3; //試行数

let j = 0;//引数にする
export const reTry = async (testItem: any, tc: TestController, wait: number = 500) => {
    //for (let i = 0; i < MAX_RETRY_COUNT;) {
        
        try { //エラーがなければ1回目の実行のみでreturn
            j++;
            await testItem(tc);
            console.log(j+"回目成功")
            return;
        } catch (err) {
            j++;
            console.log(j+"回目エラー..."+err.errMsg);//エラー文表示
            //console.log(`run ${i} failed retry`);//回数表示
            await tc.wait(wait)
            //if (i >= MAX_RETRY_COUNT) {
                throw err
            //}
        }
    //}
};

