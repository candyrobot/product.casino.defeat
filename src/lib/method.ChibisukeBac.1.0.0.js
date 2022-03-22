import Chibisuke from './method.Chibisuke';
import Baccarat from './game.Baccarat';

class ChibisukeBac extends Chibisuke {
	constructor() {
		super()
	}
	playGames() {
		do {
			let baccarat = new Baccarat().playGames()
			this.resetDebt()
			let data = baccarat.getResults()
		} while (this.amount > 0 || this.amount < this.INITIAL_AMOUNT * 2) // ダブルアップするか破産すると止まる
	}
}

export default ChibisukeBac;