

// 스크롤 락
$("#scrollLock").click(function(){
    $('body').toggleClass('overflow-hidden');
});
// 섹션 모두 보이기
$('#showSections').click(function() {
    $('section').show();
})

// 새로고침 방지
window.onbeforeunload = function() {
    return "페이지를 새로고침하면 저장되지 않은 내용이 사라집니다. 새로고침 하시겠습니까?";
};


// 게임 참여 인원 표시
db.collection('results').get().then((snapshot)=> {
    var participants = snapshot.docs.length;
    $('p.participants span').html(participants);
})

function recordResult(answers, scores, result) {
    var type1 = {};
    for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        const q = answer.q;
        const a = answer.a;
        type1[q] = a;
    }

    var type2 = {"01": 1};
    var checkboxes = $('.menu form input[type=checkbox]');
    for (let j = 0; j < checkboxes.length; j++) {
        const checkbox = checkboxes[j];
        type2[checkbox.value] = checkbox.checked;
    }

    db.collection('results').add({
        answer: {
            type1: type1,
            type2: type2
        },
        score: scores,
        result: result
    })
    .then(()=> {
        // 결과 페이지로 이동
        var url = `/result.html?artId=${result}`;
        $(location).attr('href', url);        
    })
    .catch((error)=> {
        console.log('error: '+error);
    })
}


// 배경음악 볼륨 조절
var bgm = document.getElementById("bgm");
bgm.volume = 0.2;

// 배경음악 컨트롤
$('.bgm_ctrl').click(function() {
    if ($(this).hasClass("bgm-on")) {
        bgm.pause();
        $(this).removeClass("bgm-on");
    } else {
        bgm.play();
        $(this).addClass("bgm-on");     
    }
})

// 답변 저장 배열
var answers = [];

// 중복 방지
clicked = false;

// 다음섹션으로 이동
function moveToNextSection(thisObj) {
    // 중복 방지
    if ( clicked ) {
        return
    } else {
        clicked = true;
    }

    // 섹션 보이기
    thisObj.closest("section").next().show();
    
    // 섹션 이동
    setTimeout(() => {
        $('html,body').animate({ scrollTop: thisObj.closest("section").next().offset().top}, 200);

        clicked = false;
    }, 1000);

    setTimeout(() => {
        // 섹션 숨기기
        thisObj.closest("section").hide();
    }, 2000);
}

// 성향테스트 시작
$('#start_btn').click(function() {
    bgm.play();
    $('.bgm_ctrl').removeClass('hide');

    $('main').show();
    $('#s1').show();
    setTimeout(() => {
        $('header').hide();
    }, 2000);
})

$('.move-to-next').click(function() {
    moveToNextSection($(this));
})

// 답변 선택 액션
$('.q li div').click(function() {

    // 선택한 질문 아이디 가져오기
    var q = $(this).closest('.q').attr("id");
    var a = $(this).attr("class");
    console.log(q, a);

    // 답변 중복 선택 방지
    for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        if ( answer.q == q ) {
            clicked = false;
            return
        }
    }
    
    // 선택 기록
    answers.push({'q':q, 'a':a});
    console.log(answers);
    
    // 선택 강조
    $('#' + q + ' p').css({"opacity":0});
    $('#' + q + ' h2').css({"opacity":0});
    $('#' + q + ' li div').not(this).css({"opacity":0});
    $(this).addClass("neon_btn neon_text");
    
    // 다음 페이지로
    moveToNextSection($(this));
    markScore();
})

$('.menu button').click(function(e) {
    e.preventDefault();
    moveToNextSection($(this));
})


// 가장 큰 점수를 가진 오브젝트의 키값 가져오기
function getMaxValueKey(obj) {
    return Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
}
// 답변별 점수 받아오기
$.getJSON("/json/score.json", function(json) {
    scoreChart = json;
});

// 답변 제출 액션
function submit() {
    // 4중 택1
    console.log(scoreChart);
    if (!scoreChart) {
        console.log("error: scoreChart not founded.");
        return
    }

    var scores = {"01":0, "02":0, "03":0, "04":0, "05":0, "06":0, "07":0, "08":0, "09":0, "10":0, "11":0, "12":0, "13":0, "14":0, "15":0, "16":0, "17":0, "18":0}

    for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        const q = answer.q;
        const a = answer.a;
        const targets = scoreChart[q][a];
        for (let j = 0; j < targets.length; j++) {
            const target = targets[j];
            scores[target] = Number(scores[target]) + 1;
        }
    }

    // 나에게 해당하는 것 선택
    var checkboxes = $('.menu form input[type=checkbox]');
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        if (checkbox.checked) {
            const target = checkbox.value;
            scores[target] = Number(scores[target]) + 2;
        }
    }

    // 최고득점 작품 뽑기
    console.log(scores);
    console.log(getMaxValueKey(scores));

    // 데이터베이스에 기록후 페이지 이동
    recordResult(answers, scores, getMaxValueKey(scores));
}

// 점수판에 점수 표시
function markScore() {
    if (!scoreChart) {
        console.log("error: scoreChart not founded.");
        return
    }

    var scores = {"01":0, "02":0, "03":0, "04":0, "05":0, "06":0, "07":0, "08":0, "09":0, "10":0, "11":0, "12":0, "13":0, "14":0, "15":0, "16":0, "17":0, "18":0}

    for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        const q = answer.q;
        const a = answer.a;
        const targets = scoreChart[q][a];
        for (let j = 0; j < targets.length; j++) {
            const target = targets[j];
            scores[target] = Number(scores[target]) + 1;
        }
    }


    // 나에게 해당하는 것 선택
    var checkboxes = $('.menu form input[type=checkbox]');
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        if (checkbox.checked) {
            const target = checkbox.value;
            scores[target] = Number(scores[target]) + 2;
        }
    }

    // 점수 마킹
    var arr = Object.keys(scores).sort();
    for (let k = 0; k < arr.length; k++) {
        const key = arr[k];
        const score = scores[key];
        $('#score-board p span').eq(k).html(score);
    }

}


// 결과 제출시키기
$('.last_q li').click(function() {
    console.log('submit');
    $('.wait_text h1').hide();
    setTimeout(function(){
        $('.wait_text h1').fadeIn();
    }, 2000);

    setTimeout(function(){
        submit();
    }, 5000);
})
