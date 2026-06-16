import { TUError } from '../error'
import { WorkOrder } from './workorder'
import { Inspection } from './inspection'
import { ServiceRequest } from './service_request'
import { Asset } from './asset'
import { Employee } from './employee'
import { Cost } from './cost'

import _ from 'lodash'
import axios from 'axios'

interface TrimbleUnityMaintainSettings {
  path: string
  secure: boolean
  version: number
  default_domain?: string
}

interface TrimbleUnityMaintainConfig {
  path?: string
  secure?: boolean
  version?: number
  default_domain?: string
}

/**
 * Core class TrimbleUnityMaintain — wraps the Trimble Unity Maintain (formerly Cityworks) API.
 *
 * Unity Maintain uses the Cityworks REST API conventions:
 *  - All requests POST to `/{path}/services/{ServicePath}`
 *  - Authentication via `General/Authentication/CityworksOnlineAuthenticate`
 *  - Token passed in `Authorization: cityworks {token}` header (v23+)
 *
 * Usage:
 * ```ts
 * import { maintain } from 'trimble-unity'
 * maintain.TrimbleUnityMaintain.configure('your-org.maintain.trimble.com', { path: 'cityworks', version: 23 })
 * await maintain.TrimbleUnityMaintain.authenticate('mylogin', 'mypassword')
 * const wos = await maintain.workorder.search({ Status: 'Open' })
 * ```
 */
class TrimbleUnityMaintain {
  /**
   * The hostname of the Unity Maintain / Cityworks install.
   * Defaults to 'cityworksonline' for Cityworks Online (SaaS).
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
   * Stores the login password
   */
  private password?: string
  /**
   * Stores settings for path, secure, and API version
   */
  private settings: TrimbleUnityMaintainSettings

  /**
   * Constructor for a new TrimbleUnityMaintain instance
   *
   * @param {string} [base_url] - The hostname of your Unity Maintain / Cityworks instance
   * @param {object} [settings] - Settings: { path, secure, version, default_domain }
   *   path defaults to 'cityworks', secure defaults to true, version defaults to 23
   */
  constructor(base_url?: string, settings?: TrimbleUnityMaintainConfig) {
    this.base_url = 'cityworksonline'
    this.settings = {
      path: 'cityworks',
      secure: true,
      version: 23
    }
    if (typeof (base_url) !== 'undefined') {
      this.configure(base_url, settings)
    }
  }

  /**
   * Configure the Unity Maintain instance connection settings
   *
   * @param {string} [base_url] - Hostname of the Cityworks/Maintain server
   * @param {object} [settings] - Settings object
   * @return {boolean} Returns true if successful
   */
  configure(base_url?: string, settings?: TrimbleUnityMaintainConfig) {
    if (typeof base_url !== 'undefined') {
      this.base_url = base_url
    } else {
      this.base_url = 'cityworksonline'
    }
    this.settings = {
      path: 'cityworks',
      secure: true,
      version: 23
    }
    if (typeof (settings) !== 'undefined') {
      _.forEach(settings, (v, k) => {
        if (typeof ((this.settings as any)[k]) !== 'undefined') {
          (this.settings as any)[k] = v
        }
      })
    }
    return true
  }

  /**
   * Build the full service URL for a given Cityworks service path
   *
   * @param {string} service_path - The Cityworks service path (e.g., 'AMS/WorkOrder/Search')
   * @return {string} The full URL
   */
  private buildUrl(service_path: string): string {
    const protocol = this.settings.secure ? 'https' : 'http'
    return `${protocol}://${this.base_url}/${this.settings.path}/services/${service_path}`
  }

  /**
   * Send a request to the Trimble Unity Maintain / Cityworks REST API.
   *
   * If one ever needs to access or call an unimplemented service endpoint, one can call
   * this method directly:
   *
   * `tu.runRequest(service_path, post_data)`
   *
   * @param {string} service_path - The Cityworks service path (e.g., 'AMS/WorkOrder/Search')
   * @param {any} [post_data] - The data object to be sent to the API
   * @return {Object} Returns Promise object that represents the JSON object returned from the API
   */
  runRequest(service_path: string, post_data?: any) {
    return new Promise((resolve, reject) => {
      const url = this.buildUrl(service_path)
      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      const payload: any = {}

      if (typeof (post_data) !== 'undefined') {
        payload.data = JSON.stringify(post_data)
      }

      // Version 23+ uses Authorization header instead of token query param
      if (this.settings.version >= 23 && typeof (this.Token) !== 'undefined' && this.Token !== '') {
        headers['Authorization'] = 'cityworks ' + this.Token
      } else if (typeof (this.Token) !== 'undefined' && this.Token !== '') {
        // Pre-v23: pass token in post data
        payload.token = this.Token
      }

      const formBody = Object.keys(payload)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(payload[k]))
        .join('&')

      axios.post(url, formBody, {
        headers,
        timeout: 30000
      }).then((response) => {
        const obj = response.data
        if (typeof (obj) === 'undefined') {
          reject(new TUError(10, 'No response received from Trimble Unity Maintain API.'))
        } else if (typeof (obj.Status) !== 'undefined') {
          switch (obj.Status) {
            case 1:
              reject(new TUError(1, obj.Message || 'API error.', obj))
              break
            case 2:
              reject(new TUError(2, 'Unauthorized.', obj))
              break
            case 3:
              reject(new TUError(3, 'Invalid credentials.', obj))
              break
            case 0:
            default:
              if (typeof (obj.Value) === 'undefined' && obj.Status === 0) {
                resolve(true)
              } else {
                resolve(obj)
              }
              break
          }
        } else {
          resolve(obj)
        }
      }).catch((error) => {
        if (error.response) {
          const status = error.response.status
          const data = error.response.data
          if (status === 401) {
            reject(new TUError(2, 'Unauthorized. Please authenticate first.', data))
          } else if (status === 403) {
            reject(new TUError(3, 'Forbidden. Insufficient permissions.', data))
          } else {
            reject(new TUError(6, `API error: ${status}`, data))
          }
        } else if (error.request) {
          reject(new TUError(7, 'No response received from Trimble Unity Maintain API.', { url, error: error.message }))
        } else {
          reject(new TUError(8, 'Request setup error.', { error: error.message }))
        }
      })
    })
  }

  /**
   * Authenticate with the Trimble Unity Maintain / Cityworks API.
   * Stores the token internally for use in subsequent requests.
   *
   * Uses Cityworks Online / Unity Maintain SaaS authentication.
   *
   * @param {string} login - User's login name
   * @param {string} password - User's password
   * @return {Object} Returns Promise that resolves to true on success
   */
  authenticate(login: string, password: string) {
    return new Promise((resolve, reject) => {
      this.login = login
      this.password = password

      const service_path = 'General/Authentication/CityworksOnlineAuthenticate'

      const data = { LoginName: login, Password: password }

      this.runRequest(service_path, data).then((response: any) => {
        if (response === true) {
          reject(new TUError(100, 'Authentication failed. No token in response.'))
        } else if (typeof (response.Value) !== 'undefined' && typeof (response.Value.Token) !== 'undefined') {
          this.Token = response.Value.Token
          resolve(true)
        } else if (response.Status && response.Status > 0) {
          reject(new TUError(101, response.Message || 'Authentication failed.', response))
        } else {
          reject(new TUError(100, 'Authentication failed. Unexpected response.', response))
        }
      }).catch((err) => {
        reject(err)
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
   * Get the currently configured base URL/hostname
   *
   * @return {string} Returns the configured base URL
   */
  getBaseUrl(): string {
    return this.base_url
  }
}

const tu_maintain = new TrimbleUnityMaintain()

const workorder = new WorkOrder(tu_maintain)
const inspection = new Inspection(tu_maintain)
const service_request = new ServiceRequest(tu_maintain)
const asset = new Asset(tu_maintain)
const employee = new Employee(tu_maintain)
const cost = new Cost(tu_maintain)

export {
  TrimbleUnityMaintain,
  tu_maintain,
  workorder,
  inspection,
  service_request,
  asset,
  employee,
  cost
}
