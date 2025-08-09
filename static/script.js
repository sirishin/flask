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
        speak(`이디야, ${parseInt(customerNumber)}번 고객님 음료나왔습니다. `);
      }
      customerNumber = ""; // 초기화
    } catch {
      output = "Error";
      speak("계산에 오류가 있습니다");
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

// 음성 출력 함수
function speak(text) {
  const msg = new SpeechSynthesisUtterance();
  msg.lang = 'ko-KR';
  msg.text = text;
  msg.volume = 1.0;
  msg.rate = 0.90;
  window.speechSynthesis.speak(msg);
}
