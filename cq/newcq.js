function Pro(){
    this.infoindex="" ,
	this.proname="" ,
	this.phone="" ,
	this.level="",
	this.com=""
}
$(document).ready(function(e){
    /**
     * 每一行原始数据
     */
    let allPeopleStrs;									//每个人的原始信息字符串数组，里面每个元素为没解析前的一行文本

	let library={};														//新的数据容器

	$("#up").on("change",function(){//选择文件事件
		//支持chrome IE10
		if (window.FileReader) {
			let file = this.files[0];
			filename = file.name.split(".")[0];
			let reader = new FileReader();
			reader.onload = function() {
				allPeopleStrs=this.result.split("\n");
                parseInfoStr();
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
		$("#up").hide();
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
            }//清除单个人数组数组中的空白信息(分组中会产生空白数据分组)

            let fields=peopleInfos[peopleInfos.length-1].split('-');
            if (fields.length<2) continue;
            peopleInfos[peopleInfos.length-1]=fields[0];
            peopleInfos[peopleInfos.length]=fields[1];

            let pro=new Pro();
            pro.infoindex=peopleInfos[0];
            pro.proname=peopleInfos[1];
            pro.com=peopleInfos[2];
            pro.level=peopleInfos[3];
            pro.phone=peopleInfos[4];

            haskey(library,fields[0],0);						//第一级专业是否加到顶级库里面

            let tempobj=library[fields[0]];					//第二级专业是否加到第二级库里面
            haskey(tempobj,fields[1],0);

            tempobj=tempobj[fields[1]];							//第三级专业是否加到第三级库里面
            haskey(tempobj,fields[2],0);

            tempobj=tempobj[fields[2]];							//第四级专业是否加到第四级库里面,加到里面为数组
            haskey(tempobj,fields[3],1);

            tempobj=tempobj[fields[3]];
            hasObject(tempobj,pro);
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

    function hasObject(array,object){
		let has=false;
        for (let i = 0; i <array.length ; i++) {
			let tempobj=array[i];
			if (tempobj.proname===object.proname&&tempobj.phone===object.phone){
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

        let onetypeStr=$("#onetype").find("option:selected").text();
        let twotypeStr=$("#twotype").find("option:selected").text();
        let threetypeStr=$("#threetype").find("option:selected").text();
        let fourtypeStr=$("#fourtype").find("option:selected").text();
		let num=$("#renshu").val();
        let linarray=getren(onetypeStr,twotypeStr,num);
		if (linarray==null) {
			alert("没有足够的人员进行抽取");
			return;
		}
		showLoad("正在抽取中");
		setTimeout(chouqu(linarray),10000000);
	});
	
	function chouqu(linarray) {
		setTimeout(function name() {
			closeLoad();
            let old=$("#dispay").html();
            let htmlstr='<table><tr><td style="width: 15%;" colspan="1">'+$("#onetype").find("option:selected").text()+'</td><td style="width: 15%;" colspan="1">'+$("#twotype").find("option:selected").text()+'</td><td style="width: 15%;" colspan="1">抽取结果</td></tr></table>';
            let addstr=htmlstr+'<table border="1" style="text-align: center;">';

			for (let int = 0; int < linarray.length; int++) {
				addstr+='<tr><td style="width: 1%;" colspan="1">'+linarray[int][0]+'</td>'+
						'<td style="width: 3%;" colspan="1">'+linarray[int][1]+'</td>'+
						'<td style="width: 15%;" colspan="1">'+linarray[int][2]+'</td>'+
						'<td style="width: 5%;" colspan="1">'+linarray[int][3]+'</td>'+
						'<td style="width: 5%;" colspan="1">'+linarray[int][4]+'</td>'+
						'<td style="width: 15%;" colspan="1">'+linarray[int][5]+'</td>'+
						'<td style="width: 5%;" colspan="1">'+linarray[int][6]+'</td></tr>';
			}
			addstr+='</table><br>'+old;
			$("#dispay").html(addstr);
		},5000);
	}

    /**
	 * 进行抽取任务
     * @param type1	抽取人员的第一级专业
     * @param type2	抽取人员的第二级专业
     * @param num		抽取人员的数目
     * @returns {*}	返回的抽取对象
     */
	function getren(type1,type2,num) {
        let num_=0;
        let linarray=[];
		for (let int = 0; int < allPeopleInfoObjects.length; int++) {
			if(allPeopleInfoObjects[int][5]==type1&&allPeopleInfoObjects[int][6]==type2){
				num_++;
			}
		}
		if(num_<num){
			return ;
		}
		for (let int2 = 0; int2 < num; int2++) {

			while(true){
                let random=Math.floor(Math.random()*allPeopleInfoObjects.length);//去一个范围为数组长度的随机数
                let mmm=allPeopleInfoObjects.splice(random,1);//把人员取出来
				if(mmm[0][5]==type1&&mmm[0][6]==type2){
					linarray[int2]=mmm[0];
					break;
				}else{
					allPeopleInfoObjects.push(mmm[0]);
				}
			}

		}
		
		return linarray;
	}
	
	function inittype() {
		if (isEmpty(library)){
			alert("名单内数据为空,请重新选择名单");
			return
		}

        $("#onetype option").remove();
        $("#twotype option").remove();
        $("#threetype option").remove();
        $("#fourtype option").remove();



        let keys=Object.keys(library);
        for (let i = 0; i < keys.length; i++) {
            setOneType(keys[i]);
        }

        let lastStr=$("#onetype").find("option:selected").text();
        let lastSubObject=library[lastStr];
        keys=Object.keys(lastSubObject);
        for (let i = 0; i < keys.length; i++) {
            setTwotype(keys[i]);
        }

        lastStr=$("#twotype").find("option:selected").text();
        lastSubObject=lastSubObject[lastStr];
        keys=Object.keys(lastSubObject);
        for (let i = 0; i < keys.length; i++) {
            setThreetype(keys[i]);
        }

        lastStr=$("#threetype").find("option:selected").text();
        lastSubObject=lastSubObject[lastStr];
        keys=Object.keys(lastSubObject);
        for (let i = 0; i < keys.length; i++) {
            setFourtype(keys[i]);
        }

        $("#onetype").change(function() {
            oneTypeChange();
        });
        $("#twotype").change(function() {
            bigtypeChange();
        });
        $("#threetype").change(function() {
            bigtypeChange();
        });

	}

    function setOneType(value) {
        $("#onetype").append("<option value='"+value+"'>"+value+"</option>");
    }
    function setTwotype(value) {
        $("#twotype").append("<option value='"+value+"'>"+value+"</option>");
    }
    function setThreetype(value) {
        $("#threetype").append("<option value='"+value+"'>"+value+"</option>");
    }
    function setFourtype(value) {
        $("#fourtype").append("<option value='"+value+"'>"+value+"</option>");
    }

    /**
	 * 设置一个元素的选项信息
     * @param ele		被设置的元素
     * @param nextEle	递归设置的下一个元素(半递归)
     * @param keys		当前设置的元素的数据
     */
    function setType(ele,keys) {
        for (let i = 0; i < keys.length; i++) {
            ele.append("<option value='"+keys[i]+"'>"+keys[i]+"</option>");
        }
    }

    function oneTypeChange() {

    }
    function twoTypeChange() {

    }
    function threeTypeChange() {

    }
    function fourTypeChange() {

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