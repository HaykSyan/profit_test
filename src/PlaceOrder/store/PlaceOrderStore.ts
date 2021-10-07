import { observable, computed, action } from "mobx";

import { OrderSide } from "../model";

export class PlaceOrderStore {
  @observable activeOrderSide: OrderSide = "buy";
  @observable price: number = 0;
  @observable amount: number = 0;
  @observable projected_profit: number = 0;

  @observable profit = [
    {profit: 2, target_price: 0, amount_to_by: 100}
  ];

  @computed get total(): number {
    return this.price * this.amount;
  }

  @action.bound
  public setOrderSide(side: OrderSide) {
    this.activeOrderSide = side;
  }

  @action.bound
  public setPrice(price: number) {
    this.price = price;
  }

  @action.bound
  public setAmount(amount: number) {
    this.amount = amount;
  }

  @action.bound
  public setTotal(total: number) {
    this.amount = this.price > 0 ? total / this.price : 0;
  }

  @action.bound
  public setProfitRow() {
    if(this.profit.length >= 5) return;
    let new_profit = (this.profit[this.profit.length - 1]?.profit || 0) + 2;
    this.profit.push({
      profit: new_profit, 
      target_price: this.price + this.price * new_profit, 
      amount_to_by: 20,
    });

    this.sumProfits();
  }

  @action.bound
  public removeProfitRow(index: number) {
    let filteredProfits = this.profit.filter((p, i) => i !== index);
    this.profit = filteredProfits;

    this.sumProfits();
  }

  @action.bound
  public handleProfitItems(index: number, value: any) {
    this.profit[index] = {...this.profit[index], ...value};
  }

  @action.bound
  public sumProfits() {
    const sumall = this.profit.map(item => item.amount_to_by).reduce((prev, curr) => prev + curr, 0);
    if (sumall > 100) {
      const index = this.profit.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
      this.profit[index] = {...this.profit[index], amount_to_by: this.profit[index].amount_to_by - 20 }
    }

    const sum_target_price = this.profit.map(item => item.target_price).reduce((prev, curr) => prev + curr, 0);
    this.projected_profit = this.activeOrderSide === 'buy' 
    ? this.amount * (sum_target_price - this.price) 
    : this.amount * (this.price - sum_target_price);
  }
}
