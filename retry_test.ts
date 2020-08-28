//TestcafeのreTryモジュール 
// 8/27
// -q オプションでも可（3回実行）
const MAX_RETRY_COUNT = 3; //試行数

export const reTry = async (testItem: any, tc: TestController, wait: number = 500) => {
    for (let i = 0; i < MAX_RETRY_COUNT;) {
        try { //エラーがなければ1回目の実行のみでreturn
            await testItem(tc);
            console.log("success")
            return;
        } catch (err) {
            i++;
            console.log(err.errMsg);//エラー文表示
            console.log(`run ${i} failed retry`);//回数表示
            await tc.wait(wait)
            if (i >= MAX_RETRY_COUNT) {
                throw err
            }
        }
    }
};

