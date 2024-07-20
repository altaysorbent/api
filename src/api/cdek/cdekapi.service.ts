import { Injectable } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';

@Injectable()
export class CDEKApiProvider {
  private readonly cdekApi: AxiosInstance;
  private expirationDate = new Date();
  private access_token = '';

  constructor() {
    this.cdekApi = axios.create({
      baseURL: process.env.CDEK_BASE_URL,
    });

    this.cdekApi.interceptors.request.use(async (config) => {
      if (config.url?.includes('/oauth/token')) {
        return config;
      }
      const token = await this.getAuthToken();
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    });
  }

  getApi(): AxiosInstance {
    return this.cdekApi;
  }

  private async getAuthToken() {
    if (this.expirationDate <= new Date() || !this.access_token) {
      const { data } = await this.cdekApi.post(
        '/oauth/token?parameters',
        {
          grant_type: 'client_credentials',
          client_id: process.env.CDEK_CLIENT_ID,
          client_secret: process.env.CDEK_CLIENT_SECRET,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      this.expirationDate = new Date();
      this.expirationDate.setSeconds(
        this.expirationDate.getSeconds() + data.expires_in,
      );
      this.access_token = data.access_token;
    }

    return this.access_token;
  }
}
