import logo from './logo.svg';
import './App.css';
import Roulette66percent from './patterns/roulette.66percent';

const NUMBER_OF_PLAYERS = 10;

for (var i = 0; i < NUMBER_OF_PLAYER; i++) {

  new Roulette66percent().play()

  //////////////////////////////////
  const player = new Player()
  csv += player.playGames().reduce((resultStr, val, j) => {
    return resultStr + `\nPlayer ${i}, ${j+1}, ${val}`
  }, '')
}

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
