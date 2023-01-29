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
		this.unitLevel = [1, 6, 42, 294, 2058]

	}
	getWager() {

	}
}

export { MethodGoldbach }