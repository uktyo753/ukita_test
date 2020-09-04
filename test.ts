//testcafe実験用
//9/4

import { Selector } from 'testcafe';
import * as retry from "./retry_test";

fixture('-qテスト')
  .page('http://127.0.0.1:5500/');//LiveServer

let x:string = "0"
let y:string = "ん"
let i:number = 1;
let testItem:any;

test('ドロップダウンリスト', async t => {
    testItem = async (tc: TestController) => {
     //  test('内部テスト', async t => { //testの中にtestはムリ
    //console.log(i+"回目");
    const citySelect  = await Selector('#city');
    const cityOption  = await citySelect.find('option');
    const submitButton = await Selector('#submit-button');
    const note = await Selector('#note'); //備考欄
  await t
    .setNativeDialogHandler(() => true)
    .click(citySelect)
    .click(cityOption.withText('その他')) //value=3のボタンを押す
    .click(submitButton)
    .typeText(note, 'あいうえお'); //テキスト入力

    //if(i%2==0){x="334";} //正解
    //{x="1"} //不正解
     if(i==1){x="99"; }
     if(i==2){x="3";} //"3"は正解
     if(i==3){x="100";y="う";} //"う"は正解
     if(i==4){x="3";}
     if(i==5){x="101";}
    i++;
  await t.expect(citySelect.value).eql(x) //x==”3”なら成功
  .expect(note.value).contains('う', 'contain失敗！.');
   }
   await retry.reTry(testItem, t); //リトライ
});