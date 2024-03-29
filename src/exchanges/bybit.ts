import { Settings } from "../utils/settings";
import { ExchangeClient } from "./exchange";
import { bybit } from 'ccxt'


export class Bybit implements ExchangeClient {
  client: bybit

  private constructor() {
    this.client = new bybit({
      apiKey: Settings.get('BYBIT_KEY'),
      secret: Settings.get('BYBIT_SECRET'),
    })
  }

  public static async create(): Promise<Bybit> {
    return new Bybit()
  }

  public name (): string {
    return 'Bybit'
  }

  public async totalAssets (): Promise<number> {
    const bybitBalance = await this.client.privateGetV5AccountWalletBalance({
      accountType: 'UNIFIED'
    })
    return parseFloat(bybitBalance.result.list[0].totalEquity)
  }
}