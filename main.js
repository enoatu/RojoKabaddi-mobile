enchant();

var MYGAME = MYGAME || {};

MYGAME.namespace = function(ns_string){ //namespace
    var parts  = ns_string.split('.'),
        parent = MYGAME,
        i;
    if (parts[0] === "MYGAME"){
        parts = parts.slice(1);    
    }
    for (i = 0, len = parts.length; i < len; i++) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};    
        }
        parent = parent[parts[i]];
    }
};

//--------------------画像情報-----------------------------
MYGAME.IMG = {
    BG        : "./img/haikei4.png",
    PLAYER    : "./img/stand2_back07_ojisan.png",
    RESTART   : "./img/restart_button.png",
    ENEMY :  {
        1 : "./img/ninin.png",
        2 : "./img/business_man_macho.png",
        3 : "./img/car_jiko_aori_unten.png",
        4 : "./img/character_program_fast.png",
        5 : "./img/cycling_couple.png",
        6 : "./img/guruguru_woman.png",
        7 : "./img/hashiru_syokupan_woman.png",
        8 : "./img/safe.png",
        9 : "./img/runman.png",
        10 : "./img/runwoman.png",
        11 : "./img/syazai_man.png",
        12 : "./img/takuhaiin_run_man.png",
        13 : "./img/woman_macho.png"
    }
};

//--------------------ゲームシステム定数-----------------------------
MYGAME.SYSTEM = {
    WIDTH       : 750,   // 画面横サイズ
    HEIGHT      : 950,   // 画面縦サイズ
    FPS         : 40,     // フレームレート
    DEBUG       : true,
    POINT : {
        HOMING : {
            START :1/10,
            END : 5/10//ホーミング終了ポイント
        },
        JUDGE : {
            START : 6.5/10,
            END   : 7/10
        },
        PASSED   : 9/10 //通過判定ポイント
    }
};
//--------------------プレーヤー定数--------------------
MYGAME.PLAYER = {
    WIDTH    :  90,       // プレーヤー横サイズ
    HEIGHT   :  250,       // プレーヤー縦サイズ
    SCALE    : {
        X :    2.0,        //プレーヤー横大きさ最終調整
        Y :    2.0  //プレーヤー縦大きさ最終調整
    },
    NEXT : {
        SCALE : 0.94,
        ROTATE : 300,
        X     : 30,
        Y     : 30
    }
};
//--------------------エネミー定数-----------------------
MYGAME.ENEMY = {
    WIDTH    :  90,
    HEIGHT   :  200,
    SCALE    : {    
        X : 0.15,
        Y : 0.15
    },
    SPEED : 10, //初期速度
    NEXT : {
        SPEED : 2,
        SCALE :1.01
    }
   
};
//-------------------------------------------------------
function createGameScene() {
    var scene = new Scene();
    return scene;
}
window.onload = function() {
    var core = new Core(MYGAME.SYSTEM.WIDTH, MYGAME.SYSTEM.HEIGHT);
    var scale_h = window.innerHeight/MYGAME.SYSTEM.HEIGHT;
    　　　var scale_w = window.innerWidth/MYGAME.SYSTEM.WIDTH;
    　　　if (scale_h >= scale_w) {
        　　　　　core.scale = scale_w;
        　　　} else {
        　　　　　core.scale = scale_h;
        　　　}
    var amount = Object.keys(MYGAME.IMG.ENEMY).length;//エネミー数をキャッシュ
    core.preload(
        MYGAME.IMG.BG,
        MYGAME.IMG.PLAYER,
        MYGAME.IMG.RESTART
    );
    for(var i = 1; i <= amount; i++) {
        core.preload(MYGAME.IMG.ENEMY[i]);
    }
    core.fps = MYGAME.SYSTEM.FPS;
    core.onload = function() { 
        //--------表示---------------------
        //背景の表示
        var bgimg = new Sprite(MYGAME.SYSTEM.WIDTH, MYGAME.SYSTEM.HEIGHT);
        bgimg.image = core.assets[MYGAME.IMG.BG];
        bgimg.x = 0;
        bgimg.y = 0;
        core.rootScene.addChild(bgimg);

        //デバッグ用表示
        var label = new Label();
        label.x = 280;
        label.y = 5;
        label.color = 'red';
        label.font = '40px "Arial"';
        label.text = '';
        core.rootScene.addChild(label);
        //リスタートボタン
        var restart = new Sprite(231,43);
        restart.image = core.assets[MYGAME.IMG.RESTART];
        restart.x = 0;// MYGAME.SYSTEM.WIDTH/;
        restart.y = MYGAME.SYSTEM.HEIGHT* 9/10;
        //エネミーの表示
        var enemyCnt = 1;//エネミー数保持
        var enemy = new Sprite(MYGAME.ENEMY.WIDTH, MYGAME.ENEMY.HEIGHT);
        enemy.image = core.assets[MYGAME.IMG.ENEMY[1]];
        //enemy.scale(5, 5);
        initEnemy();

        //プレーヤーの表示
        var backman = new Sprite(MYGAME.PLAYER.WIDTH, MYGAME.PLAYER.HEIGHT);
        backman.image = core.assets[MYGAME.IMG.PLAYER];
        backman.x = (MYGAME.SYSTEM.WIDTH/2) - (MYGAME.PLAYER.WIDTH/2);
        backman.y = (MYGAME.SYSTEM.WIDTH * (9/10)) - (MYGAME.PLAYER.HEIGHT/2); //プレーヤー初期縦位置
        backman.scaleX = MYGAME.PLAYER.SCALE.X;
        backman.scaleY = MYGAME.PLAYER.SCALE.Y;
        
        //-------衝突判定--------------------------------------

        var enemy_W,//現時点での横幅
            enemy_HP,//現時点での縦座標
            addScale         = 1,//scale保持
            enemySpeed    = MYGAME.ENEMY.SPEED,//現時点でのスピード,
            homingEND_AP  = MYGAME.SYSTEM.HEIGHT * MYGAME.SYSTEM.POINT.HOMING.END,
            judgeSTART_AP = MYGAME.SYSTEM.HEIGHT * MYGAME.SYSTEM.POINT.JUDGE.START,
            judgeEND_AP   = MYGAME.SYSTEM.HEIGHT * MYGAME.SYSTEM.POINT.JUDGE.END,
            passed_AP     = MYGAME.SYSTEM.HEIGHT * MYGAME.SYSTEM.POINT.PASSED,
            deadFlag      = false;  //死亡フラグ

        //-------フレームごとに実行-----------------------
        enemy.on('enterframe', function (){
            
            //--- 常に動作----
            enemy_W   = this.width * this.scaleX;
            enemy_HP  = this.y + this.height * this.scaleY/2;
            scale     = MYGAME.ENEMY.NEXT.SCALE + enemyCnt/300;
            addScale *= scale;
            this.y   += enemySpeed;
            console.log(backman.y);
            this.scale(scale, scale);

            //---ホーミング-----------------------
            if (enemy_HP < homingEND_AP) {
                this.x = backman.x - enemy_W/2 + backman.width * backman.scaleX/2;
                // - enemy_W/2;
            }

            //----判定----------------------------
            if (judgeSTART_AP < enemy_HP && enemy_HP < judgeEND_AP ){
                if(backman.x < (this.x + enemy_W)        //左端
                    && (this.x < (backman.x + backman.width * backman.scaleX)) //右端
                ) {
                    label.text = 'DEAD!';
                    dead();//死亡
                } else {
                    label.text = 'still alive';
                }
            }

            //----無事に通過時-------------- 
            if(deadFlag === false && passed_AP < enemy_HP) {
                //core.pause();
                enemyPassed();
                initEnemy();
            }
            
            //----ドラッグイベント----
            var originX; // 位置保持変数
            if (!deadFlag) {
                backman.addEventListener(enchant.Event.TOUCH_START, function(e){
                    originX = e.x - this.x;
                });
                backman.addEventListener(enchant.Event.TOUCH_MOVE, function(e){
                    this.x = e.x - originX;
                });
            }    

            restart.addEventListener(Event.TOUCH_START, function(e) {
                //core.reload();
                restartOn();
            });

        });

        //----エネミー通過時----x
        function enemyPassed(){
            if (enemyCnt > amount) {
                success();
            } else {
            //画像変更
                enemy.image = core.assets[MYGAME.IMG.ENEMY[++enemyCnt]];
            }
            //スピード変更
                enemySpeed +=  MYGAME.ENEMY.NEXT.SPEED;
        };

        //----エネミー初期化----
        function initEnemy() {
            //大きさを初期値へ
            if (enemyCnt > 1) {
                enemy.scale(1/addScale, 1/addScale);//かけてる
                addScale = 1;
            }
            //位置を初期値へ
            enemy.x = (MYGAME.SYSTEM.WIDTH/2) - (MYGAME.ENEMY.WIDTH/2);    
            enemy.y = (MYGAME.SYSTEM.HEIGHT * 2/10) - (MYGAME.ENEMY.HEIGHT/2);
        };
       
        //----死亡時----
        function dead(){
            backman.onenterframe = function() {
                deadFlag = true; //死亡フラグ　オン
                this.rotate(MYGAME.PLAYER.NEXT.ROTATE);
                this.x += MYGAME.PLAYER.NEXT.X;
                this.y -= MYGAME.PLAYER.NEXT.Y;
                this.scale(MYGAME.PLAYER.NEXT.SCALE, MYGAME.PLAYER.NEXT.SCALE);
                if(this.y < -1000){core.pause();}
            };
        };

        //----クリア時----
        function success() {
            label.text = "おめでとう！このちょうしで頑張ろう";
            core.pause();
        }

        function restartOn() {
            c.replaceScene(createCoreScene());
            c.start();
            core.reload();
        }

        core.rootScene.addChild(enemy);
        core.rootScene.addChild(backman);
        //core.rootScene.addChild(restart);
       // insertBefore(backman, enemy);
    };
    core.start();
};
