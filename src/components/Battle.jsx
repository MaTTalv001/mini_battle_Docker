import React, { useState } from 'react';
import GameLog from './GameLog';

const Battle = () => {
  const [playerHP, setPlayerHP] = useState(15);
  const [monsterHP, setMonsterHP] = useState(15);
  const [gameLog, setGameLog] = useState([]);
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
    setGameLog([]);
    setShowRestart(false);
    setGameOver(false);
    setAttackTimeoutId(null);  // タイマーIDをリセット
  };

   return (
    <div>
       <div className="battle-area">
         {monsterHP > 0 && (  // モンスターのHPが0より大きい時だけ画像を表示
           <div className="monster-info-window">
             <div className="monster-info">
               <strong>らんてくん零式</strong>
               <p>HP: {monsterHP}</p>
             </div>
           </div>
         )}
         {monsterHP > 0 && (  // モンスターのHPが0より大きい時だけ画像を表示
          <div className="monster-area">
            <img src="/monster.png" alt="Monster" className="monster-image" />
          </div>
         )}
      </div>
      <div className="bottom-area">
      <div className={`player-area ${playerHP <= 0 ? 'player-defeated' : ''}`}> 
           <strong>MaTTa</strong>
           <p> HP: {playerHP}</p>
           <div>
             <button onClick={attack} disabled={isAttacking || playerHP <= 0 || monsterHP <= 0 || showRestart}>たたかう</button>
           </div>
           <div>
           {showRestart && (
             <button onClick={restartGame}>再戦</button>
             )}
             </div>
      </div>
      <GameLog logs={gameLog} isPlayerDefeated={playerHP <= 0} />
    </div>
  </div>
  );
};


export default Battle;
