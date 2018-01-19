
const explorerApi = {
  getCurrencyGrapData: () => {
    const { candles } = explorerApi.getCandles();
    return candles.slice(Math.max(candles.length - 8, 1)).map(c => ({
      x: new Date(c.date),
      y: c.high,
    }));
  },
  getCandles: () => ({
    success: true,
    timeframe: 'hour',
    exchange: 'poloniex',
    candles: [
      {
        timestamp: 1507730400,
        date: '2017-10-11T14:00:00.000Z',
        high: '0.00111575',
        low: '0.00111575',
        open: '0.00111575',
        close: '0.00111575',
        liskVolume: '134.43810319',
        btcVolume: '0.14999931',
        firstTrade: 3712272,
        lastTrade: 3712276,
        nextEnd: 1507726741,
        numTrades: 5,
      },
      {
        timestamp: 1507734000,
        date: '2017-10-11T15:00:00.000Z',
        high: '0.00111576',
        low: '0.00111575',
        open: '0.00111575',
        close: '0.00111576',
        liskVolume: '44.81250493',
        btcVolume: '0.05000000',
        firstTrade: 3712426,
        lastTrade: 3712427,
        nextEnd: 1507730344,
        numTrades: 2,
      },
      {
        timestamp: 1507737600,
        date: '2017-10-11T16:00:00.000Z',
        high: '0.00111576',
        low: '0.00110717',
        open: '0.00110722',
        close: '0.00110760',
        liskVolume: '10093.97261341',
        btcVolume: '11.24334096',
        firstTrade: 3712436,
        lastTrade: 3712637,
        nextEnd: 1507730753,
        numTrades: 202,
      },
      {
        timestamp: 1507741200,
        date: '2017-10-11T17:00:00.000Z',
        high: '0.00111309',
        low: '0.00109635',
        open: '0.00110760',
        close: '0.00110779',
        liskVolume: '3900.47675655',
        btcVolume: '4.31365029',
        firstTrade: 3712638,
        lastTrade: 3712738,
        nextEnd: 1507734311,
        numTrades: 101,
      },
      {
        timestamp: 1507744800,
        date: '2017-10-11T18:00:00.000Z',
        high: '0.00111569',
        low: '0.00111250',
        open: '0.00111569',
        close: '0.00111250',
        liskVolume: '178.00000000',
        btcVolume: '0.19853540',
        firstTrade: 3712832,
        lastTrade: 3712834,
        nextEnd: 1507740994,
        numTrades: 3,
      },
      {
        timestamp: 1507744800,
        date: '2017-10-11T19:00:00.000Z',
        high: '0.00111569',
        low: '0.00111250',
        open: '0.00111569',
        close: '0.00111250',
        liskVolume: '178.00000000',
        btcVolume: '0.19853540',
        firstTrade: 3712832,
        lastTrade: 3712834,
        nextEnd: 1507740994,
        numTrades: 3,
      },
      {
        timestamp: 1507752000,
        date: '2017-10-11T20:00:00.000Z',
        high: '0.00109136',
        low: '0.00109136',
        open: '0.00109136',
        close: '0.00109136',
        liskVolume: '1.56828848',
        btcVolume: '0.00171157',
        firstTrade: 3713066,
        lastTrade: 3713070,
        nextEnd: 1507748359,
        numTrades: 5,
      },
      {
        timestamp: 1507755600,
        date: '2017-10-11T21:00:00.000Z',
        high: '0.00109969',
        low: '0.00109132',
        open: '0.00109132',
        close: '0.00109969',
        liskVolume: '757.10417768',
        btcVolume: '0.83095871',
        firstTrade: 3713228,
        lastTrade: 3713244,
        nextEnd: 1507751601,
        numTrades: 17,
      },
      {
        timestamp: 1507759200,
        date: '2017-10-11T22:00:00.000Z',
        high: '0.00110760',
        low: '0.00109049',
        open: '0.00110474',
        close: '0.00110491',
        liskVolume: '6821.98011737',
        btcVolume: '7.48320968',
        firstTrade: 3713266,
        lastTrade: 3713437,
        nextEnd: 1507752951,
        numTrades: 172,
      },
      {
        timestamp: 1507762800,
        date: '2017-10-11T23:00:00.000Z',
        high: '0.00111014',
        low: '0.00109060',
        open: '0.00110491',
        close: '0.00111014',
        liskVolume: '5707.01086187',
        btcVolume: '6.29001318',
        firstTrade: 3713438,
        lastTrade: 3713623,
        nextEnd: 1507755653,
        numTrades: 186,
      },
      {
        timestamp: 1507766400,
        date: '2017-10-12T00:00:00.000Z',
        high: '0.00111198',
        low: '0.00110541',
        open: '0.00110687',
        close: '0.00110544',
        liskVolume: '2258.03831850',
        btcVolume: '2.49682506',
        firstTrade: 3713694,
        lastTrade: 3713735,
        nextEnd: 1507761326,
        numTrades: 42,
      },
      {
        timestamp: 1507770000,
        date: '2017-10-12T01:00:00.000Z',
        high: '0.00111389',
        low: '0.00110541',
        open: '0.00110544',
        close: '0.00110541',
        liskVolume: '7603.76421537',
        btcVolume: '8.41977552',
        firstTrade: 3713736,
        lastTrade: 3713803,
        nextEnd: 1507762862,
        numTrades: 68,
      },
      {
        timestamp: 1507773600,
        date: '2017-10-12T02:00:00.000Z',
        high: '0.00111351',
        low: '0.00110541',
        open: '0.00111348',
        close: '0.00110541',
        liskVolume: '1241.35131498',
        btcVolume: '1.37491329',
        firstTrade: 3713876,
        lastTrade: 3713897,
        nextEnd: 1507769522,
        numTrades: 22,
      },
    ],
  }),
};

export default explorerApi;
