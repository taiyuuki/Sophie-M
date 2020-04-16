var pass = prompt("请输入神秘代码");

//设置超链接
var copyindex = 1;//复制按钮id编号
/**
 *
 * @param name 标题
 * @param url 度盘链接
 * @param code 提取码
 * @returns {string} 返回<a>标签超链接
 */
function setUrl(title,url,code){
    var copyid = "copyid_"+copyindex;//复制按钮id
    var dupan = "<a class=\"cursor\" href=\""+url+"\" target=\"_blank\">"+title+"</a><input class=\"code\" type=\"button\" id=\""+copyid+"\" value=\""+code+"\" onclick='copyText(\""+copyid+"\")'/>";//度盘超链接
    copyindex++;//编号自增
    return dupan;//返回值
}

//文本复制
function copyText(id) {
    var text=document.getElementById(id).value;//获取提取码
    var input = document.createElement('input');//添加标签
    input.value = text;
    document.body.appendChild(input);
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {//区分iPhone设备
        window.getSelection().removeAllRanges();//这段代码必须放在前面否则无效
        var range = document.createRange();
        range.selectNode(input);// 选中需要复制的节点
        window.getSelection().addRange(range);// 执行选中元素
        document.execCommand('copy');// 执行 copy 操作
        window.getSelection().removeAllRanges();// 移除选中的元素
    }else{
        input.select(); // 选择
        document.execCommand("copy"); // 执行浏览器复制命令
        input.style.display='none';//不可见
        input.setAttribute("onfocus","\"this.blur()\"");
    }
    document.body.removeChild(input);//移除
    document.getElementById(id).value ="复制成功";//复制提示
    setTimeout( function(){
        document.getElementById(id).value =text;
    }, 1000 );//延时1秒
}

//将字符串转化为二进制的数据
function strToBinary(str,password){
    var result = [];
    var list = str.split("");
    for(var i=0;i<list.length;i++){
        if(i != 0){
            //加空格，分割二进制
            result.push(" ");
        }
        var item = list[i];
        //将字符串转化为二进制数据
        var binaryStr = item.charCodeAt().toString(2)^password;
        result.push(binaryStr);
    }
    return result.join("");
}

//二进制转为字符串
function binaryToStr(str,password){
    var result = [];
    //
    //通过空格来分开二进制的字符
    var list = str.split(" ");
    for(var i=0;i<list.length;i++){
        var item = list[i]^password;
        //转为asciicode 码
        var asciiCode = parseInt(item,2);
        //转为文字
        var charValue = String.fromCharCode(asciiCode);
        //添加到集合中
        result.push(charValue);
    }
    //返回结果
    return result.join("");
}

//读取json数据文件
/**
 *
 * @param str 标签名：game、lightnovel、novel、asmr
 */
function getJson(str) {
    var json;//定义json
    var request = new XMLHttpRequest();
    request.open("get","data/"+str+".json");
    request.responseType = 'text';
    request.send(null);
    request.onload=function () {
        json = JSON.parse(request.responseText);
        //判断
        switch (str) {
            case "game":
                json=json.game;
                // alert("游戏")
                break;
            case "asmr":
                json=json.asmr;
                // alert("声音");
                break;
            case "novel":
                json=json.novel;
                // alert("中文小说");
                break;
            case "lightnovel":
                json=json.lightnovel;
                // alert("轻小说");alert
                break;
        }
        // json = json.game;
        // document.write(json);
        for (var i = 0; i < json.length;i++){
            var titleTem = json[i].title;//标题
            var urlTem = json[i].url;//度盘链接
            var codeTem = json[i].code;//提取码
            urlTem = "https://pan.baidu.com/s/"+binaryToStr(urlTem,pass);
            // alert(urlTem);
            var index = str + i;//设置id
            var temTag = document.createElement("p");//创建p标签
            temTag.setAttribute("id", index);//给p标签添加id
            document.getElementById(str).append(temTag);//将p标签添加至指定div
            document.getElementById(index).innerHTML = setUrl(titleTem, urlTem, codeTem);//在p标签内写入超链接
        }
    };
}

//执行函数
getJson("game");
getJson("novel");
getJson("lightnovel");
getJson("asmr");

//给html页面添加内容
/**
 *
 * @param str 标签id
 * @param array 添加内容，二维数组
 */
function addTag(str,array) {
    for (var i = 0 ;i<array.length;i++) {
        var index = str + i;
        var temtag = document.createElement("p");
        temtag.setAttribute("id", index);
        document.getElementById(str).append(temtag);
        document.getElementById(index).innerHTML = setUrl(array[i][0], array[i][1], array[i][2]);
    }
}

//执行添加函数
// addTag("asmr",asmrArray);
// addTag("lightnovel",lightNovelArray);
// addTag("novel",novelArray);
// addTag("game",gameArray);


// document.getElementById('asmr1').innerHTML=setUrl("百度网盘地址","https://pan.baidu.com","提取码");
