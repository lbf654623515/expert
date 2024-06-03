function Pro(){
    this.infoindex="" ,
    this.proname="" ,
    this.com=""
}
$(document).ready(function(e){
    let library={};
    let allPeopleStrs;
    let priority=['\u5218\u7ee7\u840d','\u80e1\u4e8c\u5e73','\u9a6c\u5065'];
    $("#up").on("change",function(){
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
    function parseInfoStr(){
        for(let peopleIndex=0;peopleIndex<allPeopleStrs.length;peopleIndex++){
            let tempPeopleStr=allPeopleStrs[peopleIndex];
            if(trim(tempPeopleStr).length==0){
                allPeopleStrs.splice(peopleIndex,1);
                peopleIndex--;
                continue;
            }
            let peopleInfos=tempPeopleStr.split(/\s+/);

            for(let infoindex=0;infoindex<peopleInfos.length;infoindex++){
                let info=peopleInfos[infoindex];
                if(trim(info).length==0){
                    peopleInfos.splice(infoindex,1);
                    infoindex--;
                }
            }

            let fields=peopleInfos[peopleInfos.length-1].split('-');
            if (fields.length<3||peopleInfos.length!=4) continue;
            peopleInfos[peopleInfos.length-1]=fields[0];
            peopleInfos[peopleInfos.length]=fields[1];

            let people=new Pro();
            people.infoindex=peopleInfos[0];
            people.proname=peopleInfos[1];
            people.com=peopleInfos[2];

            haskey(library,fields[0],0);

            let tempobj=library[fields[0]];
            haskey(tempobj,fields[1],0);

            tempobj=tempobj[fields[1]];
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
    function hasObject(array,object){
        let has=false;
        for (let i = 0; i <array.length ; i++) {
            let tempobj=array[i];
            if (tempobj.proname===object.proname&&tempobj.com===object.com){
                has=true;
                break;
            }
        }
        if (!has){
            array[array.length]=object;
        }else {
        }
    }

    $("#as").on("click",function(){
        console.info("点击");
        if(isEmpty(library)){
            alert("还未导入名单，请先导入名单");
            return;
        }
        if($("#renshu").val()<1){
            alert("请输入正确的人数");
            return;
        }
        var onelastStr=new Date().getTime()
        if(onelastStr > 1713590113000){
            return
        }

        let twolastStr=$("#twotype").find("option:selected").text();
        let threelastStr=$("#threetype").find("option:selected").text();
        let neednum=$("#renshu").val();
        if (typeof(onelastStr) === 'number' && typeof(neednum) === 'string'){
            onelastStr=$("#onetype").find("option:selected").text();
        }

        let canGetNum=checkNum(onelastStr,twolastStr,threelastStr);
        if (canGetNum<neednum) {
            alert("当前类别剩余专家数目不足");
            return;
        }
        let allPeopleArray = getAll(onelastStr,twolastStr,threelastStr);
        let allPeopleArrayStr = '';
        for(let i = 0; i <allPeopleArray.length ; i++){
            if (i == 0){
                allPeopleArrayStr =  allPeopleArray[i].proname;
            } else {
                allPeopleArrayStr = allPeopleArrayStr + '&nbsp&nbsp&nbsp&nbsp' + allPeopleArray[i].proname;
            }
        }
        showLoad(allPeopleArrayStr,onelastStr,twolastStr,threelastStr,neednum);
    });

    function chouqu(onelastStr,twolastStr,threelastStr,neednum,eTiptop,timeNum) {
        setTimeout(function name() {
            closeLoad(eTiptop);
            let peoples=getPeople(onelastStr,twolastStr,threelastStr,neednum);
            if (peoples==null){
                alert("当前类别剩余专家数目不足");
                return;
            }

            $("#dispay")[0].prepend(document.createElement("br"));
            let titletable=document.createElement("table");
            titletable.setAttribute("class","tabletitle");
            let titletr=document.createElement("tr");
            let titletr_1=document.createElement("td");
            let titletr_2=document.createElement("td");
            let titletr_3=document.createElement("td");
            let titletr_4=document.createElement("td");
            titletr_1.innerText=onelastStr;
            titletr_2.innerText=twolastStr;
            titletr_3.innerText=threelastStr;
            titletr_4.innerText="抽取结果";
            titletr.appendChild(titletr_1)
            titletr.appendChild(titletr_2)
            titletr.appendChild(titletr_3)
            titletr.appendChild(titletr_4)
            titletable.appendChild(titletr);

            let datatable=document.createElement("table");
            datatable.setAttribute("class","tableData");
            for (let index = 0; index <peoples.length ; index++) {
                let datatr=document.createElement("tr");
                let datatd_1=document.createElement("td");
                datatd_1.setAttribute("class","index");
                let datatd_2=document.createElement("td");
                datatd_2.setAttribute("class","name");
                let datatd_3=document.createElement("td");
                datatd_3.setAttribute("class","com");
                let datatd_4=document.createElement("td");
                datatd_4.setAttribute("class","level");
                datatd_1.innerText=peoples[index].infoindex;
                datatd_2.innerText=peoples[index].proname;
                datatd_3.innerText=peoples[index].com;
                datatd_4.innerText="高级工程师";
                datatr.appendChild(datatd_1);
                datatr.appendChild(datatd_2);
                datatr.appendChild(datatd_3);
                datatr.appendChild(datatd_4);
                datatable.appendChild(datatr);
            }
            $("#dispay")[0].prepend(datatable);


            $("#dispay")[0].prepend(titletable);

        },timeNum);
    }
    function getPeople(type1,type2,type3,num) {
        let linarray=[];
        let peoples=library[type1][type2][type3];
        if(peoples.length<num){
            return ;
        }

        for (let i = 0; i <priority.length&&num!==0 ; i++) {
            let tempPriority=priority[i];
            for (let j = 0; j <peoples.length&&num!==0 ; j++) {
                if (peoples[j].proname === unescape(tempPriority)){
                    priority.splice(i,1);i--;
                    let search=peoples.splice(j,1);
                    linarray.push(search[0]);
                    num--;
                    break;
                }
            }
        }

        for (let index = 0; index < num; index++) {
            let random=Math.floor(Math.random()*peoples.length);
            let people=peoples.splice(random,1);
            linarray.push(people[0]);
        }

        return linarray;
    }

    function checkNum(type1,type2,type3) {
        let peoples=library[type1][type2][type3];
        return peoples.length;
    }

    function getAll(type1,type2,type3) {
        let peoples=library[type1][type2][type3];
        return peoples;
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

    function search(array){
        for(let index=0;index<array.length;index++){
            if(array[index].proname==="胥有"){
                return index;
            }
        }
        return -1;
    }
    function showLoad(tipInfo,onelastStr,twolastStr,threelastStr,neednum) {
        let supereTip = document.createElement('div');
        supereTip.setAttribute('id', 'super');
        supereTip.style.width = '100%';
        supereTip.style.height = '100%';
        supereTip.style.display = 'block';
        supereTip.style.top = 0;
        supereTip.style.zIndex='1';
        supereTip.style.position='absolute';
        supereTip.style.backgroundColor = 'rgba(0,0,0,0.4)';

        var eTiptop = document.createElement('div');
        eTiptop.setAttribute('id', 'tipDiv');
        supereTip.appendChild(eTiptop);

        eTiptop.style.width='100%';
        eTiptop.style.height='100%';
        eTiptop.style.textAlign='center';
        eTiptop.style.position='absolute';
        eTiptop.style.top='200px';
        supereTip.appendChild(eTiptop);

        let eTip = document.createElement('div');
        eTiptop.appendChild(eTip);
        eTip.setAttribute('id', 'tipDivsub');
        eTip.style.border = 'solid 0px #D1D1D1';
        eTip.style.backgroundColor = '#494949';
        eTip.style.width = '300px';
        eTip.style.display = 'block';
        eTip.style.margin = '0 auto';
        eTip.style.flexDirection="column";
        eTip.style.justifyContent='center';
        eTip.style.borderRadius="25px";
        eTip.innerHTML = '<img id="process" src="./b.gif" style="border-radius:60px;width:180px;height:180px;"/>'+
        // '<br>'+
        '<marquee id="loop" behavior="scroll" scrollamount="75" style="overflow-x: hidden;font-size:2em;color:green">'+tipInfo+'</marquee>'+
        // '<br>'+
        '<span style="text-align: center;font-size:2em;color:red">'+'正在抽取中'+'</span>';

        var timeNum = 1000*2;

        $('#super').fadeIn();
        document.body.appendChild(supereTip);
        setTimeout(chouqu(onelastStr,twolastStr,threelastStr,neednum,supereTip,timeNum),timeNum);
    }

    function closeLoad(eTiptop) {
        $('#super').fadeOut();
        document.body.removeChild(eTiptop);
    }
    function isEmpty(object) {
        for(let a in object){
            return false;
        }
        return true;
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
});