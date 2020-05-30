var pass;

function getPassword() {
    pass = document.getElementById('pw').value;
    getJson('game');
}


//设置超链接
var copyindex = 1;//复制按钮id编号
/**
 *
 * @param title 标题
 * @param url 度盘链接
 * @param code 提取码
 * @returns {string} 返回<a>标签超链接
 */
function setUrl(title,url,code){
    var copyid = "copyid_"+copyindex;//复制按钮id
    var dupan = "<td class='tabline'><a class=\"cursor\" href=\""+url+"\" target=\"_blank\">"+title+"</a></td><td style='width: 4em'><span class='code' id='"+copyid+"'>"+code+"</span></td><td><input class='btn' type=\"button\" value=\"复制\" onclick='copyText(\""+copyid+"\")'/></td>";//度盘超链接
    copyindex++;//编号自增
    return dupan;//返回值
}

//文本复制
function copyText(id) {
    var btn = document.getElementById(id);
    var code=btn.innerText;//获取提取码
    var input = document.createElement('input');//添加标签
    input.value = code;
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
    alert('提取码已复制')//复制提示
    btn.setAttribute("disabled","true");
    setTimeout( function(){
        btn.innerHTML =code;
        btn.removeAttribute("disabled");
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

function checknum(value) {
    var str = value.replace(/\s*/g, '').replace('_','').replace('-','');
    var Regx = /^[A-Za-z0-9]*$/;
    if (Regx.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

//读取json数据文件
/**-
 *
 * @param str 标签名：game、lightnovel、novel、asmr
 */

function  defautPageClass() {
    document.getElementById('page_g').setAttribute('class','page');
    document.getElementById('page_a').setAttribute('class','page');
    document.getElementById('page_l').setAttribute('class','page');
    document.getElementById('page_n').setAttribute('class','page');
}

function getJson(str) {
    var json;
    var request = new XMLHttpRequest();
    request.open("get","data/"+str+".json");
    request.responseType = 'text';
    request.send(null);
    request.onload=function () {
        json = JSON.parse(request.responseText);
        defautPageClass();
        switch (str) {
            case "game":
                json=json.game;
                document.getElementById('page_g').setAttribute('class','pageselected');
                break;
            case "asmr":
                json=json.asmr;
                document.getElementById('page_a').setAttribute('class','pageselected');
                break;
            case "lightnovel":
                json=json.lightnovel;
                document.getElementById('page_l').setAttribute('class','pageselected');
                break;
            case "novel":
                json=json.novel;
                document.getElementById('page_n').setAttribute('class','pageselected');
                break;
        }

        var tests = checknum(binaryToStr(json[2].url,pass));
        if (tests){
            var page = document.createElement('div');

            if(document.getElementById("gnxs"))
            {
                document.getElementById("gnxs").remove();
            }

            if(document.getElementById('codeinput')){
                document.getElementById('codeinput').remove();
            }

            page.setAttribute('id','gnxs');
            document.getElementById('all').append(page);
            document.getElementById('gnxs').innerHTML = "<table id = "+str+" cellpadding=\"10\" cellspacing='10' class='table'></table>";

            for (var i = 0; i < json.length;i++){
                var titleTem = json[i].title;//标题
                var urlTem = json[i].url;//度盘链接
                var codeTem = json[i].code;//提取码
                urlTem = "https://pan.baidu.com/s/"+binaryToStr(urlTem,pass);
                // alert(urlTem);
                var index = str + i;//设置id

                var temTag = document.createElement("tr");//创建p标签
                temTag.setAttribute("id", index);//给p标签添加id
                document.getElementById(str).append(temTag);//将p标签添加至指定div
                document.getElementById(index).innerHTML = setUrl(titleTem, urlTem, codeTem);//在p标签内写入超链接
            }
        }else {
            alert('请关注公众号（SM_Flatfoosie）回复 SM 获取神秘代码');
        }

    };
}
//执行函数
// getJson("game");
// getJson("novel");
// getJson("lightnovel");
// getJson("asmr");
