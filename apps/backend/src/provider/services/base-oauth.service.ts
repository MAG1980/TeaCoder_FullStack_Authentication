import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import type { BaseProviderOptions } from './types/base-provider.options.type'
import { UserInfo } from './types/user-info.type'
import { URLSearchParams } from 'node:url'
import { FetchService } from 'nestjs-fetch'

@Injectable()
export class BaseOauthService {
  private BASE_URL: string | undefined

  constructor(
    private readonly fetch: FetchService,
    private readonly options: BaseProviderOptions) {}

  protected extractUserInfo(data: any): Promise<UserInfo> {
    return {
      ...data,
      provider: this.options.name,
    }
  }

  getAuthUrl() {
    const query = new URLSearchParams(
      {
        response_type: 'code',
        client_id: this.options.client_id,
        redirect_uri: this.getRedirectUrl(),
        scope: (this.options.scopes ?? []).join(' '),
        access_type: 'offline',
        prompt: 'select_account',
      },
    )

    return `${this.options.authorize_url}?${query}`
  }

  async findUserByCode(code: string): Promise<UserInfo> {
    const client_id = this.options.client_id
    const client_secret = this.options.client_secret

    const tokenQuery = new URLSearchParams({
      client_id,
      client_secret,
      redirect_uri: this.getRedirectUrl(),
      grant_type: 'authorization_code',
      code,
    })

    const tokenRequest = await this.fetch.post(`${this.options.access_url}?${tokenQuery}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: tokenQuery,
    })

    const tokenResponse = await tokenRequest.json()

    if (!tokenRequest.ok) {
      throw new BadRequestException(`Failed to get a user with ${this.options.profile_url}. Check the correctness of token access`)
    }

    if (!tokenResponse?.access_token) {
      throw new BadRequestException(`There are no tokens from the ${this.options.access_url}. Make sure the authorization code is valid`)
    }

    const userRequest = await this.fetch.get(this.options.profile_url, {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    })

    if (!userRequest.ok) {
      throw new UnauthorizedException(`Failed to get a user with ${this.options.profile_url}. Check the correctness of token access`)
    }

    const user = await userRequest.json()

    const userData = await this.extractUserInfo(user)

    return {
      ...userData,
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_at: tokenResponse.expires_at || tokenResponse.expires_in,
      provider: this.options.name,
    }
  }

  getRedirectUrl() {
    return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`
  }

  set baseUrl(value: string) {
    this.BASE_URL = value
  }

  get name() {
    return this.options.name
  }

  get access_url() {
    return this.options.access_url
  }

  get profile_url() {
    return this.options.profile_url
  }

  get scopes() {
    {
      return this.options.scopes
    }
  }
}