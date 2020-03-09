function Pro(){
    this.infoindex="" ,
	this.proname="" ,
	this.level="",
	this.com=""
}
$(document).ready(function(e){
    /**
     * 每一行原始数据
     */
    let allPeopleStrs;									//每个人的原始信息字符串数组，里面每个元素为没解析前的一行文本
	let library={};														//新的数据容器

    /**
     * 打开文件，对打开的文件进行处理
     */
	$("#up").on("change",function(){//选择文件事件
		//支持chrome IE10
		if (window.FileReader) {
			let file = this.files[0];
			let filename = file.name.split(".")[0];
			let reader = new FileReader();
			reader.onload = function() {
				allPeopleStrs=this.result.split("\n");
                parseInfoStr();
                if (isEmpty(library)){
                    alert("名单中没有符合规则的专家数据,请检查名单后再重新选择文件");
                    return;
                }else {
                    $("#up").hide();
                }
				inittype();
			}
			reader.readAsText(file);
		} 
		//支持IE 7 8 9 10
		else if (typeof window.ActiveXObject != 'undefined'){
			let xmlDoc;
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); 
			xmlDoc.async = false; 
			xmlDoc.load(this.value); 
			alert(xmlDoc.xml); 
		} 
		//支持FF
		else if (document.implementation && document.implementation.createDocument) { 
			let xmlDoc;
			xmlDoc = document.implementation.createDocument("", "", null); 
			xmlDoc.async = false; 
			xmlDoc.load(this.value); 
			alert(xmlDoc.xml);
		} else { 
			alert('error'); 
		}

	});


    /**
	 * 解析一行文本
     */
	function parseInfoStr(){
        for(let peopleIndex=0;peopleIndex<allPeopleStrs.length;peopleIndex++){
			let tempPeopleStr=allPeopleStrs[peopleIndex];
            if(trim(tempPeopleStr).length==0){
                allPeopleStrs.splice(peopleIndex,1);
                peopleIndex--;
                continue;
            }
            let peopleInfos=tempPeopleStr.split(/\s+/);								//单个人的数据分组

            for(let infoindex=0;infoindex<peopleInfos.length;infoindex++){
            	let info=peopleInfos[infoindex];
                if(trim(info).length==0){
                    peopleInfos.splice(infoindex,1);
                    infoindex--;
                }
            }//清除单个人信息数组中每行信息前后空白信息(分组中会产生空白数据分组)

            let fields=peopleInfos[peopleInfos.length-1].split('-');
            if (fields.length<3||peopleInfos.length!=5) continue;                                             //如果个人信息不足5部分，或者专业信息不足3部分，则这一行数据无效
            peopleInfos[peopleInfos.length-1]=fields[0];
            peopleInfos[peopleInfos.length]=fields[1];

            let people=new Pro();
            people.infoindex=peopleInfos[0];
            people.proname=peopleInfos[1];
            people.com=peopleInfos[2];
            people.level=peopleInfos[3];

            haskey(library,fields[0],0);						//第一级专业是否加到顶级库里面

            let tempobj=library[fields[0]];					//第二级专业是否加到第二级库里面
            haskey(tempobj,fields[1],0);

            tempobj=tempobj[fields[1]];							//第三级专业是否加到第三级库里面
            haskey(tempobj,fields[2],1);

            tempobj=tempobj[fields[2]];
            hasObject(tempobj,people);

            console.info();
        }
	}

	function haskey(object,key,valueType){
		let has=false;
        for(let a in object){
            if (a===key){
            	has=true;
            	break;
			}
        }
        if (!has){
        	if (valueType===0){
                object[key]={};
			} else {
                object[key]=[];
			}
		}
	}

    /**
     * 查看某个人员在最小分类名单中是否已经添加过，以姓名和电话号码进行区分，如果两个都相同则只录入第一个人
     * @param array
     * @param object
     */
    function hasObject(array,object){
		let has=false;
        for (let i = 0; i <array.length ; i++) {
			let tempobj=array[i];
			if (tempobj.proname===object.proname&&tempobj.com===object.com&&tempobj.level===object.level){
				has=true;
				break;
			}
        }
        if (!has){
            array[array.length]=object;
		}else {
		}
    }
	
	$("#as").on("click",function(){//点击抽取事件
		if(isEmpty(library)){
			alert("还未导入名单，请先导入名单");
			return;
		}
		if($("#renshu").val()<1){
			alert("请输入正确的人数");
			return;
		}

        /**
         * 四个抽取条件
         * @type {jQuery}
         */
        let onelastStr=$("#onetype").find("option:selected").text();
        let twolastStr=$("#twotype").find("option:selected").text();
        let threelastStr=$("#threetype").find("option:selected").text();
		let neednum=$("#renshu").val();

        let canGetNum=checkNum(onelastStr,twolastStr,threelastStr);
		if (canGetNum<neednum) {
			alert("当前类别剩余专家数目不足");
			return;
		}
		showLoad("正在抽取中");
		setTimeout(chouqu(onelastStr,twolastStr,threelastStr,neednum),10000000);
	});
	
	function chouqu(onelastStr,twolastStr,threelastStr,neednum) {

		setTimeout(function name() {
			closeLoad();
            let peoples=getPeople(onelastStr,twolastStr,threelastStr,neednum);
            if (peoples==null){
                alert("当前类别剩余专家数目不足");
                return;
            }
            let old=$("#dispay").html();
            let htmlstr='<table><tr><td style="width: 15%;" colspan="1">'+onelastStr+'</td><td style="width: 15%;" colspan="1">'+twolastStr+'</td><td style="width: 15%;" colspan="1">'+threelastStr+'</td><td style="width: 15%;" colspan="1">抽取结果</td></tr></table>';
            let addstr=htmlstr+'<table border="1" style="text-align: center;">';

			for (let index = 0; index < peoples.length; index++) {
				addstr+='<tr><td style="width: 1%;" colspan="1">'+peoples[index].infoindex+'</td>'+
						'<td style="width: 3%;" colspan="1">'+peoples[index].proname+'</td>'+
						'<td style="width: 15%;" colspan="1">'+peoples[index].com+'</td>'+
						'<td style="width: 5%;" colspan="1">'+peoples[index].level+'</td></tr>';
			}
			addstr+='</table><br>'+old;
			$("#dispay").html(addstr);
		},5000);
	}

    /**
	 * 使用指定天剑获取指定书目的人员书目，如果书目不足，将返回为空。
     * @param type1	抽取人员的第一级专业
     * @param type2	抽取人员的第二级专业
     * @param type3	抽取人员的第三级专业
     * @param type4	抽取人员的第四级专业
     * @param num		抽取人员的数目
     * @returns {*}	返回抽取的人员
     */
	function getPeople(type1,type2,type3,num) {
        let linarray=[];
        let peoples=library[type1][type2][type3];
		if(peoples.length<num){
			return ;
		}
		for (let index = 0; index < num; index++) {
            let random=Math.floor(Math.random()*peoples.length);//去一个范围为数组长度的随机数
            let people=peoples.splice(random,1);//把人员取出来
            linarray[index]=people[0];
		}
		return linarray;
	}

	function checkNum(type1,type2,type3) {
        let peoples=library[type1][type2][type3];
        return peoples.length;
    }
	
	function inittype() {
		if (isEmpty(library)){
			alert("名单内数据为空,请重新选择名单");
			return
		}
        setOneType();
        setTwotype();
        setThreetype();

        $("#onetype").change(function() {
            setTwotype();
            setThreetype();
        });
        $("#twotype").change(function() {
            setThreetype();
        });
        $("#threetype").change(function() {

        });
	}

    function setOneType() {
        $("#onetype option").remove();
        let keys=Object.keys(library);
        for (let i = 0; i < keys.length; i++) {
            $("#onetype").append("<option value='"+keys[i]+"'>"+keys[i]+"</option>");
        }
    }
    function setTwotype() {
        $("#twotype option").remove();
        let onelastStr=$("#onetype").find("option:selected").text();
        let lastSubObject=library[onelastStr];
        let keys=Object.keys(lastSubObject);
        for (let i = 0; i < keys.length; i++) {
            $("#twotype").append("<option value='"+keys[i]+"'>"+keys[i]+"</option>");
        }
    }
    function setThreetype() {
        $("#threetype option").remove();
        let onelastStr=$("#onetype").find("option:selected").text();
        let twolastStr=$("#twotype").find("option:selected").text();
        let lastSubObject=library[onelastStr][twolastStr];
        let keys=Object.keys(lastSubObject);
        for (let i = 0; i < keys.length; i++) {
            $("#threetype").append("<option value='"+keys[i]+"'>"+keys[i]+"</option>");
        }
    }


    /**
	 * 旋转弹窗
     * @param tipInfo
     */
    function showLoad(tipInfo) {  
        var eTip = document.createElement('div');  
        eTip.setAttribute('id', 'tipDiv');  
        eTip.style.position = 'absolute';  
        eTip.style.display = 'none';  
        eTip.style.border = 'solid 0px #D1D1D1';  
        eTip.style.backgroundColor = '#4B981D';
        eTip.style.top = '300px';  
        eTip.style.left = '45%';  
        eTip.style.borderRadius="25px";
        eTip.style.textAlign="center";
        eTip.innerHTML = '<img src=\'./loader.gif\' style=\'float:left;border-radius:15px;\'/><br><H1>'+tipInfo+'<H1>';  
        try {  
            document.body.appendChild(eTip);  
        } catch (e) { }  
        $("#tipDiv").css("float", "right");  
        $("#tipDiv").css("z-index", "99");  
        $('#tipDiv').fadeIn();
    }
    /**
	 * 关闭旋转弹窗
     */
    function closeLoad() {  
        $('#tipDiv').fadeOut();  
    }
    /**
	 * 判断对象是不是为空
     * @param object
     * @returns {boolean}
     */
    function isEmpty(object) {
        for(let a in object){
            return false;
        }
        return true;
    }
    /**
     * 对字符串清除右边的空格
     * @param s
     * @returns {*}
     */
    function trimRight(s){
        if(s == null) return "";
        var whitespace = new String(" \t\n\r");
        var str = new String(s);
        if (whitespace.indexOf(str.charAt(str.length-1)) != -1){
            var i = str.length - 1;
            while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1){
                i--;
            }
            str = str.substring(0, i+1);
        }
        return str;
    }
    /**
     * 对字符串清除左边的空格
     * @param s
     * @returns {*}
     */
    function trimLeft(s){
        if(s == null) {
            return "";
        }
        var whitespace = new String(" \t\n\r");
        var str = new String(s);
        if (whitespace.indexOf(str.charAt(0)) != -1) {
            var j=0, i = str.length;
            while (j < i && whitespace.indexOf(str.charAt(j)) != -1){
                j++;
            }
            str = str.substring(j, i);
        }
        return str;
    }
    /**
     * 清除空格
     * @param s
     * @returns {*}
     */
    function trim(s){
        return trimRight(trimLeft(s));
    }
});