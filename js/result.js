// result page
const pic = document.querySelector('#pic');
const title = document.querySelector('#title');
const pName = document.querySelector('#pname');
const desc = document.querySelector('#desc');

const reItemPic = document.querySelector('#re_item_pic')
const itemTitle = document.querySelector('#item')
const itemDesc = document.querySelector('#item_desc')
const reCharacterPic = document.querySelector('#re_character_pic')
const characterTitle = document.querySelector('#character')
const characterDesc = document.querySelector('#character_desc')

$.ajax({
    type: "POST",
    url: `https://upti-api.unnispick.com/result`,
    data: JSON.stringify({
        "spti": getParam("spti"),
        "gender": encodeURI(getParam("gender"))
    }),
    contentType: "text/plain",
    dataType: "json",
    success: function (response) {

        const data = response.body

        // MAIN INFO
        pic.src = data.pic
        title.textContent = data.title
        pName.textContent = data.name

        for (let i = 0; i < data.desc.length; i++) {

            const newLi = document.createElement('li'); // test.length만큼 li를 만든다 
            desc.appendChild(newLi); // desc자식요소로 li를 넣는다 
            desc.children[i].textContent = data.desc[i]
        }

        // SUB INFO
        itemTitle.textContent = data.recommendItem.name
        reItemPic.src = data.recommendItem.pic
        itemDesc.textContent = data.recommendItem.desc
        characterTitle.textContent = data.recommendCharacter.name
        reCharacterPic.src = data.recommendCharacter.pic
        characterDesc.textContent = data.recommendCharacter.desc

    }

});

// url 에서 parameter 추출

function getParam(sname) {
    var params = location.search.substr(location.search.indexOf("?") + 1);
    var sval = "";

    params = params.split("&");

    for (var i = 0; i < params.length; i++) {

        temp = params[i].split("=");
        if ([temp[0]] == sname) {
            sval = temp[1];
        }
    }
    return sval;
}

const linkBtns = document.querySelectorAll('.link-btn');
for (var i = 0; i < linkBtns.length; i++) {
    linkBtns[i].addEventListener('click', (e) => {
        const data = JSON.stringify({
            category: encodeURI(e.target.dataset.category),
            gender: encodeURI(getParam('gender')),
            spti: getParam('spti'),
        });
        console.log(data);
        window.open(e.target.dataset.url, "_blank");
        $.ajax({
            type: "POST",
            url: "https://upti-api.unnispick.com/stats",
            data: data,
            success: function (response) {

            }
        });
    });

    linkBtns[i].addEventListener('mouseover', (e) => {
        e.target.style.cursor = "pointer";
    });
};

const shareBtn = document.querySelector('#share_btn');

shareBtn.addEventListener("click", (e) => {
    e.preventDefault()

    const url = `${encodeURI(document.URL)}&shared=true`;
    const sharedUrl = document.createElement("textarea");
    sharedUrl.type = 'hidden';
    document.body.appendChild(sharedUrl);
    sharedUrl.value = url;
    sharedUrl.select();
    const isSuccess = document.execCommand('copy');
    document.body.removeChild(sharedUrl);
    if (isSuccess) {
        alert("Tautan telah disalin");
    } else {
        alert("copy fail");
    }
});

// loading page
const loadingWrap = document.querySelector('.loading_wrap');
const startText = document.querySelector('.start_text')
const startBtn = document.querySelector('.start_btn')
const startI = document.querySelector('.fa-undo-alt')
const whatsappA = document.querySelector('#whats_btn')


whatsappA.addEventListener('click', (e) => {
    const encode = encodeURIComponent(document.URL + `&shared=true`)
    e.target.parentNode.href = `https://api.whatsapp.com/send?phone=&text=${encode}`
})

// 파라메터에 shared가 true면(= 결과값만 링크했을때) 다음과 같이 됨
if (getParam('shared') === "true") {
    loadingWrap.classList.add('none');
    startText.textContent = 'Start!'
    startText.style.fontWeight = '900'
    startBtn.style.backgroundColor = '#E06A60' //FFEDBF
    startI.style.color = '#FFEDBF'
} else {
    // 페이지가 로딩되고 2초 후에 디스플레이가 none으로 변경 되면 됨
    setTimeout(function () {
        loadingWrap.classList.add('none')
    }, 2000);
}