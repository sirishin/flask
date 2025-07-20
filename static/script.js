const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const specialChars = ["%", "*", "/", "-", "+", "="];
let output = "";

const form = document.querySelector("#call-form");

const calculate = (btnValue) => {
  display.focus();

  if (btnValue === "=" && output !== "") {
    try {
      output = eval(output.replace("%", "/100"));
      display.value = output;

      // 결과를 서버로 POST 전송
      setTimeout(() => {
        form.submit();
      }, 100); // 잠깐 기다렸다가 전송
    } catch {
      output = "Error";
      display.value = output;
    }
  } else if (btnValue === "AC") {
    output = "";
    display.value = "";
  } else if (btnValue === "DEL") {
    output = output.toString().slice(0, -1);
    display.value = output;
  } else {
    if (specialChars.includes(btnValue) && specialChars.includes(output[output.length - 1])) return;
    if (output === "" && specialChars.includes(btnValue)) return;
    output += btnValue;
    display.value = output;
  }
};

buttons.forEach((button) => {
  button.addEventListener("click", (e) => calculate(e.target.dataset.value));
});

document.addEventListener("keydown", (event) => {
  const key = event.key;
  const allowedKeys = [...Array(10).keys(), ".", "Enter", "Backspace", "%", "*", "/", "-", "+"];
  
  if (allowedKeys.includes(key) || key === "Backspace") {
    let value = key === "Enter" ? "=" : key;
    value = key === "Backspace" ? "DEL" : value;
    calculate(value);
  }
});
            
