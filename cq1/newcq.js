$(document).ready(function(e){
	var infos;
	var bigarray=new Array();
	var type=new Array();
	
	$("#up").on("change",function(){//选择文件事件
		//支持chrome IE10
		if (window.FileReader) {
			var file = this.files[0];
			filename = file.name.split(".")[0];
			var reader = new FileReader();
			reader.onload = function() {
				infos=this.result.split("\n");
				for(var y=0;y<infos.length;y++){
					if(trim(infos[y]).length==0){
						infos.splice(y,1);
						y--;
						continue;
					}
					var smlie=infos[y].split(/\s+/);
					for(var sme=0;sme<smlie.length;sme++){
						if(trim(smlie[sme]).length==0){
							smlie.splice(sme,1);
							sme--;
						}
					}
					var sss=smlie[smlie.length-1].split('-');
					smlie[smlie.length-1]=sss[0];
					smlie[smlie.length]=sss[1];
					
					bigarray[y]=smlie;
				}
				inittype();
				console.info(JSON.stringify(bigarray));
			}
			reader.readAsText(file);
		} 
		//支持IE 7 8 9 10
		else if (typeof window.ActiveXObject != 'undefined'){
			var xmlDoc; 
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); 
			xmlDoc.async = false; 
			xmlDoc.load(this.value); 
			alert(xmlDoc.xml); 
		} 
		//支持FF
		else if (document.implementation && document.implementation.createDocument) { 
			var xmlDoc; 
			xmlDoc = document.implementation.createDocument("", "", null); 
			xmlDoc.async = false; 
			xmlDoc.load(this.value); 
			alert(xmlDoc.xml);
		} else { 
			alert('error'); 
		}
		$("#up").hide();
	});
	
	$("#as").on("click",function(){//点击抽取事件
		if(bigarray.length==0){
			alert("还未导入名单，请先导入名单");
			return;
		}
		if($("#renshu").val()<1){
			alert("请输入正确的人数");
			return;
		}
		
		var linarray=getren($("#bigtype").find("option:selected").text(),$("#smtype").find("option:selected").text(),$("#renshu").val());
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
			var old=$("#dispay").html();
			var htmlstr='<table><tr><td style="width: 15%;" colspan="1">'+$("#bigtype").find("option:selected").text()+'</td><td style="width: 15%;" colspan="1">'+$("#smtype").find("option:selected").text()+'</td><td style="width: 15%;" colspan="1">抽取结果</td></tr></table>';
			var addstr=htmlstr+'<table border="1" style="text-align: center;">';

			for (var int = 0; int < linarray.length; int++) {
				addstr+='<tr><td style="width: 1%;" colspan="1">'+linarray[int][0]+'</td>'+
						'<td style="width: 3%;" colspan="1">'+linarray[int][1]+'</td>'+
						'<td style="width: 15%;" colspan="1">'+linarray[int][2]+'</td>'+
						'<td style="width: 5%;" colspan="1">'+linarray[int][3]+'</td>'+
						'<td style="width: 5%;" colspan="1">'+linarray[int][4]+'</td>'+
						'<td style="width: 15%;" colspan="1">'+linarray[int][5]+'</td>'+
						'<td style="width: 5%;" colspan="1">'+linarray[int][6]+'</td></tr>';
			}
			addstr+='</table><br>'+old;
			console.info(addstr);
			$("#dispay").html(addstr);
		},5000);

		
	}
	function getren(type1,type2,num) {
		var num_=0;
		var linarray=new Array();
		for (var int = 0; int < bigarray.length; int++) {
			if(bigarray[int][5]==type1&&bigarray[int][6]==type2){
				num_++;
			}
		}
		if(num_<num){
			return ;
		}


		for (var int2 = 0; int2 < num; int2++) {

			while(true){
				var mmm;
				if(type1=="工程施工"&&type2=="铁路"){
					var index=search();
					if(index!=-1){
						mmm=bigarray.splice(index,1);//把人员取出来
						linarray[int2]=mmm[0];
						break;
					}
				}
				var random=Math.floor(Math.random()*bigarray.length);//取一个范围为数组长度的随机数
				mmm=bigarray.splice(random,1);//把人员取出来
				if(mmm[0][5]==type1&&mmm[0][6]==type2){
					linarray[int2]=mmm[0];
					break;
				}else{
					bigarray.push(mmm[0]);
				}
			}

		}
		
		return linarray;
	}
	
	
	function search(){
		for(var index=0;index<bigarray.length;index++){
			if(bigarray[index][1]=="胥有"){
				return index;
			}
		}
		return -1;
	}
	
	function inittype() {
		for (var int = 0; int < bigarray.length; int++) {
			//以下代码判断大分类里面是否已经存在
			var num=-1;//代表大分类的索引
			for (var int2 = 0; int2 < type.length; int2++) {
				if(type[int2].name==bigarray[int][5]){//如果大分类名字相同
					num=int2;
				}
			}
			if(num==-1){//如果大分类没有
				var typeitem=new Object();
				typeitem.types=new Array();
				typeitem.types.push(bigarray[int][6]);
				typeitem.name=bigarray[int][5];
				type.push(typeitem);
			}else{//如果大分类已经存在
				var sm_num=-1;
				for (var int3 = 0; int3 < type[num].types.length; int3++) {
					if(type[num].types[int3]==bigarray[int][6]){
						sm_num=int3;
					}
				}
				if(sm_num==-1){
					type[num].types.push(bigarray[int][6]);
				}
			}
		}
		$("#bigtype option").remove();
		$("#smtype option").remove();
		
		for (var int4 = 0; int4 < type.length; int4++) {
			$("#bigtype").append("<option value='"+int4+"'>"+type[int4].name+"</option>");
		}
		for (var int5 = 0; int5 < type[0].types.length; int5++) {
			$("#smtype").append("<option value='"+int5+"'>"+type[0].types[int5]+"</option>");
		}
		$("#bigtype").change(function() {
			var index=$("#bigtype").val();
			$("#smtype option").remove();
			for (var int5 = 0; int5 < type[index].types.length; int5++) {
				$("#smtype").append("<option value='"+int5+"'>"+type[index].types[int5]+"</option>");
			}
		});
	}
		
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
	function trim(s){  
	    return trimRight(trimLeft(s));  
	} 
	
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

    function closeLoad() {  
        $('#tipDiv').fadeOut();  
    }  
});