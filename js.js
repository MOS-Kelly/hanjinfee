function find_rate(type, region, baseFare) {
    // 요율표(image_373da2.png)의 단가 열에 적힌 '이상(>=)' 기준 금액들 (총 12개)
    const thresholds = [0, 1400, 1500, 1600, 1700, 1800, 2000, 2300, 2501, 3500, 4000, 5000];
    
    // 요율표 행 순서와 개수(12개)를 완벽하게 일대일 매칭한 데이터
    const data_prepaid = {
        'A': [8, 8, 9, 11, 12, 16, 19, 21, 26.5, 26.5, 31.5, 36.5],
        'B': [8, 8, 9, 11, 12, 16, 19, 21, 28.5, 28.5, 33.5, 38.5],
        'C': [8, 8, 9, 11, 12, 16, 19, 21, 30.5, 30.5, 35.5, 40.5]
    };
    
    const data_credit = {
        'A': [8, 8, 9, 11, 12, 16, 19, 21, 26.5, 26.5, 26.5, 26.5],
        'B': [8, 8, 9, 11, 12, 16, 19, 21, 28.5, 28.5, 28.5, 28.5],
        'C': [8, 8, 9, 11, 12, 16, 19, 21, 30.5, 30.5, 30.5, 30.5]
    };

    // 6000원 이상 행을 위한 예외 처리 (6000원 이상은 표의 마지막 요율 적용)
    if (baseFare >= 6000) {
        if (type === "선불") {
            if (region === 'A') return 39.5;
            if (region === 'B') return 41.5;
            if (region === 'C') return 43.5;
        } else {
            if (region === 'A') return 26.5;
            if (region === 'B') return 28.5;
            if (region === 'C') return 30.5;
        }
    }

    const targetTable = (type === "선불") ? data_prepaid : data_credit;
    const regionRates = targetTable[region];

    if (!regionRates) return 0;

    // 큰 금액(5000)부터 거꾸로 내려오면서 "이 금액 이상인가?"를 비교합니다.
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (baseFare >= thresholds[i]) {
            return regionRates[i];
        }
    }
    
    return regionRates[0];
}

function run_calculation() {
    const type = document.getElementById("calc_type").value;
    const region = document.getElementById("calc_region").value;
    const fareValue = document.getElementById("calc_fare").value.trim();
    const fare = parseFloat(fareValue);

    if (isNaN(fare) || fare <= 170) {
        alert("170원보다 큰 정확한 운임 금액을 입력해주세요.");
        return;
    }

    const baseFare = fare - 170;
    const rate = find_rate(type, region, baseFare);
    
    // 최종 수수료 = 정산기준액 * 요율% * 0.85
    const finalFee = baseFare * (rate / 100) * 0.85;

    // 화면에 반영
    const outRateEl = document.getElementById("out_rate");
    const outResultEl = document.getElementById("out_result");
    
    if (outRateEl) outRateEl.innerText = rate;
    if (outResultEl) {
        outResultEl.innerText = Math.round(finalFee).toLocaleString();
    }
}

// 버튼 바인딩
document.addEventListener("DOMContentLoaded", function() {
    const calcBtn = document.getElementById('calc_btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', run_calculation);
    }
});
