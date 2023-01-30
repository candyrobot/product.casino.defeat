// INFO: 出目を予測しアクションを返すクラス
class Prediction {
	constructor() {
		// INFO: 次のゲームの予測
		this.forecast = 'BANKER'
		this.hits = []
	}
	/**
	 * アクションコントロール:
	 * - 3連敗するとルックに入る。1回勝つとルック解除。
	 */
	getAction() {
		return this.hits.length >= 3 &&
		this.hits[this.hits.length - 1] === false &&
		this.hits[this.hits.length - 2] === false &&
		this.hits[this.hits.length - 3] === false ?
			'LOOK' : 'BANKER'
	}
	getForecast() {
		return this.forecast
	}
}


// INFO: 実際の賭け金の変動を監視し、連敗数を保持する
class Wager {
	constructor() {
		this.wagerHistory = []
	}
	_getLoseStreakCount() {
		return this.wagerHistory.reduce((prev, v) => v === true ? 0 : prev++ , 0)
	}
}
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


class Baccarat {
	static payout(wager, as) {
		if (as === 'BANKER')
			return wager * .95
		if (as === 'PLAYER')
			return wager
	}
}

class MethodChibisuke {
	constructor() {
		this.amount = 500
		this.amountHistory = [this.amount]
		this.UNIT_INITIAL = 1
		this.unit = this.UNIT_INITIAL
		// .bet(1).on('BANKER')
	}
	/**
	 * INFO: 1ゲームごとの処理
	 */
	setGameDetail(gameDetail) {
		// if (streakDetection.isStopThisGame()) {
		// 	streakDetection.setGameResult(gameDetail.result === 'BANKER')
		// 	this.amountHistory.push(this.amount)
		// 	return
		// }

		let isWin = this.betBanker(this.unit, gameDetail)
		// console.log('amount:', this.amount)

		// streakDetection.setGameResult(isWin)

		// INFO: Chibisuke法
		if (isWin && Math.max(...this.amountHistory) <= this.amount)
			this.unit = this.UNIT_INITIAL
		else
			this.unit++

		this.amountHistory.push(this.amount)
	}
	/**
	 * @return {boolean} - true when win or tie.
	 */
	betBanker(unit, gameDetail) {
		if (gameDetail.result === 'BANKER') {
			this.amount += unit * .95
			return true
		}
		if (gameDetail.result === 'PLAYER') {
			this.amount -= unit
			return false
		}
		if (gameDetail.result === 'TIE')
			return true
	}
	/**
	 * @return {boolean} - true when win or tie.
	 */
	betPlayer(unit, gameDetail) {
		if (gameDetail.result === 'BANKER') {
			this.amount -= unit
			return false
		}
		if (gameDetail.result === 'PLAYER') {
			this.amount += unit
			return true
		}
		if (gameDetail.result === 'TIE')
			return true
	}
	getAmountHistory() {
		return this.amountHistory
	}
	/**
	 * INFO: アクションアルゴリズム - PB交互にアクションさせたい時に
	 * 例）BBPPBBPPBBPP
	 * 使い方）
		let isWin = 
			this.getActionPatternAlternatively() === 'BANKER' ?
			this.betBanker(this.unit, gameDetail) :
			this.betPlayer(this.unit, gameDetail)
	 */
	getActionPatternAlternatively() {
		return this.amountHistory.length % 4 === 0 || this.amountHistory.length % 4 === 1 ?
		'BANKER' : 'PLAYER'
	}
}


/**
 * ベッティングシステム:
 * - 負債をおったらChibisuke法をもとに1~2連の負けならリカバリーできる
 * - テレコでは+1ずつ収益がでる
 * - 3連敗以降は3の倍数以外で勝てば一気に負債0となる
 * - 3の倍数で勝つとひとつ前のunitLevelにもどる
 * 賭け方はコチラ: 1,2,3, 6,12,18, 42,84,126, 294,588,882, 2058
 */
class MethodGoldbach {
	constructor() {
		this.amount = 500
		this.amountHistory = [this.amount]
		this.unitLevel = [1, 6, 42, 294, 2058]
		this.prediction = new Prediction()

		// this.wagerHistory: boolean[] = []
		this.wagerHistory = []
	}
	getAmount(gameDetail) {
		let forecast = this.prediction.getForecast()
		let action = this.prediction.getAction()

		if (action === 'LOOK')
			console.log('action: LOOK')
		else {
			if (gameDetail.result === 'TIE');
			else if (action === gameDetail.result) {
				this.amount += Baccarat.payout(this._getWager(), action)
				this.wagerHistory.push(true)
			}
			else {
				this.amount -= this._getWager()
				this.wagerHistory.push(false)
			}	
		}

		if (gameDetail.result === 'TIE');
		else if (forecast === gameDetail.result)
			this.prediction.hits.push(true)
		else
			this.prediction.hits.push(false)

		return this.amount
	}
	// addAsWinWager() {
	// 	this.wagerHistory.push(true)
	// }
	// addAsLoseWager() {
	// 	this.wagerHistory.push(false)
	// }
	_getWager() {
		let loseStreakCount = this._getLoseStreakCount()
		
		// INFO: losestreak, coefficient(=係数)
		//       1: 2
		//       2: 3
		//       3: 1
		let coefficient = loseStreakCount % 3 + 1

		// INFO: losestreak, index
		//       0, 0
		//       1, 0
		//       2, 0
		//       3, 1
		//       4, 1
		let i = Math.floor(loseStreakCount / 3)

		return this.unitLevel[i] * coefficient
	}
	// INFO: 1回負けは1, 2回負けは2を返す（1回負けは0ではないことに注意）
	_getLoseStreakCount() {
		return this.wagerHistory.reduce((prev, v) => v === true ? 0 : ++prev , 0)
	}
}


export { Baccarat, MethodChibisuke, MethodGoldbach, Prediction };