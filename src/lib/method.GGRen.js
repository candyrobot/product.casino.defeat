class GGRen {
	constructor() {
		this.INITIAL_BET_VALUE = 1
		this.betValue = this.INITIAL_BET_VALUE
		this.INITIAL_AMOUNT = 500
		this.amount = this.INITIAL_AMOUNT
		this.amounts = [] // [int]
		this.amounts.push(this.INITIAL_AMOUNT)
		this.INITIAL_SCORES = [1,3,2,4]
		// this.scores = this.INITIAL_SCORES
		this.currentSet = [] // [1,3,2,4,4...]
		this.currentSet.getDebt = function() {}
		this.currentSet.getHeighestValue = function() {
			return this.reduce((prev, v) => prev > v ? prev : v, 0)
		}
	}
	getBetPosition() {
		// this._splitWith2WinningStreak()
		// return this.
	}
	getBetValue() {
		if debt >= 3
			new
		''
			this.INITIAL_SCORES[0]
		'W'
			this.INITIAL_SCORES[1]
		'WW'
			this.INITIAL_SCORES[3]
		'WWW'
			this.INITIAL_SCORES[4]
		'WWWW'
			new
		('WWL...'(5) || 'WWWL...'(6) ) && (新高値で2連敗 or 累計2回負け)
			+= 2
		('WWL...'(5) || 'WWWL...'(6) ) && (新高値で累計1勝 or 初めに勝ち)
			-= 1

		'WL'
			new
		'WWLW'
			new
			これ以外にない。
		'WWLL'
			4 // [1,3,2,2,4]基礎譜面WW版続行
		'WWLLW'
			new
			これ以外にない。
		'WWLLL'
			4 // 正確には+= 0。 上記の'WWL...'(5)に当てはまるが、後半に当てはまらないので 4 += 0
		'WWWL'
			2 // [1,3,2,4,2,4]基礎譜面WWW版続行
		'WW(W)L...WWW'
			new
		'WW(W)L...WWLWW'
			new
		// "新高値で2敗すれば次は+=2, 新高値で累積1勝すれば次は-=1"
		// "新高値" ではなく "同額"
		// return this.INITIAL_SCORES[0]
	}
	setValue(value) {
		this.amount += value
		this.amounts.push(this.amount)
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