import React, { useState } from 'react';
import GameLog from './GameLog';

const Battle = () => {
  //データの仮置き
  const currentUser = {
    nickname: "Matta",
    latest_avatar_url: "/player.png",
    latest_job: "Warrior",
    latest_status: {
      hp: 50,
      level: 10,
      strength: 15,
      intelligence: 9,
      wisdom: 4,
      dexterity: 90,
      charisma: 3,
    },
  };
  //データの仮置き
  const enemy = {
    name: "魔王（開発中）",
    hp: 50,
    attack: 10,
    defence: 10,
    enemy_url: "/monster.png",
  };

  const [playerHP, setPlayerHP] = useState(currentUser.latest_status.hp);
  const [enemyHP, setEnemyHP] = useState(enemy.hp);
  const [gameLog, setGameLog] = useState(["モンスターが現れた！"]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [attackTimeoutId, setAttackTimeoutId] = useState(null);

  const attack = (attackType) => {
    if (gameOver) return;

    setGameLog([]);
    setIsAttacking(true);

    //ダメージ計算式
    const playerAttack = Math.floor(Math.random() * (currentUser.latest_status.strength * 2)) + 1;
    const playerMagic = Math.floor(Math.random() * (currentUser.latest_status.intelligence * 2)) + 1;
    const playerDamage = attackType === 'attack' ? playerAttack - Math.floor(enemy.defence / 3) : playerMagic - Math.floor(enemy.defence / 2);
    const finalPlayerDamage = playerDamage < 1 ? 1 : playerDamage;

    const enemyAttack = Math.floor(Math.random() * (enemy.attack * 2)) + 1;
    const playerDefence = Math.floor((currentUser.latest_status.strength * 0.3) + (currentUser.latest_status.wisdom * 0.5));
    const enemyDamage = enemyAttack - playerDefence;
    const finalEnemyDamage = enemyDamage < 1 ? 1 : enemyDamage;

    const playerGoesFirst = Math.random() < 0.5;
    //dexterityによってダブルアタック
    const doubleAttackChance = currentUser.latest_status.dexterity / 100;

    setTimeout(() => {
    if (gameOver) return;

    if (playerGoesFirst) {
      setEnemyHP(Math.max(0, enemyHP - finalPlayerDamage));
      setGameLog(prevLog => [...prevLog, `プレーヤーの${attackType === 'attack' ? '攻撃' : 'まほう'}、${finalPlayerDamage}のダメージ`]);

      let totalDamage = finalPlayerDamage;

      if (Math.random() < doubleAttackChance) {
        const doubleAttackDamage = finalPlayerDamage;
        setEnemyHP(Math.max(0, enemyHP - finalPlayerDamage - doubleAttackDamage));
        setGameLog(prevLog => [...prevLog, `プレーヤーの2回連続攻撃発動！さらに${doubleAttackDamage}のダメージ`]);
        totalDamage += doubleAttackDamage;
      }

      if (enemyHP - totalDamage <= 0) {
        setGameLog(['モンスターをたおした']);
        setShowRestart(true);
        setGameOver(true);
        setIsAttacking(false);
        return;
      }
    } else {
      setPlayerHP(Math.max(0, playerHP - finalEnemyDamage));
      setGameLog(prevLog => [...prevLog, `モンスターの攻撃、${finalEnemyDamage}のダメージ`]);
      triggerShakeEffect();
      if (playerHP - finalEnemyDamage <= 0) {
        setGameLog(['全滅した']);
        setShowRestart(true);
        setGameOver(true);
        setIsAttacking(false);
        return;
      }
    }

    const timeoutId = setTimeout(() => {
      if (gameOver) return;

      if (playerGoesFirst) {
        if (enemyHP > 0) {
          setPlayerHP(Math.max(0, playerHP - finalEnemyDamage));
          setGameLog(prevLog => [...prevLog, `モンスターの攻撃、${finalEnemyDamage}のダメージ`]);
          triggerShakeEffect();
          if (playerHP - finalEnemyDamage <= 0) {
            setGameLog(['全滅した']);
            setShowRestart(true);
            setGameOver(true);
            setIsAttacking(false);
            return;
          }
        }
      } else {
        setEnemyHP(Math.max(0, enemyHP - finalPlayerDamage));
        setGameLog(prevLog => [...prevLog, `プレーヤーの${attackType === 'attack' ? '攻撃' : 'まほう'}、${finalPlayerDamage}のダメージ`]);

        let totalDamage = finalPlayerDamage;

        if (Math.random() < doubleAttackChance) {
          const doubleAttackDamage = finalPlayerDamage;
          setEnemyHP(Math.max(0, enemyHP - finalPlayerDamage - doubleAttackDamage));
          setGameLog(prevLog => [...prevLog, `プレーヤーの2回連続攻撃発動！さらに${doubleAttackDamage}のダメージ`]);
          totalDamage += doubleAttackDamage;
        }

        if (enemyHP - totalDamage <= 0) {
          setGameLog(['モンスターをたおした']);
          setShowRestart(true);
          setGameOver(true);
          setIsAttacking(false);
          return;
        }
      }
      setIsAttacking(false);
    }, 1000);

    setAttackTimeoutId(timeoutId);
  }, 1000);
};

  const restartGame = () => {
    if (attackTimeoutId) {
      clearTimeout(attackTimeoutId);
    }
    setPlayerHP(currentUser.latest_status.hp);
    setEnemyHP(enemy.hp);
    setGameLog(["モンスターが現れた！"]);
    setShowRestart(false);
    setGameOver(false);
    setAttackTimeoutId(null);
  };
  // 被ダメージ時に画面を揺らす
  const triggerShakeEffect = () => {
  const body = document.body;
  body.classList.add("shake-animation");

  setTimeout(() => {
    body.classList.remove("shake-animation");
  }, 500); // アニメーションの時間に合わせてクラスを削除
};


  return (
    <div className="min-h-screen bg-base-100 py-10">
      {/* 上部: グラフィックコンテナ */}
      <div className="bg-center mx-auto py-8 max-w-4xl" style={{ backgroundImage: "url('/background.png')", backgroundPosition: 'center bottom' }}>
        <div className="container mx-auto max-w-4xl">
          <div className="relative">
            <div className={`bg-base-200 p-4 rounded-box mb-4 inline-block `}>
              <h2 className="text-2xl font-bold">{enemy.name}</h2>
              <p className="text-lg">HP: {enemyHP}</p>
            </div>
            <div className="aspect-w-1 aspect-h-1 mx-auto" style={{maxWidth: '300px'}}>
              <img src={enemy.enemy_url} alt="Monster" className={`object-contain ${enemyHP <= 0 ? 'opacity-0' : ''}`} />
            </div>
          </div>
        </div>
      </div>


      {/* 下部: プレイヤーウィンドウとバトルログ */}
       <div className="container mx-auto py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-4">
          {/* 左側: プレイヤー情報 */}
           <div className={`bg-base-200 p-4 rounded-box ${playerHP <= 0 ? 'opacity-50' : ''}`}>
            <div className="flex items-center mb-4">
              <img src={currentUser.latest_avatar_url} alt="Player" className="w-16 h-16 rounded-xl mr-4" />
              <div>
                <h2 className="text-xl font-bold">{currentUser.nickname}</h2>
                <p className="text-lg">HP: {playerHP}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className={`btn btn-primary btn-block ${isAttacking || playerHP <= 0 || enemyHP <= 0 ? 'loading btn-disabled' : ''}`}
                onClick={() => attack('attack')}
                disabled={isAttacking || playerHP <= 0 || enemyHP <= 0}
              >
                {isAttacking || playerHP <= 0 || enemyHP <= 0 ? 'たたかえない！' : 'たたかう'}
              </button>
              {showRestart && (
                <div className="flex space-x-2">
                  <button className="btn btn-accent btn-block mt-2" onClick={restartGame}>再戦</button>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-3">
              <button
                className={`btn btn-primary btn-block ${isAttacking || playerHP <= 0 || enemyHP <= 0 ? 'loading btn-disabled' : ''}`}
                onClick={() => attack('magic')}
                disabled={isAttacking || playerHP <= 0 || enemyHP <= 0}
              >
                {isAttacking || playerHP <= 0 || enemyHP <= 0 ? 'たたかえない！' : 'まほう'}
              </button>
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