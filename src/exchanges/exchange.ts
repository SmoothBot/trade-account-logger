

export abstract class ExchangeClient {
    public abstract name (): string
    public abstract totalAssets (): Promise<number>
}