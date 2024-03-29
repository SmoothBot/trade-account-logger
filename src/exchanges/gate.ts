import { Settings } from "../utils/settings";
import { ExchangeClient } from "./exchange";
import { gate } from 'ccxt'


export class Gate implements ExchangeClient {
  client: gate

  private constructor() {
    this.client = new gate({
      apiKey: Settings.get('GATE_IO_KEY'),
      secret: Settings.get('GATE_IO_SECRET'),
    })
  }

  public static async create(): Promise<Gate> {
    return new Gate()
  }

  public name (): string {
    return 'Gate'
  }

  public async totalAssets (): Promise<number> {
    const gateBalance = await this.client.privateWalletGetTotalBalance()
    return parseFloat(gateBalance.total.amount)
  }
}