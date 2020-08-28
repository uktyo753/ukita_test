//ref https://app.codegrid.net/entry/2017-testcafe-1#toc-1 
//testcafeの練習　浮田誉之
//8/27

import {Selector} from 'testcafe';
import {Role} from 'testcafe';
import * as retry from "./retry_test";

fixture('アンケートフォームのテスト/')
  .page('http://127.0.0.1:5500/1-thanks.html');//LiveServer

let testItem:any//reTryに渡す用

// const Paris = Role("http://127.0.0.1:5500/",async t =>{ //ロール（ログイン状態保存）
////ref https://qiita.com/tsuemura/items/92da801e1db39b6b8d91
//   await t
//   .click(Selector('#test-city'))
//   .click(Selector('#test-city').find('option').withText('Paris'));
// });

test('テスト1.名前を入力後、送信して遷移先を確認', async (t:TestController) => {
  const userName   = await Selector('#user-name');//#user-name=名前欄のID
  const submitButton = await Selector('#submit-button');
  await t
    .setNativeDialogHandler(() => true)//確認ダイアログでOKを押す
    .typeText(userName, 'うきた')//UserNameに名前を入力する
    .click(submitButton);//submitボタンをクリックする
    
  await t.expect(Selector('#thanks-message').innerText).eql('うきた様、アンケートにお答えいただき、ありがとうございました。')
  //ボタンを押した後に想定される文章がeqlと一致 
  .expect(t.eval(() => document.location.href)).eql("http://127.0.0.1:5500/1-thanks.html");
    //画面遷移のURL確認
});//ここまでが1つのテスト


test('テスト1-B.名前が未入力の場合', async t => {//赤で「名前は必須項目です。」が表示されてるか調べたい
  const userName   = await Selector('#user-name');
  const submitButton = await Selector('#submit-button');
  await t
    .setNativeDialogHandler(() => true)
    //('#user-name-error').innerText).eql('名前は必須項目です。')
    //消えてるときに意味を成さない項目→テストしない
    .expect(Selector('#user-name-error').filterVisible().exists).notOk()//まだ非表示
    .click(submitButton)//ボタンを押す（以下、エラーメッセージが表示）
    .expect(Selector('#user-name-error').getStyleProperty('color')).eql('rgb(255, 0, 0)')//字が赤色か
    .expect(Selector('#user-name-error').innerText).eql('名前は必須項目です。')
    .expect(Selector('#user-name-error').filterVisible().exists).ok();//メッセージ表示確認
    
});


test('テスト2.職種：ラジオボタン', async t => {
  const userJob   = await Selector('#user-job2');
  const submitButton = await Selector('#submit-button');
  await t
    .setNativeDialogHandler(() => true)
    .click(userJob)//ラジオボタン
    .expect(userJob.parent('label').child('span').innerText).eql("UIデザイナー")
    //"UIデザイナー"が押されたか確認
    .click(submitButton)
    .expect(userJob.checked).ok();
});


test('テスト2-B. id未参照ver', async t => {
  //const userJob   = await Selector('#send-form' ).child(1).child(2);//配列は使わない
  const userJob   = await Selector('#send-form' ).child('fieldset').child('label').child('input[value="2"]');
  const submitButton = await Selector('#submit-button');
  await t
    .setNativeDialogHandler(() => true)
    .click(userJob)
    .click(submitButton)
    .expect(userJob.checked).ok();
});


test('テスト3. スキル:チェックボックス', async t => {
  const userSkill1   = await Selector('#send-form').child('fieldset').child('label').child('input[value="1"]').withAttribute('type','checkbox');
  const userSkill2   = await Selector('#send-form').child('fieldset').child('label').child('input[value="2"]').withAttribute('type','checkbox');
  const userSkill3   = await Selector('#send-form').child('fieldset').child('label').child('input[value="3"]').withAttribute('type','checkbox');
  const submitButton = await Selector('#submit-button');
  await t
    .setNativeDialogHandler(() => true)
    .click(userSkill2)
    .click(userSkill3)
    .click(submitButton)
    //2と3のみがチェックされてるか確認
    .expect(userSkill2.checked).ok()
    .expect(userSkill3.checked).ok()
    .expect(userSkill1.checked).notOk();
});


const citySelect  = Selector('#city');
const cityOption  = citySelect.find('option');
const submitButton = Selector('#submit-button');
test('テスト4.住所ドロップダウンリスト', async t => {
  await t
    .setNativeDialogHandler(() => true)
    .click(citySelect)//リストをクリック
    .click(cityOption.withText('その他'))//「その他」を選択
    .click(submitButton);
  await t.expect(citySelect.value).eql('3');
  //value=3のボタンが押される → #cityのvalueが3であることを確認
});

//
// test('テスト5. 満足度:目盛り', async t => {//動かない
//   const memori   = await Selector('input[type="range"]');
//   //const memoriOption = await memori.find("option").withAttribute("label","100%");
//   await t
//     .setNativeDialogHandler(() => true)
//     .click(memori)
//     .drag(memori, 50, 0, {
//       //offsetX: 10,
//       //offsetY: 10,
//       modifiers: {
//         //shift: true//マウス操作中にshiftキーを押す
//       }
//   })
//     .wait(2000)
//     //.click(memori);
//     await t.expect(memori.value).eql("100");
// });

test('テスト6. 複合テスト', async t => {
  testItem = async (tc: TestController) => { //testItemという名前で関数を定義(実行はされない)
    const userName   = await Selector('#user-name');
    const userJob = await Selector('#user-job3');
    const checker   = await Selector('#send-form').child('fieldset').child('label').child('input[value="3"]').withAttribute('type','checkbox');
    const citySelect  = await Selector('#city');
    const cityOption  = await citySelect.find('option');
    const note = await Selector('#note');
    const submitButton = await Selector('#submit-button');
    await t
      .setNativeDialogHandler(() => true)
      .click(userJob) // ラジオボタン
      .click(checker)//チェックボックス
      .click(citySelect)//ダウンメニュー
      .click(cityOption.withText('関東周辺'))
      .click(citySelect)//選びなおし
      .click(cityOption.withAttribute("value","3"))
      .typeText(note, '複合テスト')//文字入力
      .click(submitButton);//決定ボタン（遷移はしない）
    await t.expect(note.value)
      .contains('複合', '[複合]文字が含まれてない.');//右はエラー時のメッセージ?
  }
  await retry.reTry(testItem, t);//リトライ
});


test('テスト7.画面遷移のURLチェック', async t => {
  testItem = async (tc: TestController) => {
    const userName   = await Selector('#user-name');
    const submitButton = await Selector('#submit-button');
    const moveButton = await Selector("#page-move").child('input').withAttribute("type","button");
    await t
      .setNativeDialogHandler(() => true)
      .typeText(userName, 'うきた')
      .click(submitButton)
      .expect(t.eval(() => document.location.href)).eql("http://127.0.0.1:5500/1-thanks.html")
      .click(moveButton)//"戻る"ボタンをクリック
      .expect(t.eval(() => document.location.href)).eql("http://12a7.0.0.1:5500/");
    }
  await retry.reTry(testItem, t);//リトライ
});


test('テスト8.ダイアログ(true/false)', async t => {
  testItem = async (tc: TestController) => {
    const userName  = await Selector('#user-name');
    const submitButton = await Selector('#submit-button');
    await t
      .setNativeDialogHandler(() => false)//ダイアログ＝キャンセル
      .typeText(userName, '1回目!')
      .click(submitButton)
      .setNativeDialogHandler(() => true)//ダイアログ＝OK
      .typeText(userName, '2回目!')
      .click(submitButton)
      .expect(t.eval(() => document.location.href)).eql("http://127.0.0.1:5500/1-thanks.html") 
      const history = await t.getNativeDialogHistory();//ダイアログ履歴から文字列を取得
      await t.expect(history[0].text).eql("この内容で送信します。よろしいですか？");
      //ダイアログの文字が正しいかを確認
    }
    await retry.reTry(testItem, t);//リトライ
});



// export default function () {
//   return {
//       async reportTaskStart (startTime, userAgents, testCount) {
//           this.startTime = startTime;
//           this.testCount = testCount;

//           this.write(`Running tests in: ${userAgents}`)
//               .newline()
//               .newline();
//       },

//       async reportFixtureStart (name, path, meta) {
//           this.currentFixtureName = name;
//       },

//       async reportTestDone (name, testRunInfo, meta) {
//           const errors      = testRunInfo.errs;
//           const warnings    = testRunInfo.warnings;
//           const hasErrors   = !!errors.length;
//           const hasWarnings = !!warnings.length;
//           const result      = hasErrors ? `failed` : `passed`;

//           name = `${this.currentFixtureName} - ${name}`;

//           const title = `${result} ${name}`;

//           this.write(title);

//           if(hasErrors) {
//               this.newline()
//                   .write('Errors:');

//               errors.forEach(error => {
//                   this.newline()
//                       .write(this.formatError(error));
//               });
//           }

//           if(hasWarnings) {
//               this.newline()
//                   .write('Warnings:');

//               warnings.forEach(warning => {
//                   this.newline()
//                       .write(warning);
//               });
//           }
//       },

//       async reportTaskDone (endTime, passed, warnings, result) {
//           const durationMs  = endTime - this.startTime;
//           const durationStr = this.moment
//                                   .duration(durationMs)
//                                   .format('h[h] mm[m] ss[s]');
//           let footer = result.failedCount ?
//                       `${result.failedCount}/${this.testCount} failed` :
//                       `${result.passedCount} passed`;

//           footer += ` (Duration: ${durationStr})`;
//           footer += ` (Skipped: ${result.skippedCount})`;
//           footer += ` (Warnings: ${warnings.length})`;

//           this.write(footer)
//               .newline();
//       }
//   };
// }