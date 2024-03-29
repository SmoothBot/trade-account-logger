import { Exchange } from "ccxt";
import { ExchangeClient } from "./exchanges/exchange";
import { Account } from "./data/models/account";
import { Summary } from "./data/models/summary";


const fetchAssets = async (client: ExchangeClient) => {
  return {
    name: client.name(),
    assets: await client.totalAssets()
  }
}

export class Logger {
  clients: ExchangeClient[]

  constructor(clients: ExchangeClient[]) {
    this.clients = clients
  }

  public async start () {
    await this.log()
    setInterval(this.log.bind(this), 10000)
  }

  public async log () {
    const now = new Date()
    const points = (await Promise.all(this.clients.map(fetchAssets)))
      .map(assets => ({
        tags: {
          exchange: assets.name
        },
        fields: {
          assets: assets.assets
        },
        timestamp: now
      }))
    const sum = points.reduce((acc, curr) => acc + curr.fields.assets, 0)

    Account.writePoints(points)
    Summary.writePoint({
      tags: {},
      fields: {
        total_assets: sum
      },
      timestamp: now
    })
    // console.log(data)
    console.log('Total: ', sum)
  }
}