import { effect, signal } from "@preact/signals-core";

function getElement<T extends typeof HTMLElement>(
  query: string,
  ElementClass?: T,
) {
  const ele = document.querySelector(query);
  if (ele instanceof (ElementClass ?? HTMLElement)) {
    return ele as InstanceType<T>;
  }
  throw Error(`Element by "${query}" not exists`);
}

function percentage(value: unknown) {
  const text = String(value);
  if (/%$/.test(text)) {
    return Number(text.slice(0, -1)) / 100;
  } else {
    return Number(text) / 100;
  }
}

const form = getElement("form", HTMLFormElement);
const result = {
  tipAmount: getElement("#result-tip-amount"),
  total: getElement("#result-total"),
};
const state = {
  bill: signal(0),
  tip: signal(0),
  count: signal(0),
};

effect(() => {
  const tipAmount = (state.bill.value * state.tip.value) / state.count.value;
  const total = (state.bill.value * (1 + state.tip.value)) / state.count.value;

  const render = (n: number) =>
    Number.isFinite(n) ? `$${n.toFixed(2)}` : "$0";

  result.tipAmount.textContent = render(tipAmount);
  result.total.textContent = render(total);
});

form.addEventListener("input", () => {
  const data = new FormData(form);
  state.bill.value = Number(data.get("bill"));
  state.count.value = Number(data.get("people-count"));
  state.tip.value =
    percentage(data.get("tip")) || percentage(data.get("custom-tip"));
});

form.addEventListener("reset", () => {
  state.bill.value = 0;
  state.tip.value = 0;
  state.count.value = 0;
});
