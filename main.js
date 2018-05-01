enchant();

//--------------------画像情報-----------------------------
var BG_IMG         = "./img/haikei4.png";
var PLAYER_IMG     = "./img/stand2_back07_ojisan.png";
var ENEMY_IMG      = "./img/ninin.png";

// //--------------------定数-----------------------------
var STAGE_WIDTH       = 750;   // 画面横サイズ
var STAGE_HEIGHT      = 950;   // 画面縦サイズ
var FPS               = 20;    // フレームレート
var PLAYER_WIDTH      = 90;    // プレーヤー横サイズ
var PLAYER_HEIGHT     = 250;     // プレーヤー縦サイズ
var PLAYER_POSITION_X = STAGE_WIDTH /2 - PLAYER_WIDTH/2; //プレーヤー初期横位置
var PLAYER_POSITION_Y = STAGE_HEIGHT * 8 / 10 - PLAYER_HEIGHT / 2;
var PLAYER_SCALE_X    = 1.7;
var PLAYER_SCALE_Y    = 1.7;

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
        

        //重なり順
    };
    core.start();
};
