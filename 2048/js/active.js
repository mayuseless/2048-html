//定义数组对象，用来保存游戏数字及位置
var board = new Array();
//全局变量可不声明var
// localStorage.setItem("key","value");                   // 存储变量名为key，值为value的变量
// localStorage.key = "value"                             // 同setItem方法，存储数据
// let past_score = localStorage.getItem("past_score");          // 读取存储变量名为key的值
const cellSpace = 20;
const cellSideLength = 100;

var past_Score =0;
var score =0;

//网页页面加载完成后,执行逻辑
$(function (){
    // alert('页面加载完成');//弹窗输出
    newGame();
    //读取本地存储最高分
    var a = localStorage.getItem( 'past_Score' )
    if(a !=null){
        past_Score = a;
        $("#past_score").text(past_Score);
    }
})

function updateMaxScore(){
    //如果当前分数大于最高分，我们就要更新最高分
    if( score > past_Score){
        past_Score =score;
        //把最高分存储到本地
        localStorage.setItem('past_Score',past_Score);
        $("#past_score").text(past_Score);
    }
}
//用于更新分数
function updateScore(){
    $("#score").text(score);
    updateMaxScore();
}

function newGame(){
    //重开游戏，清空数据
    init();
    updateBoardView();
    generateNum();
    generateNum();

    score =0;
    updateScore();
}

function init(){
    for (var i=0; i<4; i++){
        board[i] = new Array();
        //默认为一维数组
        for (var j=0; j<4; j++){
            board[i][j] =0;
        }
    }
}

//判断游戏是否还有空闲格子
function nospace(){
    for (var i=0; i<4; i++){
        for (var j=0; j<4; j++){
            if(board[i][j] ===0){
                return false;
            }
        }
    }
    return true;
}


//用来生成随机数函数
function generateNum(){
    if(nospace()){
        return false;
    }
    //随机生成2或4,概率相等
    var randNum = Math.random() <0.5 ? 2 : 4;
    // alert(randNum);//弹出框
    var randx =0;
    var randy =0;
    var times =0;
    while (times <50){
        //0,1,2,3取整,parseInt转整数
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
        //board[randy][randx] == 0 对于没有框位置，则可以生成
        if(board[randy][randx] === 0){
            break;
        }
        times++;
    }
    //某次,位置不重合,可生成,则占用board矩
    board[randy][randx] = randNum;
    showNum(randy,randx,randNum);
}

//根据不同的数字，使用不同的背景颜色
function getBGColor(num){
    switch (num){
        case 2:return '#eee4da';
        case 4:return '#ede0c8';
        case 8:return '#f2b179';
        case 16:return '#f59563';
        case 32:return '#f67e5f';
        case 64:return '#f65e3b';
        case 128:return '#edcf72';
        case 256:return '#edcc61';
        case 512:return '#9c0';
        case 1024:return '#33b5e5';
        case 2048:return '#09c';
        case 4096:return '#a6c';
        case 8192:return '#94c';
    }
}

function getNumColor(num){
    if(num<=4){
        return '#776e65';
    }
    return 'white';
}


//将i,j显示
function showNum(i,j,num){
    //通过i和j，可以拼接出对应的div的id，然后使用id选择器找到对应的div
    var cell = $("#number-cell-" +i+ "-" +j);
    //对不同数生成不同色
    cell.css('background-color',getBGColor(num));
    cell.css('color',getNumColor(num));
    cell.text(num);

    //显示动画效果
    cell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top: getPos(i),
        left: getPos(j)
    }, 200);
}

//求当前行离div距离,第pos行,第pos列
function getPos(pos){
    return cellSpace +pos * (cellSideLength +cellSpace);
}

//在背景上面生成数字图层
function updateBoardView( ){
    //删除以前数据id="number-cell，否则newGame保留内容
    //把使用了numm-cell样式div删掉
    $(".num-cell").remove();
    for(var i=0; i<4; i++){//行
        for(var j=0; j<4; j++){
            $("#gird-container").append('<div class="num-cell" id="number-cell-' +i+ '-' +j+ '"></div>');
            var cur = $("#number-cell-" +i+ "-" +j)
            //判断当前位置有没有数字
            if(board[i][j] === 0){
                //style-css-自定义样式文件class  会被style定义覆盖
                cur.css('width','0px');
                cur.css('height','0px');
                //此时则无,即刷新时候对0无则无
                cur.css('top',getPos(i) + cellSideLength*0.5);
                cur.css('left',getPos(j) + cellSideLength*0.5);
            } else {
                cur.css('top',getPos(i));
                cur.css('left',getPos(j));
                //对不同数生成不同色
                cur.css('background-color',getBGColor(board[i][j]));
                cur.css('color',getNumColor(board[i][j]));
                //设置div内显示的内容
                cur.text(board[i][j]);
            }
        }
    }
}

//判断水平方向是不是没有障碍的方法
function noBlockHorizontal(row,col1,col2){
    for (var i=col1+1; i<col2 ; i++){
        if (board[row][i] !==0){
            return false;
        }
    }
    return true;
}

//判断格子能不能向左移动
function canMoveLeft(){
    for (var i=0; i<4; i++){
        for (var j=1; j<4; j++){
            if(board[i][j] !==0){
                //如果当前位置是数字,判断该数字左边是不是空
                // 或者左边与当前位置数字是否相同
                if(board[i][j-1] ===0 || board[i][j-1] ===board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

//向左移动
function moveLeft(){
    if(!canMoveLeft()){
        return false;
    }
    for(var i=0; i<4; i++){
        for(var j=1; j<4; j++){
            //如果当前位置没有数据,跳过
            if(board[i][j] === 0){
                continue;
            }
            for (var k=0; k<j; k++){
                //如果当前位置为空
                if(board[i][k] === 0 && noBlockHorizontal(i,k,j)){
                    //把改格子右边格左移
                    board[i][k] =board[i][j];
                    board[i][j] =0;
                    showMoveAnimation(i,j, i,k);
                    break;
                }
                //如果两个位置的数据是一样的，则进行合并
                if(board[i][k] === board[i][j] && noBlockHorizontal(i,k,j)){
                    board[i][k] += board[i][j];
                    board[i][j] = 0;
                    score = score + board[i][k];
                    updateScore();
                    showMoveAnimation(i,j, i,k);
                    break;
                }
        }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

//判断格子能不能向右移动
function canMoveRight(){
    for (var i=0; i<4; i++){
        for (var j=2; j>=0; j--){
            if(board[i][j] !==0){
                //如果当前位置是数字,判断该数字右边是不是空
                // 或者右边与当前位置数字是否相同
                if(board[i][j+1] ===0 || board[i][j+1] ===board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function moveRight(){
    if(!canMoveRight()){
        return false;
    }
    for(var i=0; i<4; i++){
        for(var j=2; j>=0; j--){
            //如果当前位置没有数据,跳过
            if(board[i][j] === 0){
                continue;
            }
            for (var k=3; k>j; k--){
                //如果当前位置为空
                if(board[i][k] === 0 && noBlockHorizontal(i,j,k)){
                    //把改格子右边格左移
                    board[i][k] =board[i][j];
                    board[i][j] =0;
                    showMoveAnimation(i,j, i,k);
                    break;
                }
                if(board[i][k] === board[i][j] && noBlockHorizontal(i,j,k)){
                    board[i][k] += board[i][j];
                    board[i][j] = 0;
                    score = score + board[i][k];
                    updateScore();
                    showMoveAnimation(i,j, i,k);
                    break;
                }
            }
        }
    }
    //更新游戏图层,否则div错乱
    setTimeout("updateBoardView()",200);
    return true;
}

//判断竖直方向是不是没有障碍的方法
function noBlockVertical(col,row1,row2){
    for (var i=row1+1; i<row2 ; i++){
        if (board[i][col] !==0){
            return false;
        }
    }
    return true;
}

//判断格子能不能向上移动
function canMoveUp(){
    for (var i=1; i<4; i++){
        for (var j=0; j<4; j++){
            if(board[i][j] !==0){
                //如果当前位置是数字,判断该数字上边是不是空
                // 或者上边与当前位置数字是否相同
                if(board[i-1][j] ===0 || board[i-1][j] ===board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function moveUp(){
    if(!canMoveUp()){
        return false;
    }
    for(var j=0; j<4; j++){
        for(var i=1; i<4; i++){
            //如果当前位置没有数据,跳过
            if(board[i][j] === 0){
                continue;
            }
            for (var k=0; k<i; k++){
                //如果当前位置为空
                if(board[k][j] === 0 && noBlockVertical(j,k,i)){
                    //把改格子右边格左移
                    board[k][j] =board[i][j];
                    board[i][j] =0;
                    showMoveAnimation(i,j, k,j);
                    break;
                }
                if(board[k][j] === board[i][j]  && noBlockVertical(j,k,i)){
                    board[k][j] += board[i][j];
                    board[i][j] = 0;
                    score = score + board[k][j];
                    updateScore();
                    showMoveAnimation(i,j, k,j);
                    break;
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

//判断格子能不能向下移动
function canMoveDown(){
    for (var i=2; i>=0; i--){
        for (var j=0; j<4; j++){
            if(board[i][j] !==0){
                //如果当前位置是数字,判断该数字下边是不是空
                // 或者下边与当前位置数字是否相同
                if(board[i+1][j] ===0 || board[i+1][j] ===board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function moveDown(){
    if(!canMoveDown()){
        return false;
    }
    for(var j=0; j<4; j++){
        for(var i=2; i>=0; i--){
            //如果当前位置没有数据,跳过
            if(board[i][j] === 0){
                continue;
            }
            for (var k=3; k>i; k--){
                //如果当前位置为空
                if(board[k][j] === 0  && noBlockVertical(j,i,k)){
                    //把改格子右边格左移
                    board[k][j] =board[i][j];
                    board[i][j] =0;
                    showMoveAnimation(i,j, k,j);
                    break;
                }
                if(board[k][j] === board[i][j]  && noBlockVertical(j,i,k)){
                    board[k][j] += board[i][j];
                    board[i][j] = 0;
                    score = score + board[k][j];
                    updateScore();
                    showMoveAnimation(i,j, k,j);
                    break;
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

//展示移动效果的动画
function showMoveAnimation(fromY,fromX,toY,toX){
    var cell = $("#number-cell-" +fromY+ "-" +fromX);
    cell.animate({
        top: getPos(toY),
        left: getPos(toX)
    },200);
}

//判断游戏是否已经无路可走
function noMove(){
    return !(canMoveUp() || canMoveDown() || canMoveLeft() || canMoveRight());
}

//判断游戏是否已经结束
function isGameOver(){
    if(nospace() && noMove()){
        alert("GameOver!");
    }
}

//监听键盘的上下左右按键
$(document).keydown(function (event) {
    // alert(event.keyCode)//弹窗输出,ascll码
    //左上右下37 38 39 40
    switch (event.keyCode){
        case 32:
            newGame();
            localStorage.setItem('past_Score',0);
            $("#past_score").text(0);
            past_Score =0;
            break;
        case 37:
            if(moveLeft()){
                setTimeout("generateNum()",210);
                setTimeout( "isGameOver()",250);
            }
            break;
        case 38:
            if(moveUp()){
                setTimeout("generateNum()",210);
                setTimeout( "isGameOver()",250);
            }
            break;
        case 39:
            if(moveRight()){
                setTimeout("generateNum()",210);
                setTimeout( "isGameOver()",250);
            }
            break;
        case 40:
            if(moveDown()){
                setTimeout("generateNum()",210);
                setTimeout( "isGameOver()",250);
            }
            break;
    }
})
