// 良い名前ダナー
let streakDetection = {
	loseCount: 0,
	setGameResult: function(isWin) {
		// isWin ? (this.loseCount = 0) : this.loseCount++
		if (isWin) {
			this.loseCount <= 0 ? (this.loseCount = 0) : this.loseCount--
		}
		else
			this.loseCount++
	},
	isStopThisGame: function() {
		return this.loseCount >= 3 ? true : false
	}
}


// INFO: 実際の賭け金の変動を監視し、増減回数を保持する
// - betしている && hitしている: true
// - betしている && hitしていない: false
class Wager {
	constructor() {
		// this.wagerHistory: boolean[] = []
		this.wagerHistory = []
	}
	// addAsWinWager() {
	// 	this.wagerHistory.push(true)
	// }
	// addAsLoseWager() {
	// 	this.wagerHistory.push(false)
	// }
}




class Chibisuke {
	constructor() {
		// 資金管理をするのだからこの情報はあって当たり前:
		this.INITIAL_BET_VALUE = 1
		this.INITIAL_AMOUNT = 500
		this.betValue = this.INITIAL_BET_VALUE
		this.amount = this.INITIAL_AMOUNT
		this.amounts = [] // [int]
		this.amounts.push(this.INITIAL_AMOUNT)
		// ;
		this.debt = 0
		this.results = [] // [int]
	}
	playGames(doSomething = () => {}) {
		do {
			doSomething()
		} while (this.amount > 0 || this.amount < this.INITIAL_AMOUNT * 2) // ダブルアップするか破産すると止まる
	}
	getBetValue() {
		return this.betValue
	}
	getAmounts() {
		return this.amounts
	}
	getResults() {
		return this.results
	}
	resetDebt() {
		this.debt = 0
		this.betValue = this.INITIAL_BET_VALUE
	}
	// TODO: doWhenSettled 決着がついた時
	setValue(value) {
		this.amount += value
		this.amounts.push(this.amount)
		this.debt += value
		if (this.debt < 0) {
		}
		else {
			this.resetDebt()
		}
		if (value < 0) {
			this.betValue += this.INITIAL_BET_VALUE
		}
		this.results.push({ value, debt: this.debt })
	}
}

export default Chibisuke;