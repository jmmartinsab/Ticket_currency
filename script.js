const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const cur = document.getElementById('cur');
const movieSelect = document.getElementById('movie');
const currencyEl = document.getElementById('currency');

/* Pruebas con la consola
console.log(currencyEl.options[48].value);
console.log(currencyEl.selectedIndex);
console.log(currentIndex);*/

let currentIndex = currencyEl.selectedIndex;
let selectedCurrency = currencyEl.options[currentIndex].value;
let priceRated = 0;//<---------- aqui defino priceRated

populateUI();
calculate();

let ticketPrice = +movieSelect.value;

//Fetch exchange rate
function calculate() {//<------------- aquí hago el calculo precio entrada a la divisa
  fetch(`https://api.exchangerate-api.com/v4/latest/${currencyEl.options[48].value}`)
    .then((res) => res.json())
    .then((data) => {
      const rate = data.rates[currencyEl.value];

      priceRated = (ticketPrice * rate).toFixed(2);//<---- lo guardo en price rated

      updateSelectedCount();
    });
    return priceRated;
}

//Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem('selectedMovieIndex', movieIndex);
  localStorage.setItem('selectedMoviePrice', moviePrice);
}

function setCurrencyData(selectCurr) {
  //para almacenar la divisa en localstorage
  localStorage.setItem('selectedCurrency', selectCurr);
}

//Update total and count
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');

  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;

  movieSelect.querySelectorAll('.mov-curr').forEach((_p) => {
    option.innerText = `${+priceRated} ${currencyEl.value}`;
  });

  calculate();
  priceRated= +priceRated;

  count.innerText = selectedSeatsCount;
  total.innerText = (selectedSeatsCount * priceRated || selectedSeatsCount * ticketPrice).toFixed(2);
  cur.innerText = currencyEl.value;
}

//Get data from local storage and populateUI
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
}

//Movie select event
movieSelect.addEventListener('change', (e) => {
  ticketPrice = +e.target.value;
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
});

//Seat click event
container.addEventListener('click', (e) => {
  if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
    e.target.classList.toggle('selected');

    updateSelectedCount();
  }
});

//event currency
currencyEl.addEventListener('change', (e) => {
  //añadido para actualizar el valor de la divisa a elegir
  selectedCurrency = +e.target.value;
  setCurrencyData(e.target.value);
  calculate();//<----- ejecuto calculate siempre que cambio de divisa
  updateSelectedCount();
});

//Initial count and total set
updateSelectedCount();
