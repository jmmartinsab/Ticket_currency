const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
const currencyEl = document.getElementById('currency');

/*Estoy teniendo problemas, porque aunque se lo que quiero hacer, cuando consigo algunas cosas no se como ensamblarlas correctamente para generar
el resultado que quiero, es como que se que es lo que se necesita pero no como montarlo. Otro problema es que algunas de las cosas que intento
no me dan el resultado esperado, a ver si me puedes ayudar a entender el problema en global para poder dar con la solución*/

/* Pruebas con la consola
console.log(currencyEl.options[48].value);
console.log(currencyEl.selectedIndex);
console.log(currentIndex);*/
let currentIndex = currencyEl.selectedIndex;
let selectedCurrency = currencyEl.options[currentIndex].value;

populateUI();

let ticketPrice = +movieSelect.value;
console.log(ticketPrice);

//Fetch exchange rate
function calculate() {
  //no consigo obtener el rate para usarlo en la conversión
  const currencyBase = currencyEl.options[48].value;
  const selected = selectedCurrency;

  fetch(`https://api.exchangerate-api.com/v4/latest/${currencyBase}`)
    .then((res) => res.json())
    .then((data) => {
      const rate = data.rates[selected];
      console.log(rate);

      moviePrice.value = (moviePrice.value * rate).toFixed(2);
    });
}

movieSelect.querySelectorAll('.mov-curr').forEach((option) => {
  //no consigo hacer aparecer el nombre de la pelicula con el precio
  option.innerText = `${ticketPrice}`;
});

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

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
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

//event current
currencyEl.addEventListener('change', (e) => {
  //añadido para actualizar el valor de la divisa a elegir
  selectedCurrency = +e.target.value;
  setCurrencyData(e.target.value);
});

//Initial count and total set
updateSelectedCount();
