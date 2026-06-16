import { TUError } from './error'
import { Project } from './project'
import { Budget } from './budget'
import { Commitment } from './commitment'
import { Invoice } from './invoice'
import { Company } from './company'
import { Contact } from './contact'
import { Document } from './document'
import { FundingSource } from './funding_source'
import { Process } from './process'

import _ from 'lodash'
import axios from 'axios'

interface TrimbleUnitySettings {
  path: string
  secure: boolean
  version: number
}

interface TrimbleUnityConfig {
  path?: string
  secure?: boolean
  version?: number
}

/**
 * Core class TrimbleUnity with authentication and API capabilities
 *
 * Follows the same pattern as the Cityworks npm API wrapper.
 * API documentation: https://developer.trimble.com/docs/unity-construct
 */
class TrimbleUnity {
  /**
   * The domain of the Trimble Unity install. Defaults to api2.e-builder.net
   */
  private base_url: string
  /**
   * Stores the currently in use authentication token
   */
  private Token?: string
  /**
   * Stores the login username
   */
  private login?: string
  /**
   * Holds the login password
   */
  private password?: string
  /**
   * Stores settings including path, secure (defaults to true), version (defaults to 2)
   */
  private settings: TrimbleUnitySettings

  /**
   * Constructor for a new TrimbleUnity instance, allows one to optionally configure
   * the domain and other settings right from the get-go
   *
   * @param {string} [base_url] - The base URL of your Trimble Unity instance (e.g., 'api2.e-builder.net')
   * @param {object} [settings] - The settings for your Trimble Unity site.
   *   Full list: { path: defaults to '', secure: defaults to true, version: defaults to 2 }
   */
  constructor(base_url?: string, settings?: TrimbleUnityConfig) {
    this.base_url = 'api2.e-builder.net'
    this.settings = {
      path: '',
      secure: true,
      version: 2
    }
    if (typeof (base_url) !== 'undefined') {
      this.configure(base_url, settings)
    }
  }

  /**
   * Configure a TrimbleUnity instance's domain and other settings
   *
   * @param {string} [base_url] - The base URL of your Trimble Unity instance
   * @param {object} [settings] - The settings for your Trimble Unity site.
   *   Full list: { path: defaults to '', secure: defaults to true, version: defaults to 2 }
   * @return {boolean} Returns true if successful
   */
  configure(base_url?: string, settings?: TrimbleUnityConfig) {
    if (typeof base_url !== 'undefined') {
      this.base_url = base_url
    } else {
      this.base_url = 'api2.e-builder.net'
    }
    this.settings = {
      path: '',
      secure: true,
      version: 2
    }
    if (typeof (settings) !== 'undefined') {
      _.forEach(settings, (v, k) => {
        if (typeof (this.settings[k]) !== 'undefined') {
          this.settings[k] = v
        }
      })
    }
    return true
  }

  /**
   * Build the full API URL for a given endpoint path
   *
   * @param {string} endpoint - The API endpoint path (e.g., 'Projects', 'Budgets/Query')
   * @return {string} The full URL
   */
  private buildUrl(endpoint: string): string {
    const protocol = this.settings.secure ? 'https' : 'http'
    const pathPrefix = this.settings.path ? `/${this.settings.path}` : ''
    return `${protocol}://${this.base_url}${pathPrefix}/api/v${this.settings.version}/${endpoint}`
  }

  /**
   * Send a request to the Trimble Unity Construct API
   *
   * If one ever needs to access or call an unimplemented API endpoint, one can call
   * this method directly with the endpoint path, method, and data payload:
   *
   * `tu.runRequest(endpoint_path, method, post_data, query_params)`
   *
   * @param {string} endpoint - The path to the particular endpoint (e.g., 'Projects', 'Budgets/{id}')
   * @param {string} [method] - HTTP method: 'GET' or 'POST' (defaults to 'GET')
   * @param {any} [post_data] - The JSON data object to be sent in the request body (for POST)
   * @param {Object} [query_params] - Query string parameters for GET requests
   * @return {Object} Returns Promise object that represents the JSON object returned from the API
   */
  runRequest(endpoint: string, method: string = 'GET', post_data?: any, query_params?: Object) {
    return new Promise((resolve, reject) => {
      const url = this.buildUrl(endpoint)
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }

      if (typeof (this.Token) !== 'undefined' && this.Token !== '') {
        headers['Authorization'] = 'Bearer ' + this.Token
      }

      const config: any = {
        method: method.toLowerCase(),
        url,
        headers,
        timeout: 30000
      }

      if (method.toUpperCase() === 'GET' && query_params && !_.isEmpty(query_params)) {
        config.params = query_params
      }

      if (method.toUpperCase() === 'POST' && typeof (post_data) !== 'undefined') {
        config.data = post_data
      }

      axios(config).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        if (error.response) {
          const status = error.response.status
          const data = error.response.data

          if (status === 401) {
            reject(new TUError(2, 'Unauthorized. Please authenticate first.', data))
          } else if (status === 403) {
            reject(new TUError(3, 'Forbidden. Insufficient permissions.', data))
          } else if (status === 404) {
            reject(new TUError(4, 'Resource not found.', data))
          } else if (status === 400) {
            reject(new TUError(5, 'Bad request.', data))
          } else {
            reject(new TUError(6, `API error: ${status}`, data))
          }
        } else if (error.request) {
          reject(new TUError(7, 'No response received from Trimble Unity API.', { url, error: error.message }))
        } else {
          reject(new TUError(8, 'Request setup error.', { error: error.message }))
        }
      })
    })
  }

  /**
   * Authenticate with the Trimble Unity Construct API and store an access token for use.
   * Stores the token internally for use in subsequent requests.
   *
   * @param {string} login - User's login name (email address)
   * @param {string} password - User's password
   * @return {Object} Returns Promise object that represents a boolean (true on success)
   */
  authenticate(login: string, password: string) {
    return new Promise((resolve, reject) => {
      this.login = login
      this.password = password

      const url = this.buildUrl('Authenticate')
      const data = {
        userName: login,
        password: password
      }

      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      }).then((response) => {
        const responseData = response.data
        if (typeof (responseData) !== 'undefined' && typeof (responseData.access_token) !== 'undefined') {
          this.Token = responseData.access_token
          resolve(true)
        } else if (typeof (responseData) !== 'undefined' && typeof (responseData.token) !== 'undefined') {
          this.Token = responseData.token
          resolve(true)
        } else {
          reject(new TUError(100, 'Authentication failed. No token received in response.', responseData))
        }
      }).catch((error) => {
        if (error.response) {
          const status = error.response.status
          const data = error.response.data
          if (status === 401 || status === 400) {
            reject(new TUError(101, 'Invalid Credentials', data))
          } else {
            reject(new TUError(102, `Authentication error: ${status}`, data))
          }
        } else {
          reject(new TUError(103, 'Unable to connect to Trimble Unity API.', { error: error.message }))
        }
      })
    })
  }

  /**
   * Get the currently stored authentication token
   *
   * @return {string|undefined} Returns the current token or undefined if not set
   */
  getToken(): string | undefined {
    return this.Token
  }

  /**
   * Set the authentication token directly (e.g., from a stored session)
   *
   * @param {string} token - The authentication token to set
   * @return {boolean} Returns true
   */
  setToken(token: string): boolean {
    this.Token = token
    return true
  }

  /**
   * Get the currently configured API version
   *
   * @return {number} Returns the configured API version number
   */
  v(): number {
    return this.settings.version
  }

  /**
   * Get the currently configured base URL
   *
   * @return {string} Returns the configured base URL
   */
  getBaseUrl(): string {
    return this.base_url
  }
}

const tu = new TrimbleUnity()

const project = new Project(tu)
const budget = new Budget(tu)
const commitment = new Commitment(tu)
const invoice = new Invoice(tu)
const company = new Company(tu)
const contact = new Contact(tu)
const document = new Document(tu)
const funding_source = new FundingSource(tu)
const process = new Process(tu)

export {
  tu as TrimbleUnity,
  project,
  budget,
  commitment,
  invoice,
  company,
  contact,
  document,
  funding_source,
  process
}
