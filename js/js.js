let data=[];
const dataUrl = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json'
axios.get(dataUrl)
    .then((response)=>{
        data = response.data.data;
        showData(data);
    })


const ticketList = document.querySelector('.ticketList');
const ticketAddBtn = document.querySelector('.addTicketForm__btn');
const ticketInput = document.querySelectorAll('.addTicketForm__group_Input input,.addTicketForm__group_Input textarea,.addTicketForm__group_Input select');
const nowNum = document.querySelector('.searchBar__text');
const searchArea = document.querySelector('.searchBar__search');
let content = false; // 為true時才可以新增套票


let showData=(data)=>{ 
    ticketList.innerHTML = '';
    let num = data.length;
    nowNum.innerHTML = `本次搜尋結共 ${num} 筆`;
    data.forEach((item)=> {
        let li = document.createElement('li');
        li.setAttribute('class','ticketCard');
        let cardTop = `
            <div class="ticketCard__top" style="background-image: url('${item['imgUrl']}');">
            <div class="ticketCard__top_area h3">${item['area']}</div>
            <div class="ticketCard__top_rate h4">${item['rate']}</div>
            </div>`;
        let cardContent = `
            <div class="ticketCard__content">
            <h2>${item['name']}</h2>
            <hr>
            <h4>
                ${item['description']}
            </h4>
            <div class="ticketCard__content_info">
                <div class="h4 ticketNum">
                    <span><i class="fas fa-exclamation-circle"></i></span>
                    剩下最後 ${item['group']} 組
                </div>
                <div class="h4 ticketPrice">
                    <h4>TWD<span>${item['price']}</span></h4>
                </div>
            </div>
            </div>`
        cardTop+=cardContent;
        li.innerHTML=cardTop;
        ticketList.appendChild(li);
    });
    countChart(data);
}
//==========根據陣列秀出資料==========


ticketAddBtn.addEventListener('click',()=>{
    checkValue();
    if(content){
        let obj = {};
        obj.name = document.getElementById('ticketName').value;
        obj.imgUrl = document.getElementById('ticketImg').value;
        obj.area = document.getElementById('ticketArea').value;
        obj.price = document.getElementById('ticketPrice').value;
        obj.group = document.getElementById('ticketNum').value;
        obj.rate = document.getElementById('ticketRate').value;
        obj.description = document.getElementById('ticketDect').value;
        data.push(obj);
        showData(data);
        document.querySelector('.addTicketForm').reset();
    }
    countChart(data);
})
//==========點擊新增套票按鈕==========


let checkValue = ()=>{ 
    ticketInput.forEach((item)=>{
        let value = item.value;
        let id = item.getAttribute('id');
        let text = document.querySelector(`[data-message='${id}']`);

        if(value == ''||value==NaN){
            content = false;
            text.textContent = '此為必填欄位';
        }else{
            content = true;
            text.textContent = '';
        }
    })
}
//==========檢查每個input是否有值==========


searchArea.addEventListener('change',(e)=>{
    let value = document.querySelector('.searchBar__search').value; //用searchArea抓不到value?
    let newData=[];
    if (value==''){
        showData(data);
        return;
    }
    data.forEach((item)=>{
        if(item.area == value){
            newData.push(item);
            showData(newData);
        }
    })
});
//==========更改搜尋地區==========


ticketInput.forEach((item)=>{ 
    item.addEventListener('blur',(e)=>
        {
            let value = e.target.value;
            let id = e.target.id;
            let text = document.querySelector(`[data-message='${id}']`);
            if(value == NaN||value ==''){
                text.textContent = '此為必填欄位';
            }else{
                text.textContent = '';
            }
        }
    )
})
//==========每次blur時檢查input是否有值==========


const ticketRate = document.getElementById('ticketRate');
ticketRate.addEventListener('keyup',()=>{
    let value = ticketRate.value;
    if(value>10){
        ticketRate.value = 10;
        console.log(ticketRate.value);
    }
})
//==========單獨檢查套票星級是否大於10==========


let countChart = (data)=>{
    let areaData = [];
    let chartData = {};
    data.forEach((item)=>{
        let obj = {};
        obj.area = item.area;
        areaData.push(obj);
    })
    areaData.forEach((item)=>{
        let str = item.area;
        if(chartData[str]==undefined){
            chartData[str]=1;
        }else{
            chartData[str]+=1;
        }
    });

    console.log(chartData);
    // {高雄: 1, 台北: 1, 台中: 1}
    let chartDataAry = [];
    let chartAry = Object.keys(chartData);
    let chartLen = chartAry.length;
    console.log(chartAry);//["高雄", "台北", "台中"]
    for(let i=0;i<chartLen;i++){
        chartDataAry.push([chartAry[i],chartData[chartAry[i]]]);
        console.log(chartDataAry[i]);
    }
    
    
    let chart = c3.generate({
        bindto: '#c3chart',
        data:{
            columns: chartDataAry,
            type : 'donut',
        },
        donut: {
            title: "套票地區比重",
        }
    });
};


    



    




