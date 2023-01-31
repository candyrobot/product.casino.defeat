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
		this.coefficient = 1
		this.lv = 0
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
	_getWager() {
		let lastCoefficient = this.coefficient
		let lastLv = this.lv
		let isLastWon = this.wagerHistory[this.wagerHistory.length - 1]
		let loseStreakCount = this._getLoseStreakCount()
		
		// INFO: losestreak, coefficient(=係数)
		//       1: 2
		//       2: 3
		//       3: 1
		this.coefficient = loseStreakCount % 3 + 1

		// INFO: losestreak, lv
		//       0, 0
		//       1, 0
		//       2, 0
		//       3, 1
		//       4, 1
		// let lv = Math.floor(loseStreakCount / 3)

		// INFO: lv, coefficient
		//
		// 1 -1    : 0, 1
		// 2 -3    : 0, 2
		// 3 -6    : 0, 3
		//
		// 6 -12   : 1, 1 -> 0
		// 12 -24  : 1, 2 -> 0
		// 18 -42  : 1, 3 -> 1つ下がる
		//
		// 42 -84  : 2, 1 -> 0
		// 84 -168 : 2, 2 -> 0
		// 126     : 2, 3 -> 1つ下がる
		//
		// xxx o: 3 -> 0
		// xxx xo: 4 -> 0
		// xxx xxo: 5 -> 1つ下がる
		// xxx xxx o: 6 -> 0
		// xxx xxx xo: 7 -> 0
		// xxx xxx xxo: 8 -> 1つ下がる
		//
		// [lv] * coe, 
		//  [0] * 1 = 1, x
		//  [0] * 2, x
		//  [0] * 3, x

		//  [1] * 1, x
		//  [1] * 2, x
		//  [1] * 3, x

		//  [2] * 1, x
		//  [2] * 2, x
		//  [2] * 3, o

		//  [1] * 1, x
		//  [1] * 2, x
		//  [1] * 3, x

		//  [2] * 1, x
		//  [2] * 2, o
		//  [0] * 1
		if (lastCoefficient === 3) {
			isLastWon ? this.lv-- : this.lv++
			this.lv = Math.max(0, this.lv) // 0未満になったら0にする
		}
		else
			this.lv = isLastWon ? 0 : this.lv


		return this.unitLevel[this.lv] * this.coefficient
	}
	// INFO: 1回負けは1, 2回負けは2を返す（1回負けは0ではないことに注意）
	_getLoseStreakCount() {
		return this.wagerHistory.reduce((prev, v) => v === true ? 0 : ++prev , 0)
	}
}


export { Baccarat, MethodChibisuke, MethodGoldbach, Prediction };