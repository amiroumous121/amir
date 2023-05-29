const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const equalButton = document.querySelector(".equal");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.textContent === "C") {
      display.value = "";
    } else if (button.textContent !== "=") {
      // Add space around operators
      if (["+", "-", "*", "/"].includes(button.textContent)) {
        display.value += ` ${button.textContent} `;
      } else {
        display.value += button.textContent;
      }
    }
  });
});

equalButton.addEventListener("click", async () => {
  const [num1, operator, num2] = display.value.split(" ");

  if (!num1 || !operator || !num2) {
    display.value = "Error";
    return;
  }

  const operatorMapping = {
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
  };

  const operation = operatorMapping[operator.trim()];
  try {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        num1: parseFloat(num1),
        num2: parseFloat(num2),
        operation: operation,
      }),
    });
  } catch (error) {
    console.log(error);
  }

  if (!response.ok) {
    display.value = "Error";
    return;
  }

  const data = await response.json();
  display.value = data.result;
});
