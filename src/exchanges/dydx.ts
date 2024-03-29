import { Settings } from "../utils/settings";
import { ExchangeClient } from "./exchange";
import { bybit } from 'ccxt'


export class Dydx implements ExchangeClient {
  client: bybit

  private constructor() {
    this.client = new bybit({
      apiKey: Settings.get('BYBIT_KEY'),
      secret: Settings.get('BYBIT_SECRET'),
    })
  }

  public static async create(): Promise<Dydx> {
    return new Dydx()
  }

  public name (): string {
    return 'Bybit'
  }

  public async totalAssets (): Promise<{ totalValue: number }> {
    const bybitBalance = await this.client.privateGetV5AccountWalletBalance({
      accountType: 'UNIFIED'
    })
    return bybitBalance.result.list[0].totalEquity
  }
}