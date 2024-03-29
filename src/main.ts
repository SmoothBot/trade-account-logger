
import * as ccxt from 'ccxt'
import 'dotenv/config'
import { Gate } from './exchanges/gate'
import { Bybit } from './exchanges/bybit'
import { Logger } from './logger'



const main = async () => {
  const gate = await Gate.create()
  const bybit = await Bybit.create()
  const gateBal = await gate.totalAssets()
  const bybitBal = await bybit.totalAssets()


  const logger = new Logger([gate, bybit])
  await logger.start()


  // console.log('Gate:  ', gateBal)
  // console.log('Bybit: ', bybitBal)
  // console.log(gateBal + bybitBal)

}

main()