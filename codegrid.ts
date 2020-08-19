//https://app.codegrid.net/entry/2017-testcafe-1#toc-1 の例

import {Selector} from 'testcafe';
//ページを開く
fixture('アンケートフォーム')
  .page('https://cdn.codegrid.net/2017-testcafe/demo/1.html');

test('テスト1.必要項目を入力後、送信して遷移先を確認', async t => {
  const userName   = await Selector('#user-name');//#user-name=名前欄のID
  const submitButton = await Selector('#submit-button');
  await t
    .setNativeDialogHandler(() => true)//確認ダイアログでOKを押す
    .typeText(userName, 'うきた')//UserNameに名前を入力する
    .click(submitButton);//submitボタンをクリックする
    await t.expect(Selector('#thanks-message').innerText).eql('うきた様、アンケートにお答えいただき、ありがとうございました。');
    //ボタンを押した後に想定される文章がeqlと一致
});//ここまでが1つのテスト（必要項目を入力後、送信して遷移先を確認）

test('テスト2.', async t => {
  const userJob   = await Selector('#user-job');
  const submitButton = await Selector('#submit-button');
  await t
    .setNativeDialogHandler(() => true)//確認ダイアログでOKを押す
    .click(userJob.withText('ディレクター'))//ラジオボタン
    .click(submitButton);//submitボタンをクリックする
    //await t.expect(Selector('#thanks-message').innerText).eql('うきた様、アンケートにお答えいただき、ありがとうございました。');
    //ボタンを押した後に想定される文章がeqlと一致
});