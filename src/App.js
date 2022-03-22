import logo from './logo.svg';
import './App.css';
import Baccarat from './lib/game.Baccarat';

let playerWins = 0
let bankerWins = 0

for (var i = 0; i < 100; i++) {
  let baccarat = new Baccarat()
  baccarat.playGames()
  let r = baccarat.getResult()
  playerWins += r.playerWins
  bankerWins += r.bankerWins
  console.log(r.playerWins, r.bankerWins)
}

console.log(playerWins, bankerWins)
// 50.68?
// 2947/(2878 + 2947): 0.5059227468
// 2974/(2796 + 2974): 0.5154246101
// 0.5181427343
// 0.5015684908
// 0.501489399

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
