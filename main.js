enchant();

//--------------------画像情報-----------------------------
var BG_IMG         = "./img/haikei4.png";
var PLAYER_IMG     = "./img/stand2_back07_ojisan.png";
var ENEMY_IMG      = "./img/ninin.png";

//--------------------定数-----------------------------
var STAGE_WIDTH       = 750;   // 画面横サイズ
var STAGE_HEIGHT      = 950;   // 画面縦サイズ
var FPS               = 20;    // フレームレート
//--------------------プレーヤー定数--------------------
var PLAYER_WIDTH      = 90;    // プレーヤー横サイズ
var PLAYER_HEIGHT     = 250;     // プレーヤー縦サイズ
var PLAYER_POSITION_X = (STAGE_WIDTH/2) - (PLAYER_WIDTH/2); //プレーヤー初期横位置
var PLAYER_POSITION_Y = (STAGE_HEIGHT * 8/10) - (PLAYER_HEIGHT/2); //プレーヤー初期縦位置
var PLAYER_SCALE_X    = 1.7;//プレーヤー横大きさ最終調整
var PLAYER_SCALE_Y    = 1.7;//プレーヤー縦大きさ最終調整
//--------------------エネミー定数-----------------------
var ENEMY_WIDTH       =  400;
var ENEMY_HEIGHT      =  500;
var ENEMY_POSITION_X  = (STAGE_WIDTH/2) - (ENEMY_WIDTH/2); //エネミー初期横位置
var ENEMY_POSITION_Y = (STAGE_HEIGHT * 1/10) - (ENEMY_HEIGHT/2); //エネミー初期縦位置
var ENEMY_SCALE_X = 0.2;
var ENEMY_SCALE_Y = 0.2;

window.onload = function(){
    var core = new Core(STAGE_WIDTH, STAGE_HEIGHT);
       core.preload(
           BG_IMG,
           PLAYER_IMG,
           ENEMY_IMG
    );
    core.fps = FPS;
    core.onload = function() {
        //背景の表示
        var bgimg = new Sprite(STAGE_WIDTH,STAGE_HEIGHT);
        bgimg.image = core.assets[BG_IMG];
        bgimg.x = 0;
        bgimg.y = 0;
        core.rootScene.addChild(bgimg);
        
        //背中おっさんの表示
        var backman = new Sprite(PLAYER_WIDTH, PLAYER_HEIGHT);
        backman.image = core.assets[PLAYER_IMG];
        
        backman.x = PLAYER_POSITION_X;
        backman.y = PLAYER_POSITION_Y;
        backman.scaleX = PLAYER_SCALE_X;
        backman.scaleY = PLAYER_SCALE_Y;
        core.rootScene.addChild(backman);
        
        var enemy = new Sprite(ENEMY_WIDTH, ENEMY_HEIGHT);
        enemy.image = core.assets[ENEMY_IMG];
        enemy.x = ENEMY_POSITION_X;
        enemy.y = ENEMY_POSITION_Y;
        enemy.scaleX = ENEMY_SCALE_X;
        enemy.scaleY = ENEMY_SCALE_Y;
        core.rootScene.addChild(enemy);
        enemy.on('enterframe',
            function (){
                this.x = backman.x;
                this.y += 5;
                this.scale(1.01, 1.01);
            });
        core.rootScene.addChild(this);
        //重なり順
    };
    core.start();
};

