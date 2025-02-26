const formSteps = document.querySelectorAll(".formSteps");
const stepCircles = document.querySelectorAll(".stepIndicator");
const formInputs = document.querySelectorAll(".stepOne form input");
const planOption = document.querySelectorAll(".planOption");
const toggleSwitch = document.querySelector(".toggleSwitch");
const addOnOption = document.querySelectorAll(".addOnOption");
const totalPrice = document.querySelector(".totalPrice span");
const planPrice = document.querySelector(".planPrice");
const toggleSwitchInput = document.querySelector(".toggleSwitch input");

let time;
let currentStep = 1;
let currentCircle = 0;
let selectedPlan = "Arcade";
let isYearly = false;

const summaryObj = {
  plan: null,
  planType: null,
  price: null,
};

const plans = {
  Arcade: { monthly: "$9/mo", yearly: "$90/yr" },
  Advanced: { monthly: "$12/mo", yearly: "$120/yr" },
  Pro: { monthly: "$15/mo", yearly: "$150/yr" },
};

function showStep(index) {
  formSteps.forEach((step, i) => {
    step.style.display = i === index ? "flex" : "none";
  });

  stepCircles.forEach((circle, i) => {
    circle.classList.toggle("activeStep", i === index);
  });
}

showStep(currentStep);

window.addEventListener("load", () => {
  currentStep = 1;
  showStep(currentStep);
});

formSteps.forEach((step) => {
  const nextButton = step.querySelector(".nextButton");
  const backButton = step.querySelector(".backButton");

  if (nextButton) {
    nextButton.addEventListener("click", (e) => {
      if (!formValidation()) {
        e.preventDefault();
        return;
      }
      if (currentStep < formSteps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    });
  }

  if (backButton) {
    backButton.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  }
});

function summarize() {
  const planName = document.querySelector(".planName");
  const planPrice = document.querySelector(".planPrice");
  const addOnsContainer = document.querySelector(".addOnsSummary");

  if (
    !summaryObj ||
    typeof summaryObj.price !== "string" ||
    !summaryObj.price.trim()
  ) {
    console.error("Error: summaryObj.price is null, undefined, or invalid");
    summaryObj.price = "$0/mo";
  }

  console.log("Summarizing with:", summaryObj);

  addOnsContainer.innerHTML = "";

  if (summaryObj.plan) {
    planName.innerText = `${summaryObj.plan} (${summaryObj.planType})`;
    planPrice.innerText = summaryObj.price;
  } else {
    console.warn("Warning: summaryObj.plan is null or undefined");
  }

  selectedAddOns.forEach((addOn) => {
    const addOnDiv = document.createElement("div");
    addOnDiv.classList.add("addOnSummaryItem");
    addOnDiv.innerHTML = `<span class="summaryItemName">${addOn.name}</span>
                            <span class="summaryItemPrice">${addOn.price}</span>`;
    addOnsContainer.appendChild(addOnDiv);
  });

  let totalAmount = 0;

  if (summaryObj.price.match(/\d+/)) {
    totalAmount = parseInt(summaryObj.price.replace(/\D/g, ""), 10);
  } else {
    console.error("Error: Failed to parse summaryObj.price");
  }

  selectedAddOns.forEach((addOn) => {
    if (addOn.price.match(/\d+/)) {
      totalAmount += parseInt(addOn.price.replace(/\D/g, ""), 10);
    }
  });

  if (totalPrice) {
    totalPrice.innerText = `+$${totalAmount}/${isYearly ? "yr" : "mo"}`;
  } else {
    console.warn("Warning: totalPrice element not found.");
  }

  setTotal();
}

document
  .querySelector(".stepThree .nextButton")
  .addEventListener("click", () => {
    summarize();
  });

function formValidation() {
  let validInput = true;

  for (let index = 0; index < formInputs.length; index++) {
    const input = formInputs[index];
    const inputGroup = input.previousElementSibling;

    if (!input.value.trim()) {
      validInput = false;
      input.classList.add("err");

      if (inputGroup && inputGroup.querySelector(".errorMessage")) {
        inputGroup.querySelector(".errorMessage").style.display = "block";
      }
    } else {
      input.classList.remove("err");

      if (inputGroup && inputGroup.querySelector(".errorMessage")) {
        inputGroup.querySelector(".errorMessage").style.display = "none";
      }
    }
  }
  return validInput;
}

function findFormLabel(el) {
  const inputGroup = el.previousElementSibling;
  return inputGroup ? inputGroup : null;
}

planOption.forEach((option) => {
  option.addEventListener("click", () => {
    planOption.forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");

    const selectedPlan = option.querySelector("h3").innerText;

    const billingType = isYearly ? "yearly" : "monthly";

    summaryObj.plan = selectedPlan;
    summaryObj.planType = isYearly ? "Yearly" : "Monthly";
    summaryObj.price = plans[selectedPlan][billingType];

    const selectedPlanPrice = option.querySelector(".planPrice");
    selectedPlanPrice.innerText = plans[selectedPlan][billingType];

    console.log(summaryObj);
    summarize();
  });
});

toggleSwitchInput.addEventListener("change", () => {
  isYearly = toggleSwitchInput.checked;

  planOption.forEach((option) => {
    const planName = option.querySelector("h3").innerText;
    const planPriceElement = option.querySelector(".planPrice");

    if (plans[planName]) {
      planPriceElement.innerText = isYearly
        ? plans[planName].yearly
        : plans[planName].monthly;
    }
  });

  if (summaryObj.plan) {
    summaryObj.planType = isYearly ? "Yearly" : "Monthly";
    summaryObj.price = plans[summaryObj.plan][isYearly ? "yearly" : "monthly"];
  }

  summarize();
});

toggleSwitch.addEventListener("click", () => {
  const switchAct = toggleSwitch.querySelector("input").checked;
  if (switchAct) {
    document.querySelector(".monthlyBill").classList.remove("billActive");
    document.querySelector(".yearlyBill").classList.add("billActive");
  } else {
    document.querySelector(".monthlyBill").classList.add("billActive");
    document.querySelector(".yearlyBill").classList.remove("billActive");
  }
  switchPrice(switchAct);
  summaryObj.planType = switchAct;
  summarize();
});

const selectedAddOns = [];

addOnOption.forEach((addOn) => {
  addOn.addEventListener("click", () => {
    const checkBox = addOn.querySelector("input");
    checkBox.checked = !checkBox.checked;

    const addOnName = addOn.querySelector("label").innerText;
    const addOnPrice = addOn.querySelector(".addOnPrice").innerText;

    if (checkBox.checked) {
      selectedAddOns.push({ name: addOnName, price: addOnPrice });
    } else {
      const index = selectedAddOns.findIndex((item) => item.name === addOnName);
      if (index !== -1) {
        selectedAddOns.splice(index, 1);
      }
    }
  });
});

function switchPrice(checked) {
  const yearlyPrice = [90, 120, 150];
  const monthlyPrice = [9, 12, 15];
  const planPrice = document.querySelectorAll(".planPrice");
  if (checked) {
    planPrice[0].innerHTML = `$${yearlyPrice[0]}/yr`;
    planPrice[1].innerHTML = `$${yearlyPrice[1]}/yr`;
    planPrice[2].innerHTML = `$${yearlyPrice[2]}/yr`;
    configureTime(true);
  } else {
    planPrice[0].innerHTML = `$${monthlyPrice[0]}/mo`;
    planPrice[1].innerHTML = `$${monthlyPrice[1]}/mo`;
    planPrice[2].innerHTML = `$${monthlyPrice[2]}/mo`;
    configureTime(false);
  }
}

function showAddon(addOnName, isVal) {
  const addOnTemp = document.getElementsByTagName("template")[0];
  const addOnClone = addOnTemp.content.cloneNode(true);
  const summaryItemName = addOnClone.querySelector(".summaryItemName");
  const summaryItemPrice = addOnClone.querySelector("summaryItemPrice");
  const summaryItemID = addOnClone.querySelector(".addOnSummaryItem");

  if ((addOnName, isVal)) {
    summaryItemName.innerText = addOnName.querySelector("label").innerText;
    summaryItemPrice.innerText =
      addOnName.querySelector(".addOnPrice").innerText;
    summaryItemID.setAttribute("addon-id", addOnName.dataset.id);
    document.querySelector(".addOnsSummary").appendChild(addOnClone);
  } else {
    const addons = document.querySelectorAll(".addOnSummaryItem");

    addons.forEach((addon) => {
      const addonAttribute = addon.getAttribute("addon-id");

      if (addonAttribute == ad) {
        addon.remove();
      }
    });
  }
}

function setTotal() {
  const planText = planPrice.innerHTML;
  const planAmount = planText.replace(/\D/g, "");
  const addonPriceElements = document.querySelectorAll(
    ".addOnSummaryItem .summaryItemPrice"
  );

  let totalAddonCost = 0;
  for (let i = 0; i < addonPriceElements.length; i++) {
    const addonText = addonPriceElements[i].innerHTML;
    const addonAmount = addonText.replace(/\D/g, "");

    totalAddonCost += Number(addonAmount);
  }
  totalPrice.innerHTML = `$${totalAddonCost + Number(planAmount)}/${
    time ? "yr" : "mo"
  }`;
}

function configureTime(duration) {
  return (time = duration);
}
