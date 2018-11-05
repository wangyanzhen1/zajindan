//全局变量

var smash_type = '';
var type = '';
var isFive = false;
var chuiziList = null;
var jindanClick = true;
var uid = "";
var token = "";
var sid = "";
//阻止双击默认事件
document.documentElement.addEventListener('dblclick', function(e){
    e.preventDefault();
});

//判断手机系统
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

if(isAndroid){
    var msg = anzhuo.getUserInfo();
    uid = JSON.parse(msg).uid;
    token = JSON.parse(msg).token;
    sid = JSON.parse(msg).sid;
    getChuiziList(uid,token)
}else if(isiOS){
    function setUserInfo(data){
        var msg = data;
        uid = JSON.parse(msg).uid;
        token = JSON.parse(msg).token;
        sid = JSON.parse(msg).sid;
        getChuiziList(uid,token);
    }
    // window.webkit.messageHandlers.updateUserInfo.postMessage(null);
}else{
    alert("请使用手机登录")
}





//页面打开时获取用户id
// console.log(location.search);         //location.search返回问号后的字段

//跑马灯
    // var zhongjiangUsers = [];
        $.ajax({
            url: "https://www.xiuktv.com/xcbb_web/smash/eggs/loadWinDate",
            success:function(res){
                var zhongjiangUsers = res.date;
                console.log(zhongjiangUsers)
                for(let i=0 ;i<=zhongjiangUsers.length ;i++){
                    $(".runBox ul").append(
                        '<li class="run">恭喜&nbsp;&nbsp;<b style="color:white">'
                        + zhongjiangUsers[i].nick +
                        '</b>&nbsp;&nbsp;砸中<i> '
                        + zhongjiangUsers[i].goods_name + 
                        ' *1</i> '
                    );
                }
            }
        });

        //获取道具信息
    function getChuiziList(a,b){
        $.ajax({
            url:"https://www.xiuktv.com/xcbb_web/smash/eggs/queryIsHaveGiftByUid",
            data:{
                //?uid=10002522&token=10002522
                uid : a,
                token : b    
            },
            success(res){
                chuiziList = res;
                console.log(chuiziList)
                $(".muchui i").text("头奖："+chuiziList.mOneName);
                $(".yinchui i").text("头奖："+chuiziList.yOneName);
                $(".jinchui i").text("头奖："+chuiziList.jOneName)
                if(chuiziList.m171 == 0){
                    $(".muchui b").text(chuiziList.mPrice+"金币/锤")
                }else{
                    $(".muchui b").text("免费道具锤："+chuiziList.m171)
                }
                if(chuiziList.y172 == 0){
                    $(".yinchui b").text(chuiziList.yPrice+"金币/锤")
                }else{
                    $(".yinchui b").text("免费道具锤："+chuiziList.y172)
                }
                if(chuiziList.j173 == 0){
                    $(".jinchui b").text(chuiziList.jPrice+"金币/锤")
                }else{
                    $(".jinchui b").text("免费道具锤："+chuiziList.j173)
                }
            }
        });
    }
        
        // console.log(zhongjiangUsers)
        $(".runBox ul").addClass("runBox_active")

        
    
//金蛋点击事件

    $(".jindan").on("click",function(){
        
        if(jindanClick){
            if($(".chuiziBox li.chuizi_active").length){    //判断是否已经选择锤子
                huichui(smash_type,type,isFive,token,uid,sid);
            }else{
                alert("亲，你要使用什么锤子呢？！")
            }
            function huichui(a,b,c,d,e,f){
                jindanClick = false;
                $(".huichui").addClass("huichui_active");
                
                 // $(".jindan").off("click");
                setTimeout(function(){
                    //请求中奖信息
                    $(".huichui").removeClass("huichui_active");
                    $(".jindan").attr("src","src/img/jindan1.png");
                    $.ajax({
                        url:"https://www.xiuktv.com/xcbb_web/smash/eggs/smashEggs",
                        data:{
                            smash_type: a,
                            type: b,
                            isFive: c,
                            token: d, //"TWpBeU1EazNNemJDcDJ0b05uZDZiRFU1TUhBeE5USTRNelEzTXpjNE5qWXd3cWN4TlRNNE1UTTVOek0xTlRFeg==",
                            uid: e, //"10002522",
                            sid: f //0
                        },
                        success:function (res){

                            if(isAndroid){
                                var upData = {
                                    Sunshine:"",//需要给移动端传的阳光值
                                    goldCoin:res.coin_balance//需要传给移动端的用户剩余金币值
                                }
                                anzhuo.updateUserInfo(upData);
                            }else if(isiOS){
                                var goldCoin = res.coin_balance;//需要传给移动端的用户剩余金币值
                                window.webkit.messageHandlers.updateUserInfo.postMessage(goldCoin)
                            }
                            console.log(res);
                            if(res.success==true){
                                $(".jindan").attr("src","src/img/jindan2.png");
                                function giftUp(i){
                                    var url = "https://www.xiuktv.com"+res.date[i].bigPic
                                        console.log(url)
                                        $(".jindanBox").append('<span style="background:url('+url+') no-repeat"></span>');
                                        setTimeout(() => {
                                            $(".jindanBox span").css({"top":"-170%"})
                                            setTimeout(()=>{
                                                $(".jindanBox span")[i].remove()
                                            },1200)
                                        }, 500);
                                        setTimeout(()=>{
                                            $(".jindan").attr("src","src/img/jindan1.png");
                                            $(".jindanBox span").remove()
                                            jindanClick = true;
                                        },3500)  
                                }
                                if(res.maxDate.length==0){
                                    giftUp(0);
                                    setTimeout(()=>{
                                        // $(".jindanBox span")[0].remove()
                                        giftUp(1);
                                        setTimeout(()=>{
                                            // $(".jindanBox span")[1].remove()
                                            giftUp(2); 
                                            setTimeout(()=>{
                                                // $(".jindanBox span")[2].remove()
                                                giftUp(3);
                                                setTimeout(()=>{
                                                    // $(".jindanBox span")[3].remove()
                                                    giftUp(4);
                                                },350) 
                                            },350)
                                        },330)
                                    },330)

                                }else{
                                    $(".zhongjiang").css({"z-index":"100","display":"block"})
                                    var date = res.date;
                                    var maxDate = res.maxDate;
                                    var url1 = "https://www.xiuktv.com"+maxDate[0].bigPic
                                    $(".toujiang").append('<img src="'+ url1 +'">'+maxDate[0].name+'*'+maxDate[0].num)

                                    for(let j=0; j<=date.length ;j++){
                                        var url2 = "https://www.xiuktv.com"+date[j].bigPic
                                        console.log(url2)
                                        $(".pujiang").append('<li><img src="'+url2+'">'+date[j].name+'*'+date[j].num+'</li>')
                                    } 
                                        
                                    
                                }
                            }else{
                               alert(res.msg) 
                               jindanClick = true;
                            }
                            
                        },
                        error:function(res){
                            alert(res)
                        }             
                    })
    
    
                    //中奖展示页确认按钮
                    $(".btn span").click(function(){
                        $(".zhongjiang").css({"z-index":"-1"})
                        $(".jindan").attr("src","src/img/jindan1.png")
                        $(".toujiang").html("")
                        $(".pujiang li").remove()
                        // $(".jindan").on("click");
                        jindanClick = true;
                    })
                    
                },1200)
            }
        }
        
    });

    
    //添加多个类完成动画效果

    //选中锤子的操作
    $(".chuiziBox li").on("click",function(){
        if($(this).index()==0){
            smash_type = 0  
            if(chuiziList.j173 == 0){
                type = 0;
            }else{
                type = 1;
            }
        }else if($(this).index()==1){
            smash_type = 1
            if(chuiziList.y172 == 0){
                type = 0;
            }else{
                type = 1;
            }
        }else if($(this).index()==2){
            smash_type = 2
            if(chuiziList.m171 == 0){
                type = 0;
            }else{
                type = 1;
            }
        }
        
        console.log(smash_type)
        $(".chuiziBox li").eq($(this).index()).addClass("chuizi_active").siblings().removeClass("chuizi_active");
        $(".huichui")[0].src = $(".chuiziBox li img").eq($(this).index())[0].src ;
    })

    //选择 五连砸的操作  
    $(".lianza").on("click",function(){
        if($(".lianza span img.lianza_active").length==0){
            isFive = false;
            $(".lianza span img").addClass("lianza_active")
        }else{
            isFive = true;
            $(".lianza span img").removeClass("lianza_active")
        }
        console.log(isFive)
    })

    
