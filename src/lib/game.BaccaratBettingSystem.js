// INFO: 出目を予測しアクションを返すクラス
class Prediction {
	constructor() {
		// INFO: 次のゲームの予測
		this.forecast = 'BANKER'
		this.hits = []
		this.isStopBet = false
	}
	/**
	 * アクションコントロール:
	 * - n連敗するとルックに入る。n連勝するとルック解除。
	 */
	getAction() {
		// return 'BANKER'

		let loseStreak = this.hits.reduce((prev, v) => v === true ? 0 : ++prev , 0)
		let winStreak = this.hits.reduce((prev, v) => v === true ? ++prev : 0 , 0)

		if (loseStreak >= 3)
			this.isStopBet = true
		if (winStreak >= 3)
			this.isStopBet = false

		return this.isStopBet ? 'LOOK' : 'BANKER'
	}
	getForecast() {
		return this.forecast
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

class Baccarat {
	static payout(wager, as) {
		if (as === 'BANKER')
			return wager * .95
		if (as === 'PLAYER')
			return wager
	}
}

class Method {
	constructor() {
		this.amount = 500
		this.amountHistory = [this.amount]
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


		if (this.amount < 0) {
			alert('破産')
			console.error('破産', gameDetail, this.amountHistory)
		}
		this.amountHistory.push(this.amount)
		return this.amount
	}
	getAmountHistory() {
		return this.amountHistory
	}
	// INFO: 1回負けは1, 2回負けは2を返す（1回負けは0ではないことに注意）
	_getLoseStreakCount() {
		return this.wagerHistory.reduce((prev, v) => v === true ? 0 : ++prev , 0)
	}
}

class MethodChibisuke extends Method {
	constructor() {
		super()
		this.UNIT_INITIAL = 1
		this.unit = this.UNIT_INITIAL
		// .bet(1).on('BANKER')
	}
	/**
	 * INFO: 1ゲームごとの処理
	 */
	// getAmount(gameDetail) {
	// 	let isWin = this.betBanker(this.unit, gameDetail)
	// 	// console.log('amount:', this.amount)

	// 	// INFO: Chibisuke法
	// 	// NOTE: これでは勝っても更新できてなければunit++されるのでは？
	// 	if (isWin && Math.max(...this.amountHistory) <= this.amount)
	// 		this.unit = this.UNIT_INITIAL
	// 	else
	// 		this.unit++

	// 	return this.amount
	// }
	_getWager() {
		let isLastWon = this.wagerHistory[this.wagerHistory.length - 1]
		let lastAmount = this.amountHistory[this.amountHistory.length - 1]
		if (isLastWon) {
			if (Math.max(...this.amountHistory) <= lastAmount)
				return this.unit = this.UNIT_INITIAL
			else
				return this.unit
		}
		else
			return ++this.unit
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
class MethodGoldbach extends Method {
	constructor() {
		super()
		this.unitLevel = [1, 6, 42, 294, 2058]
		this.coefficient = 1
		this.lv = 0
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
		// this.lv = Math.floor(loseStreakCount / 3)

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
}


export { Baccarat, MethodChibisuke, MethodGoldbach, Prediction };