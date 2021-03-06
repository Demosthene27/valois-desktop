import * as market from './index';
import http from '../http';

jest.mock('../http');

describe('API: Market', () => {
  describe('getPrices', () => {
    beforeEach(() => {
      http.mockClear();
    });

    it('should return prices data', async () => {
      const expectedResponse = { data: [{}, {}] };
      http.mockImplementation(() => Promise.resolve(expectedResponse));
      await expect(market.getPrices()).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        baseUrl: 'https://cloud.lisk.io',
        path: market.httpPaths.prices,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      http.mockImplementation(() => Promise.reject(new Error(expectedResponse.message)));
      await expect(market.getPrices()).rejects.toEqual(expectedResponse);
    });
  });

  describe('getNews', () => {
    beforeEach(() => {
      http.mockClear();
    });

    it('should return news data', async () => {
      const expectedResponse = { data: [{}, {}] };
      const params = { source: ['source1', 'source2'] };
      http.mockImplementation(() => Promise.resolve(expectedResponse));
      await expect(market.getNews({ params })).resolves.toEqual(expectedResponse);
      expect(http).toHaveBeenCalledWith({
        baseUrl: 'https://cloud.lisk.io',
        path: market.httpPaths.news,
        params,
      });
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      const params = { source: ['source1', 'source2'] };
      http.mockImplementation(() => Promise.reject(new Error(expectedResponse.message)));
      await expect(market.getNews({ params })).rejects.toEqual(expectedResponse);
    });
  });
});
