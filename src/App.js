import logo from './logo.svg';
import './App.css';
import Baccarat from './lib/game.Baccarat';
import Chibisuke from './lib/method.Chibisuke';


let totalPlayerWins = 0
let totalBankerWins = 0
let csv = 'Player,Game Number,Amount'
let todalResults = []

for (var i = 0; i < 200; i++) {
  let baccarat = new Baccarat().playGames()
  let data = baccarat.getResults()
  totalPlayerWins += data.playerWins
  totalBankerWins += data.bankerWins
  console.log(data)
  document.write(baccarat.draw(data.scoreboard))
  todalResults = todalResults.concat(data.results)
}

let chibisuke = null
csv += todalResults.reduce((prev, v, i) => {
  if (v == 'TIE') return prev;
  if (i % 1200 == 0) {
    chibisuke = new Chibisuke()
    console.log('reset')
  }
  chibisuke.setValue(v == 'PLAYER' ? -chibisuke.getBetValue() : chibisuke.getBetValue())  
  return prev + `\nPlayer ${Math.floor(i / 1200)}, ${(i % 1200) + 1}, ${chibisuke.amount}`
}, '')

console.log(csv)

// console.log(totalPlayerWins, totalBankerWins)
// 50.68?
// 2947/(2878 + 2947): 0.5059227468
// 2974/(2796 + 2974): 0.5154246101
// 0.5181427343
// 0.5015684908
// 0.501489399
// 2853 2877
// 2873 2831

/////////////////////////////////////////////////////////////////

// import Roulette66percent from './patterns/roulette.66percent';

// const NUMBER_OF_PLAYERS = 10;

// for (var i = 0; i < NUMBER_OF_PLAYER; i++) {

//   new Roulette66percent().play()

//   //////////////////////////////////
//   const player = new Player()
//   csv += player.playGames().reduce((resultStr, val, j) => {
//     return resultStr + `\nPlayer ${i}, ${j+1}, ${val}`
//   }, '')
// }

/////////////////////////////////////////////////////////////////

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
