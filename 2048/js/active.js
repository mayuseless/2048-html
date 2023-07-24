//���������������������Ϸ���ּ�λ��
var board = new Array();
//ȫ�ֱ����ɲ�����var
// localStorage.setItem("key","value");                   // �洢������Ϊkey��ֵΪvalue�ı���
// localStorage.key = "value"                             // ͬsetItem�������洢����
// let past_score = localStorage.getItem("past_score");          // ��ȡ�洢������Ϊkey��ֵ
const cellSpace = 20;
const cellSideLength = 100;

var past_Score =0;
var score =0;

//��ҳҳ�������ɺ�,ִ���߼�
$(function (){
    // alert('ҳ��������');//�������
    newGame();
    //��ȡ���ش洢��߷�
    var a = localStorage.getItem( 'past_Score' )
    if(a !=null){
        past_Score = a;
        $("#past_score").text(past_Score);
    }
})

function updateMaxScore(){
    //�����ǰ����������߷֣����Ǿ�Ҫ������߷�
    if( score > past_Score){
        past_Score =score;
        //����߷ִ洢������
        localStorage.setItem('past_Score',past_Score);
        $("#past_score").text(past_Score);
    }
}
//���ڸ��·���
function updateScore(){
    $("#score").text(score);
    updateMaxScore();
}

function newGame(){
    //�ؿ���Ϸ���������
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
        //Ĭ��Ϊһά����
        for (var j=0; j<4; j++){
            board[i][j] =0;
        }
    }
}

//�ж���Ϸ�Ƿ��п��и���
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


//�����������������
function generateNum(){
    if(nospace()){
        return false;
    }
    //�������2��4,�������
    var randNum = Math.random() <0.5 ? 2 : 4;
    // alert(randNum);//������
    var randx =0;
    var randy =0;
    var times =0;
    while (times <50){
        //0,1,2,3ȡ��,parseIntת����
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
        //board[randy][randx] == 0 ����û�п�λ�ã����������
        if(board[randy][randx] === 0){
            break;
        }
        times++;
    }
    //ĳ��,λ�ò��غ�,������,��ռ��board��
    board[randy][randx] = randNum;
    showNum(randy,randx,randNum);
}

//���ݲ�ͬ�����֣�ʹ�ò�ͬ�ı�����ɫ
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


//��i,j��ʾ
function showNum(i,j,num){
    //ͨ��i��j������ƴ�ӳ���Ӧ��div��id��Ȼ��ʹ��idѡ�����ҵ���Ӧ��div
    var cell = $("#number-cell-" +i+ "-" +j);
    //�Բ�ͬ�����ɲ�ͬɫ
    cell.css('background-color',getBGColor(num));
    cell.css('color',getNumColor(num));
    cell.text(num);

    //��ʾ����Ч��
    cell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top: getPos(i),
        left: getPos(j)
    }, 200);
}

//��ǰ����div����,��pos��,��pos��
function getPos(pos){
    return cellSpace +pos * (cellSideLength +cellSpace);
}

//�ڱ���������������ͼ��
function updateBoardView( ){
    //ɾ����ǰ����id="number-cell������newGame��������
    //��ʹ����numm-cell��ʽdivɾ��
    $(".num-cell").remove();
    for(var i=0; i<4; i++){//��
        for(var j=0; j<4; j++){
            $("#gird-container").append('<div class="num-cell" id="number-cell-' +i+ '-' +j+ '"></div>');
            var cur = $("#number-cell-" +i+ "-" +j)
            //�жϵ�ǰλ����û������
            if(board[i][j] === 0){
                //style-css-�Զ�����ʽ�ļ�class  �ᱻstyle���帲��
                cur.css('width','0px');
                cur.css('height','0px');
                //��ʱ����,��ˢ��ʱ���0������
                cur.css('top',getPos(i) + cellSideLength*0.5);
                cur.css('left',getPos(j) + cellSideLength*0.5);
            } else {
                cur.css('top',getPos(i));
                cur.css('left',getPos(j));
                //�Բ�ͬ�����ɲ�ͬɫ
                cur.css('background-color',getBGColor(board[i][j]));
                cur.css('color',getNumColor(board[i][j]));
                //����div����ʾ������
                cur.text(board[i][j]);
            }
        }
    }
}

//�ж�ˮƽ�����ǲ���û���ϰ��ķ���
function noBlockHorizontal(row,col1,col2){
    for (var i=col1+1; i<col2 ; i++){
        if (board[row][i] !==0){
            return false;
        }
    }
    return true;
}

//�жϸ����ܲ��������ƶ�
function canMoveLeft(){
    for (var i=0; i<4; i++){
        for (var j=1; j<4; j++){
            if(board[i][j] !==0){
                //�����ǰλ��������,�жϸ���������ǲ��ǿ�
                // ��������뵱ǰλ�������Ƿ���ͬ
                if(board[i][j-1] ===0 || board[i][j-1] ===board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

//�����ƶ�
function moveLeft(){
    if(!canMoveLeft()){
        return false;
    }
    for(var i=0; i<4; i++){
        for(var j=1; j<4; j++){
            //�����ǰλ��û������,����
            if(board[i][j] === 0){
                continue;
            }
            for (var k=0; k<j; k++){
                //�����ǰλ��Ϊ��
                if(board[i][k] === 0 && noBlockHorizontal(i,k,j)){
                    //�Ѹĸ����ұ߸�����
                    board[i][k] =board[i][j];
                    board[i][j] =0;
                    showMoveAnimation(i,j, i,k);
                    break;
                }
                //�������λ�õ�������һ���ģ�����кϲ�
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

//�жϸ����ܲ��������ƶ�
function canMoveRight(){
    for (var i=0; i<4; i++){
        for (var j=2; j>=0; j--){
            if(board[i][j] !==0){
                //�����ǰλ��������,�жϸ������ұ��ǲ��ǿ�
                // �����ұ��뵱ǰλ�������Ƿ���ͬ
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
            //�����ǰλ��û������,����
            if(board[i][j] === 0){
                continue;
            }
            for (var k=3; k>j; k--){
                //�����ǰλ��Ϊ��
                if(board[i][k] === 0 && noBlockHorizontal(i,j,k)){
                    //�Ѹĸ����ұ߸�����
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
    //������Ϸͼ��,����div����
    setTimeout("updateBoardView()",200);
    return true;
}

//�ж���ֱ�����ǲ���û���ϰ��ķ���
function noBlockVertical(col,row1,row2){
    for (var i=row1+1; i<row2 ; i++){
        if (board[i][col] !==0){
            return false;
        }
    }
    return true;
}

//�жϸ����ܲ��������ƶ�
function canMoveUp(){
    for (var i=1; i<4; i++){
        for (var j=0; j<4; j++){
            if(board[i][j] !==0){
                //�����ǰλ��������,�жϸ������ϱ��ǲ��ǿ�
                // �����ϱ��뵱ǰλ�������Ƿ���ͬ
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
            //�����ǰλ��û������,����
            if(board[i][j] === 0){
                continue;
            }
            for (var k=0; k<i; k++){
                //�����ǰλ��Ϊ��
                if(board[k][j] === 0 && noBlockVertical(j,k,i)){
                    //�Ѹĸ����ұ߸�����
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

//�жϸ����ܲ��������ƶ�
function canMoveDown(){
    for (var i=2; i>=0; i--){
        for (var j=0; j<4; j++){
            if(board[i][j] !==0){
                //�����ǰλ��������,�жϸ������±��ǲ��ǿ�
                // �����±��뵱ǰλ�������Ƿ���ͬ
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
            //�����ǰλ��û������,����
            if(board[i][j] === 0){
                continue;
            }
            for (var k=3; k>i; k--){
                //�����ǰλ��Ϊ��
                if(board[k][j] === 0  && noBlockVertical(j,i,k)){
                    //�Ѹĸ����ұ߸�����
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

//չʾ�ƶ�Ч���Ķ���
function showMoveAnimation(fromY,fromX,toY,toX){
    var cell = $("#number-cell-" +fromY+ "-" +fromX);
    cell.animate({
        top: getPos(toY),
        left: getPos(toX)
    },200);
}

//�ж���Ϸ�Ƿ��Ѿ���·����
function noMove(){
    return !(canMoveUp() || canMoveDown() || canMoveLeft() || canMoveRight());
}

//�ж���Ϸ�Ƿ��Ѿ�����
function isGameOver(){
    if(nospace() && noMove()){
        alert("GameOver!");
    }
}

//�������̵��������Ұ���
$(document).keydown(function (event) {
    // alert(event.keyCode)//�������,ascll��
    //��������37 38 39 40
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
