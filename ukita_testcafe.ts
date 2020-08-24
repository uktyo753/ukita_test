//https://app.codegrid.net/entry/2017-testcafe-1#toc-1 
// testcafeの動作確認　浮田誉之
//8/25

import {Selector} from 'testcafe';

fixture('アンケートフォームのテスト')
  .page('http://127.0.0.1:5500/');//LiveServer

test('テスト1.名前を入力後、送信して遷移先を確認', async t => {
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
});//ここまでが1つのテスト（必要項目を入力後、送信して遷移先を確認）


test('テスト1-B.名前が未入力の場合', async t => {
  const userName   = await Selector('#user-name');
  const submitButton = await Selector('#submit-button');
  await t
    .setNativeDialogHandler(() => true)
    //.typeText(userName, '')
    .click(submitButton);
  await t.expect(Selector('#user-name-error').innerText).eql('名前は必須項目です。')
   .expect(t.eval(() => document.location.href)).eql("http://127.0.0.1:5500/");
    //赤文字で「名前は必須項目です。」が表示されてるか調べたい
});


test('テスト2.職種：ラジオボタン', async t => {
  const userJob   = await Selector('#user-job2');
  const submitButton = await Selector('#submit-button');
  await t
    .setNativeDialogHandler(() => true)
    .click(userJob)//ラジオボタン
    .click(submitButton);//submitボタンをクリックする
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
  const userJob   = await Selector('#send-form').child('fieldset').child('label').child('input[value="2"]').withAttribute('type','checkbox');
  const submitButton = await Selector('#submit-button');
  await t
    .setNativeDialogHandler(() => true)
    .click(userJob)
    .click(Selector('#send-form').child('fieldset').child('label').child('input[value="3"]').withAttribute('type','checkbox'))
    //.wait(2000)
    .click(submitButton);
  await t.expect(userJob.checked).ok();
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

/* //動かない
test('テスト5. 満足度:目盛り', async t => {
  const memori   = await Selector('input[type="range"]');
  //const memoriOption = await memori.find("option").withAttribute("label","100%");
  await t
    .setNativeDialogHandler(() => true)
    .click(memori)
    .drag(memori, 50, 0, {
      //offsetX: 10,
      //offsetY: 10,
      modifiers: {
        //shift: true//マウス操作中にshiftキーを押す
      }
  })
    .wait(2000)
    //.click(memori);
    await t.expect(memori.value).eql("100");
});*/

test('テスト6. 複合テスト', async t => {
  const userName   = await Selector('#user-name');
  const userJob   = await Selector('#user-job3');
  const checker   = await Selector('#send-form').child('fieldset').child('label').child('input[value="3"]').withAttribute('type','checkbox');
  const citySelect  = await Selector('#city');
  const cityOption  = await citySelect.find('option');
  const note = await Selector("#note");
  const submitButton = await Selector('#submit-button');
  await t
    .setNativeDialogHandler(() => true)
    .click(userJob)//ラジオボタン
    .click(checker)//チェックボックス
    .click(citySelect)//ダウンメニュー
    .click(cityOption.withText('関東周辺'))
    .click(citySelect)//選びなおし
    .click(cityOption.withAttribute("value","3"))
    .typeText(note, '複合テスト')//文字入力
    //.wait(2000)
    .click(submitButton);
  await t.expect(note.value)
    .contains('複合', '[複合]文字が含まれてない.');//右はエラーメッセージ
});