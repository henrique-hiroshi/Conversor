const convertButton = document.querySelector(".convert-button");
const currencySelect1 = document.querySelector(".currency-select-1");
const currencySelect2 = document.querySelector(".currency-select-2");
const inputCurrency = document.querySelector(".input-currency");

const valueFrom = document.querySelector(".currency-value-to-convert");
const valueTo = document.querySelector(".currency-value");
const imgFrom = document.querySelector(".currency-img-1");
const imgTo = document.querySelector(".currency-img-2");
const currencyNameTo = document.getElementById("currency-name2");

const currencies = {
  real: {
    rate: 1,
    locale: "pt-BR",
    currency: "BRL",
    name: "Real",
    img: "./assets/real.png",
  },
  dolar: {
    rate: 5,
    locale: "en-US",
    currency: "USD",
    name: "Dólar americano",
    img: "./assets/dolar.png",
  },
  euro: {
    rate: 6,
    locale: "de-DE",
    currency: "EUR",
    name: "Euro",
    img: "./assets/euro.png",
  },
  libra: {
    rate: 8,
    locale: "en-GB",
    currency: "GBP",
    name: "Libra",
    img: "./assets/libra.png",
  },
  bitcoin: {
    rate: 100000,
    locale: "en-US",
    currency: "BTC",
    digits: 8,
    name: "Bitcoin",
    img: "./assets/bitcoin.png",
  },
};

// Busca cotações reais
async function fetchRates() {
  try {
    const fiatResponse = await fetch(
      "https://api.exchangerate.host/latest?base=BRL"
    );
    const fiatData = await fiatResponse.json();

    currencies.dolar.rate = 1 / fiatData.rates.USD;
    currencies.euro.rate = 1 / fiatData.rates.EUR;
    currencies.libra.rate = 1 / fiatData.rates.GBP;

    // Bit
    const btcResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl"
    );
    const btcData = await btcResponse.json();

    currencies.bitcoin.rate = btcData.bitcoin.brl;
  } catch (error) {
    console.warn("Erro ao buscar cotações. Usando valores padrão.");
  }
}

// Conversão
function convertValues() {
  const inputValue = Number(inputCurrency.value) || 0;

  const from = currencies[currencySelect1.value];
  const to = currencies[currencySelect2.value];

  const valueInReal = inputValue * from.rate;
  const convertedValue = valueInReal / to.rate;

  valueFrom.innerHTML = new Intl.NumberFormat(from.locale, {
    style: "currency",
    currency: from.currency,
    minimumFractionDigits: from.digits ?? 2,
  }).format(inputValue);

  valueTo.innerHTML = new Intl.NumberFormat(to.locale, {
    style: "currency",
    currency: to.currency,
    minimumFractionDigits: to.digits ?? 2,
  }).format(convertedValue);

  imgFrom.src = from.img;
  imgTo.src = to.img;
  currencyNameTo.innerText = to.name;
}

// Inicialização
window.addEventListener("load", async () => {
  await fetchRates();
  convertValues();
});

convertButton.addEventListener("click", convertValues);
currencySelect1.addEventListener("change", convertValues);
currencySelect2.addEventListener("change", convertValues);
