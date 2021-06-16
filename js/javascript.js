var pass;
pass = document.getElementById('pw').value;

function getPassword() {
    pass = document.getElementById('pw').value;
    getJson('game');
}

function home() {
    location.reload();
}

//设置超链接
var copyindex = 1;//复制按钮id编号
/**
 *
 * @param title 标题
 * @param url 度盘链接
 * @param code 提取码
 */
function setUrl(title,url,code){
    var copyid = "copyid_"+copyindex;//复制按钮id

    var d1,d2,d3,d4;
    d1 = document.createElement("div");
    d2 = document.createElement("div");
    d3 = document.createElement("div");
    d1.setAttribute("class","subject");
    d2.setAttribute("class","subjectTitle");
    d3.setAttribute("class","subjectLinks");

    d2.innerHTML=title;
    d3.innerHTML="<a class=\"download\" target=\"_blank\" href=\""+url+"\" title=\""+url+"\">百度网盘</a><div class=\"code\" id=\""+copyid+"\">"+code+"</div><a class='btn' type=\"button\" href=\"javascript:copyText('"+copyid+"')\"/>复制提取码</a>";
    d1.appendChild(d2);
    d1.appendChild(d3);
    document.getElementById("all").appendChild(d1);

    copyindex++;//编号自增
}

/**
 * 提示
 * @param str 提示内容，不要超过3个汉字
 */
function tip(str) {
    var tip = document.createElement("div");
    tip.setAttribute("class","copyal");
    tip.innerHTML=str;
    document.getElementById("container").appendChild(tip);
    setTimeout(function () {
        document.getElementById("container").removeChild(tip);
    },2000);
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
    //复制提示
    btn.setAttribute("disabled","true");
    setTimeout( function(){
        btn.innerHTML =code;
        btn.removeAttribute("disabled");
    }, 1000 );//延时1秒
    tip("已复制");
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

function clear() {
    if(document.getElementById("all"))
    {
        document.getElementById("all").remove();
    }

    if(document.getElementById('codeinput')){
        document.getElementById('codeinput').remove();
    }

    if(document.getElementById('msg')){
        document.getElementById('msg').remove();
    }

    document.getElementById("container").innerHTML="";
}

function feed() {
    clear();
    var d0 = document.createElement("div");
    d0.setAttribute("id","all");
    document.getElementById("container").appendChild(d0);
    var img = document.createElement("img");
    img.setAttribute("src","https://s1.ax1x.com/2020/04/14/Jp17oq.jpg");
    img.setAttribute("width","100%")
    document.getElementById("all").appendChild(img);
    defautPageClass();
    document.getElementById('page_m').setAttribute('class', 'pageselected');
}

function getJson(str) {
    var json;
    var request = new XMLHttpRequest();
    request.open("get", "data/" + str + ".json");
    request.responseType = 'text';
    request.send(null);
    request.onload = function () {
        json = JSON.parse(request.responseText);
        switch (str) {
            case "game":
                json = json.game;
                break;
            case "asmr":
                json = json.asmr;
                break;
            case "lightnovel":
                json = json.lightnovel;
                break;
            case "novel":
                json = json.novel;
                break;
            case "updata":
                json = json.updata;
                break;
        }
        var tests = checknum(binaryToStr(json[3].url,pass));
        if (tests){
            clear();
            var d0 = document.createElement("div");
            d0.setAttribute("id","all");
            document.getElementById("container").appendChild(d0);
            for (var i = 0; i < json.length;i++){
                var titleTem = json[i].title;//标题
                var urlTem = json[i].url;//度盘链接
                var codeTem = json[i].code;//提取码
                urlTem = "https://pan.baidu.com/s/"+binaryToStr(urlTem,pass);
                // alert(urlTem);
                setUrl(titleTem, urlTem, codeTem);
            }
            copyindex = 1;
        }else {
            tip("答案错误");
        }
    }
}
