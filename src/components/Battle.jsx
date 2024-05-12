import React, { useState } from 'react';
import GameLog from './GameLog';

const Battle = () => {
  const [playerHP, setPlayerHP] = useState(15);
  const [monsterHP, setMonsterHP] = useState(15);
  const [gameLog, setGameLog] = useState(["モンスターが現れた！"]);
  const [isAttacking, setIsAttacking] = useState(false);  // 攻撃中かどうかを追跡
  const [showRestart, setShowRestart] = useState(false);  // 再戦ボタンの表示制御
  const [gameOver, setGameOver] = useState(false);  // ゲーム終了フラグ
  const [attackTimeoutId, setAttackTimeoutId] = useState(null);  // 後攻の攻撃タイマーID

  const attack = () => {
    if (gameOver) return;  // ゲームが終了していたら攻撃を行わない

    setGameLog([]);
    setIsAttacking(true);
  
    const playerAttack = Math.floor(Math.random() * 6) + 1;
    const monsterAttack = Math.floor(Math.random() * 6) + 1;
    
    const playerGoesFirst = Math.random() < 0.5;

    setTimeout(() => {
      if (gameOver) return;  // ゲーム終了フラグが立っていたら処理を中断

      if (playerGoesFirst) {
        setMonsterHP(Math.max(0, monsterHP - playerAttack));  // 0未満にならないように
        setGameLog(prevLog => [...prevLog, `プレーヤーの攻撃、${playerAttack}のダメージ`]);
        if (monsterHP - playerAttack <= 0) {
          setGameLog(['モンスターをたおした']);
          setShowRestart(true);
          setGameOver(true);
          setIsAttacking(false);
          return;
        }
      } else {
        setPlayerHP(Math.max(0, playerHP - monsterAttack));  // 0未満にならないように
        setGameLog(prevLog => [...prevLog, `モンスターの攻撃、${monsterAttack}のダメージ`]);
        if (playerHP - monsterAttack <= 0) {
          setGameLog(['全滅した']);
          setShowRestart(true);
          setGameOver(true);
          setIsAttacking(false);
          return;
        }
      }

    // 後攻の攻撃
    const timeoutId = setTimeout(() => {
        if (gameOver) return;  // ゲーム終了フラグが立っていたら処理を中断

        if (playerGoesFirst) {
          setPlayerHP(Math.max(0, playerHP - monsterAttack));  // 0未満にならないように
          setGameLog(prevLog => [...prevLog, `モンスターの攻撃、${monsterAttack}のダメージ`]);
          if (playerHP - monsterAttack <= 0) {
            setGameLog(['全滅した']);
            setShowRestart(true);
            setGameOver(true);
            setIsAttacking(false);
            return;
          }
        } else {
          setMonsterHP(Math.max(0, monsterHP - playerAttack));  // 0未満にならないように
          setGameLog(prevLog => [...prevLog, `プレーヤーの攻撃、${playerAttack}のダメージ`]);
          if (monsterHP - playerAttack <= 0) {
            setGameLog(['モンスターをたおした']);
            setShowRestart(true);
            setGameOver(true);
            setIsAttacking(false);
            return;
          }
        }
        setIsAttacking(false);
      }, 1000);

      setAttackTimeoutId(timeoutId);  // タイマーIDを保存
    }, 1000);
  };
  
  // 再戦関数
const restartGame = () => {
    if (attackTimeoutId) {
      clearTimeout(attackTimeoutId);  // スケジュールされている後攻の攻撃をキャンセル
    }
    setPlayerHP(15);
    setMonsterHP(15);
    setGameLog(["モンスターが現れた！"]);
    setShowRestart(false);
    setGameOver(false);
    setAttackTimeoutId(null);  // タイマーIDをリセット
  };

   return (
  <div className="min-h-screen bg-base-100 py-10">
    {/* 上部: グラフィックコンテナ */}
    <div className=" bg-center mx-auto py-8 max-w-4xl " style={{backgroundImage: "url('/background.png')"}}>
      <div className="container mx-auto max-w-4xl">
        <div className="relative">
          {monsterHP > 0 && (
            <div className="bg-base-200 p-4 rounded-box mb-4 inline-block">
              <h2 className="text-2xl font-bold">らんてくん零式</h2>
              <p className="text-lg">HP: {monsterHP}</p>
            </div>
          )}
          {monsterHP > 0 && (
            <div className="aspect-w-1 aspect-h-1 mx-auto" style={{maxWidth: '300px'}}>
              <img src="/monster.png" alt="Monster" className="object-contain" />
            </div>
          )}
        </div>
      </div>
    </div>

    {/* 下部: プレイヤーウィンドウとバトルログ */}
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-4">
        {/* 左側: プレイヤー情報 */}
        <div className={`bg-base-200 p-4 rounded-box ${playerHP <= 0 ? 'opacity-50' : ''}`}>
          <div className="flex items-center mb-4">
            <img src="/player.png" alt="Player" className="w-16 h-16 rounded-xl mr-4" />
            <div>
              <h2 className="text-xl font-bold">MaTTa</h2>
              <p className="text-lg">HP: {playerHP}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              className={`btn btn-primary btn-block ${isAttacking || playerHP <= 0 || monsterHP <= 0 ? 'loading btn-disabled' : ''}`}
              onClick={attack}
              disabled={isAttacking || playerHP <= 0 || monsterHP <= 0}
            >
              {isAttacking || playerHP <= 0 || monsterHP <= 0 ? 'たたかえない！' : 'たたかう'}
            </button>
            {showRestart && (
              <button className="btn btn-accent btn-block mt-2" onClick={restartGame}>再戦</button>
            )}
             </div>
            
        </div>

        {/* 右側: バトルログ */}
        <div className="bg-base-200 p-4 rounded-box md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">バトルログ</h2>
          <GameLog logs={gameLog} isPlayerDefeated={playerHP <= 0} />
        </div>
      </div>
    </div>
  </div>
);
};

export default Battle;
