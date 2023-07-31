export const TOPPING = {
    ExtraExpressa: 2.20.toFixed(2),
    Cincau: 3.00.toFixed(2),
    CoffeeJelly: 1.00.toFixed(2),
    ChocolateIceCream: 2.50.toFixed(2)
}

function Discount(disc, upto, minimumPurchase) {
    this.disc = disc;
    this.upto = upto;
    this.minimumPurchase = minimumPurchase
    return {
        disc: this.disc,
        upto: this.upto,
        title: `Disc ${this.disc}% up to $${this.upto}`,
        minimumPurchase: this.minimumPurchase,
        desc: `Minimum spend $${this.minimumPurchase}`,
    }
}
export const vouchers = [new Discount(10, 5, 0), new Discount(20, 10, 15), new Discount(50, 30, 80)];