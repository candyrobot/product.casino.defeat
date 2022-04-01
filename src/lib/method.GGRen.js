// INFO: GGRenだけのための拡張。本来はクラスにすべき:
Array.prototype.getIncome = function() {
	return this.reduce((p, v) => v.isWin ? p += v.betValue : p -= v.betValue, 0)
}

// INFO: 'WWLWWWLLLWLLWWW' という連結文字列へ
Array.prototype.getString = function() {
	return this.map((v) => v.isWin ? 'W' : 'L')
	.toString().replaceAll(',', '')
}

//;

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
		// INFO: expect [{ betValue, isWin },,,}]
		// isWin ではなく result: 'W' 'T' 'L' にしようかと思ったけど、'T' があると三項演算子が使えないし、'T' 使う場面がないので不採用
		this.currentScores = []
	}
	getBetValue() {
		// this._splitWith2WinningStreak().getLastSet()

		let len = this.currentScores.length
		let str = this.currentScores.getString()

		switch (str) {
			case '':
			case 'L':
			case 'W':
			case 'WL':
			case 'WW':
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

		console.warn('例外発生1', this.currentScores)
	}
	getBetPosition() {
		// this._splitWith2WinningStreak()
		// return this.
	}
	putScore(income) {
		this.amount += income
		this.amounts.push(this.amount)

		// INFO: TIE
		if (income === 0)
			return

		this.currentScores.push({
			betValue: Math.abs(income), isWin: income > 0
		})

		let len = this.currentScores.length
		let str = this.currentScores.getString()
		
		console.log(str, this.currentScores)

		if (len >= 4 && this.currentScores.getIncome() >= 3)
			return this.currentScores = []

		if (new RegExp('^WWWW$').test(str))
			return this.currentScores = []

		// INFO: 歯止め:

		// INFO: 3連勝したらreset
		if (new RegExp('^WW.+WWW$').test(str))
			return this.currentScores = []
		// INFO: 2連勝1敗2連勝したらreset
		if (new RegExp('^WW.+WWLWW$').test(str))
			return this.currentScores = []
		// ;

		switch (str) {
			case 'L':
				return this.currentScores = []
			case 'WL':
				return this.currentScores = []
		}
	}

	_getBetGoingThroughAlgorithm() {
		let lastValue = this.currentScores[this.currentScores.length - 1].betValue
		// INFO: 同じ数字をもつscoreだけfilter
		let scores = this.currentScores.filter((v) => v.betValue === lastValue)
		debugger

		// INFO: さいご2連敗: += 2
		if (new RegExp('LL$').test(scores.getString()))
			return lastValue + 2
		// 累計1勝: -= 1
		else if (this.currentScores.reduce((p, v) => v.isWin ? p++ : p--, 0) >= 1)
			return lastValue - 1
		// else: += 0
		else
			return lastValue
	}
	_splitWith2WinningStreak() {
		let arr = this._getGameHistory().toString().split('WIN,WIN,')
		return {
			getLastSet: ()=> arr[arr.length - 1].split(',')
		}
	}
	_getGameHistory() {
		return this.amounts.map((v, i) => {
			let diff = v - this.amounts[i - 1]
			if (diff == 0) return 'TIE'
			return diff > 0 ? 'WIN' : 'LOSE'
		})
	}
}

export default GGRen;