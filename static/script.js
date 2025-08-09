const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const specialChars = ["%", "*", "/", "-", "+", "="];
let output = "";
let customerNumber = ""; // 누른 숫자 누적 저장

const calculate = (btnValue) => {
  display.focus();

  if (btnValue === "=" && output !== "") {
    try {
      output = eval(output.replace("%", "/100"));

      if (customerNumber) {
        speakBroadcast(`이디야, ${parseInt(customerNumber)}번 고객님, 음료 나왔습니다.`);
      }
      customerNumber = ""; // 초기화
    } catch {
      output = "Error";
      speakBroadcast("계산에 오류가 있습니다.");
    }
  } else if (btnValue === "AC") {
    output = "";
    customerNumber = "";
  } else if (btnValue === "DEL") {
    output = output.toString().slice(0, -1);
    customerNumber = customerNumber.toString().slice(0, -1);
  } else {
    if (specialChars.includes(btnValue) && specialChars.includes(output[output.length - 1])) {
      return;
    }
    if (output === "" && specialChars.includes(btnValue)) return;

    if (!isNaN(btnValue)) {
      customerNumber += btnValue; // 숫자 누적
    }

    output += btnValue;
  }

  display.value = output;
};

buttons.forEach((button) => {
  button.addEventListener("click", (e) => calculate(e.target.dataset.value));
});

document.addEventListener("keydown", (event) => {
  const key = event.key;
  const allowedKeys = [...Array(10).keys()].map(String).concat([".", "Enter", "Backspace", "%", "*", "/", "-", "+"]);

  if (allowedKeys.includes(key)) {
    let value = key === "Enter" ? "=" : key;
    value = key === "Backspace" ? "DEL" : value;
    calculate(value);
  }
});

// ======================
// 방송 스타일 TTS 함수
// ======================
function speakBroadcast(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = 'ko-KR';
  msg.rate = 0.85;  // 약간 느리게
  msg.pitch = 1.2;  // 조금 높게
  msg.volume = 1.0; // 최대 볼륨

  // 음성 시작 시 EQ/압축 효과 적용
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();

  const eqFilter = audioContext.createBiquadFilter();
  eqFilter.type = "peaking";
  eqFilter.frequency.value = 3000; // 명료도 강조
  eqFilter.gain.value = 8; // 8dB boost

  const compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-24, audioContext.currentTime);
  compressor.knee.setValueAtTime(30, audioContext.currentTime);
  compressor.ratio.setValueAtTime(12, audioContext.currentTime);
  compressor.attack.setValueAtTime(0.003, audioContext.currentTime);
  compressor.release.setValueAtTime(0.25, audioContext.currentTime);

  eqFilter.connect(compressor);
  compressor.connect(audioContext.destination);

  msg.onstart = () => {
    const source = audioContext.createMediaStreamSource(destination.stream);
    source.connect(eqFilter);
  };

  window.speechSynthesis.speak(msg);
}
