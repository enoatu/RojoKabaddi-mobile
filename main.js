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
    FPS         : 50,     // フレームレート
    DEBUG       : true,
    HOMING_END  : {}
};
//--------------------プレーヤー定数--------------------
MYGAME.PLAYER = {
    WIDTH    :  90,       // プレーヤー横サイズ
    HEIGHT   :  250,       // プレーヤー縦サイズ
    SCALE    : {
        X :    2.0,        //プレーヤー横大きさ最終調整
        Y :    2.0  //プレーヤー縦大きさ最終調整
    }
};
//--------------------エネミー定数-----------------------
MYGAME.ENEMY = {
    WIDTH    :  400,
    HEIGHT   :  400,
    SCALE    : {    
        X : 0.19,
        Y : 0.19
    },
    SPEED : 5, //初期速度
    NEXTSPEED : 0.5
};
//-------------------------------------------------------

window.onload = function() {
    var core = new Core(MYGAME.SYSTEM.WIDTH, MYGAME.SYSTEM.HEIGHT);
    var amount = Object.keys(MYGAME.IMG.ENEMY).length;//エネミー数をキャッシュ
    console.log("amount : "+amount);
    console.log("amount : "+amount);

    core.preload(
        MYGAME.IMG.BG,
        MYGAME.IMG.PLAYER
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

        //エネミーの表示
        var enemyCnt = 1;//エネミー数保持
        var enemy = new Sprite(MYGAME.ENEMY.WIDTH, MYGAME.ENEMY.HEIGHT);
        enemy.image = core.assets[MYGAME.IMG.ENEMY[1]];
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
            enemySpeed = MYGAME.ENEMY.SPEED,//現時点でのスピード
            deadFlag = false;//死亡フラグ

        enemy.on('enterframe', function (){
            //--- 常に動作----
            enemy_W = this.width * this.scaleX;
            this.y += enemySpeed;
            this.scale(1.015, 1.015);
            //MYGAME.debug("scaleX: ", this.scaleX);
            // console.log("enemy_ww : " + (this.x + enemy_W/2));
            // console.log("backman_ww : " + (backman.x + backman.width * backman.scaleX/2));
            //console.log("backman.x" + backman.x);
            //console.log("this.x", this.x);
            //MYGAME.debugi("this.enemy_W", enemy_W);
           // console.log("backman.width * backman.scalex" + backman.width * backman.scaleX);
            //console.log(backman.x + " < " + this.x + " + " + enemy_W);
           // console.log(this.x + " < (" + backman.x + " + " + backman.width * backman.scaleX + " ) " );
            console.log("X : " + this.scaleX);
            console.log("Y : " + this.scaleY);
            //---ホーミング-----this.scaleX < 0.6 ----
            if (this.scaleX < 0.6) {
                this.x = backman.x - enemy_W/2;// backman.width * backman.scaleX/2 - enemy_W/2;
            }
            //---0.7 < this.scaleX かつ this.scale < 0.8 ----
            if (0.7 < this.scaleX && this.scaleX < 1.0 ){
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
            if(deadFlag === false && this.scaleX > 1.2) {
                //core.pause();
                
                enemyPassed();
                initEnemy();
            }
            //----ゲームオーバーしたあと-------------
            if(deadFlag === true){
                
            }

        });

        //----ドラッグイベント----
        var originX; // 位置保持変数
        if (deadFlag === false ) {
            backman.addEventListener(enchant.Event.TOUCH_START, function(e){
                originX = e.x - this.x;
                //originY = e.y - this.y;
                console.log("start");
            });
            backman.addEventListener(enchant.Event.TOUCH_MOVE, function(e){
                this.x = e.x - originX;
                //this.y = e.y - originY;
                console.log("move");
            });
        }
        
        //----エネミー通過時----x
        function enemyPassed(){
            if (enemyCnt > amount) {
                
            } else {
            //画像変更
                enemy.image = core.assets[MYGAME.IMG.ENEMY[++enemyCnt]];
            }
            //スピード変更
            enemySpeed +=  MYGAME.ENEMY.NEXTSPEED;
        };

        //----エネミー初期化----
        function initEnemy(){
            //大きさを初期値へ
            enemy.scale(MYGAME.ENEMY.SCALE.X, MYGAME.ENEMY.SCALE.Y);
            //位置を初期値へ
            enemy.x = (MYGAME.SYSTEM.WIDTH/2) - (MYGAME.ENEMY.WIDTH/2);    
            enemy.y = (MYGAME.SYSTEM.HEIGHT * 2/10) - (MYGAME.ENEMY.HEIGHT/2);
        };
       
        //----死亡時----
        function dead(){
            backman.onenterframe = function() {
                deadFlag = true; //死亡フラグ　オン
                this.rotate(300);
                this.x += 30;
                this.y -= 30;
                this.scale(0.94, 0.94);
            };
        };

        //----クリア時----
        function success(){
            game.pause();
            label.text = "おめでとう！このちょうしで頑張ろう";
    }

        core.rootScene.addChild(enemy);
        core.rootScene.addChild(backman);
        core.rootScene.addChild(this);
       // insertBefore(backman, enemy);
    };
    core.start();
};
