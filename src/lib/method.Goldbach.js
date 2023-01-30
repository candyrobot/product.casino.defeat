// 現在 game.BaccaratBettingSystem.js のほうで書き加えている
//   本来は分離したいところだが難しかった

// import { Prediction, Baccarat } from './game.BaccaratBettingSystem';

// /**
//  * ベッティングシステム:
//  * - 負債をおったらChibisuke法をもとに1~2連の負けならリカバリーできる
//  * - テレコでは+1ずつ収益がでる
//  * - 3連敗以降は3の倍数以外で勝てば一気に負債0となる
//  * - 3の倍数で勝つとひとつ前のunitLevelにもどる
//  * 賭け方はコチラ: 1,2,3, 6,12,18, 42,84,126, 294,588,882, 2058
//  */
// class MethodGoldbach {
// 	constructor() {
// 		this.amount = 500
// 		this.amountHistory = [this.amount]
// 		this.unitLevel = [1, 6, 42, 294, 2058]
// 		this.prediction = new Prediction()
// 		this.baccarat = new Baccarat()
// 	}
// 	getAmount(gameDetail) {
// 		let forecast = this.prediction.getForecast()
// 		if (forecast === gameDetail.result) {
// 			this.prediction.hits.push(true)
// 			this.amount += this.baccarat.payout(this._getWager(), forecast)
// 		}
// 		else {
// 			this.prediction.hits.push(false)
// 			this.amount -= this._getWager()
// 		}
// 		return this.amount
// 	}
// 	_getWager() {
// 		return this.unitLevel[0] * 1
// 	}
// }

// export { MethodGoldbach }