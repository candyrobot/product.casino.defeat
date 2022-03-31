class GGRen {
	constructor() {
		this.INITIAL_BET_VALUE = 1
		this.betValue = this.INITIAL_BET_VALUE
		this.INITIAL_AMOUNT = 500
		this.amount = this.INITIAL_AMOUNT
		this.amounts = [] // [int]
		this.amounts.push(this.INITIAL_AMOUNT)
		this.INITIAL_SCORES = {
			a: [1,3,2,2,4,4],
			b: [1,3,2,4,2,4,4]
		}
		this.currentScores = [] // [{ betValue, result },,,}]
		this.currentScores.getIncome = function() {}
		// INFO: 'WWLWWWLLLWLLWWW' という形へ
		this.currentScores.getString = function() {
			return this.map((v) => v.result)
			.filter((v) => v != 'TIE')
			.map((v) => {
				if (v === 'WIN') return 'W'
				if (v === 'LOSE') return 'L'
			}).toString().replaceAll(',', '')
		}
	}
	// TODO: WをつかうのかWINから変換するんか
	getBetValue() {
		if (this.currentScores.getIncome() >= 3)
			return this._reset().betValue

		let len = this.currentScores.length
		let str = this.currentScores.getString()

		if (new RegExp('^WWWW$').test(str))
			return this._reset().betValue

		// INFO: 歯止め:

		// INFO: 3連勝したらreset
		if (new RegExp('^WW.+WWW$').test(str))
			return this._reset().betValue
		// INFO: 2連勝1敗2連勝したらreset
		if (new RegExp('^WW.+WWLWW$').test(str))
			return this._reset().betValue
		// ;

		switch (str) {
			case: 'L'
				return this._reset().betValue
			case: 'W'
				return this.INITIAL_SCORES.a[len]
			case: 'WL'
				return this._reset().betValue
			case: 'WW'
				return this.INITIAL_SCORES.a[len]
		}
		// 以降、正規表現で"最初がWWLならa"と書くことができる
		// さらに、INITIAL_SCORESの要素が undefined になったらアルゴリズムを発動すると書ける
		if (new RegExp('^WWL').test(str)) {
			return this.INITIAL_SCORES.a[len] || this._getBetGoingThroughAlgorithm()
		}
		if (new RegExp('^WWW').test(str)) {
			return this.INITIAL_SCORES.b[len] || this._getBetGoingThroughAlgorithm()
		}

		console.warn('例外発生', this.currentScores)
	}
	getBetPosition() {
		// this._splitWith2WinningStreak()
		// return this.
	}
	setValue(value) {
		this.amount += value
		this.amounts.push(this.amount)
	}


	_getBetGoingThroughAlgorithm() {
		let lastValue = this.currentScores[this.currentScores - 1].betValue
		// INFO: 同じ数字をもつscoreだけfilter
		let scores = this.currentScores.filter((v) => v.betValue === lastValue)
		// INFO: さいご2連敗: += 2
		if (new RegExp('LL$').test(scores.getString()))
			return lastValue + 2
		// 累計1勝: -= 1
		else if (this.currentScores.reduce((p, v) => v.result, 0) >= 1)
			return lastValue - 1
		// else: += 0
		else
			return lastValue
	}
	_reset() {
		this.currentScores = [{
			betValue: this.INITIAL_SCORES.a[0]
		}]
		return this.currentScores[0]
	}
	_splitWith2WinningStreak() {
		let arr = this._getGameHistory().toString().split('WIN,WIN,')
		return {
			getLastSet: ()=> arr[arr.length - 1].split(',')
		}
	}
	_isUnusualBet() {
		let arr = this._getGameHistory()
		return arr[arr.length - 1] == 'WIN' && arr[arr.length - 2] == 'LOSE' && arr[arr.length - 3] == 'LOSE'
	}
	_getGameHistory() {
		return this.amounts.map((v, i) => {
			let diff = v - this.amounts[i - 1]
			if (diff == 0) return 'TIE'
			return diff > 0 ? 'WIN' : 'LOSE'
		})
	}
}

export default GG;