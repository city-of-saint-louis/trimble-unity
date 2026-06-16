import { TUError } from './error'
import _ from 'lodash'

/**
 * FundingSource module for Trimble Unity Construct
 *
 * Provides methods to interact with the AccountFundingSources API endpoint.
 */
export class FundingSource {
  /**
   * @hidden
   */
  tu: any

  /**
   * @hidden
   */
  constructor(tu) {
    this.tu = tu
  }

  /**
   * Get all funding sources accessible to the authenticated user
   *
   * @param {Object} [params] - Optional query parameters (e.g., { pageSize, pageNumber })
   * @return {Object} Returns Promise that represents a collection of AccountFundingSource objects
   */
  getAll(params?: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('AccountFundingSources', 'GET', undefined, params).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a single funding source by its ID
   *
   * @param {string} fundingSourceId - The unique identifier of the funding source
   * @return {Object} Returns Promise that represents an AccountFundingSource object
   */
  getById(fundingSourceId: string) {
    return new Promise((resolve, reject) => {
      if (!fundingSourceId) {
        reject(new TUError(1, 'fundingSourceId must be provided.', { provided: fundingSourceId }))
        return
      }
      this.tu.runRequest(`AccountFundingSources/${fundingSourceId}`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get custom fields for a funding source
   *
   * @param {string} fundingSourceId - The unique identifier of the funding source
   * @return {Object} Returns Promise that represents a collection of custom field objects
   */
  getCustomFields(fundingSourceId: string) {
    return new Promise((resolve, reject) => {
      if (!fundingSourceId) {
        reject(new TUError(2, 'fundingSourceId must be provided.', { provided: fundingSourceId }))
        return
      }
      this.tu.runRequest(`AccountFundingSources/${fundingSourceId}/customfields`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get adjustments for a funding source
   *
   * @param {string} fundingSourceId - The unique identifier of the funding source
   * @return {Object} Returns Promise that represents a collection of adjustment objects
   */
  getAdjustments(fundingSourceId: string) {
    return new Promise((resolve, reject) => {
      if (!fundingSourceId) {
        reject(new TUError(3, 'fundingSourceId must be provided.', { provided: fundingSourceId }))
        return
      }
      this.tu.runRequest(`AccountFundingSources/${fundingSourceId}/adjustments`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get transactions for a funding source
   *
   * @param {string} fundingSourceId - The unique identifier of the funding source
   * @return {Object} Returns Promise that represents a collection of transaction objects
   */
  getTransactions(fundingSourceId: string) {
    return new Promise((resolve, reject) => {
      if (!fundingSourceId) {
        reject(new TUError(4, 'fundingSourceId must be provided.', { provided: fundingSourceId }))
        return
      }
      this.tu.runRequest(`AccountFundingSources/${fundingSourceId}/transactions`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get distributions for a funding source
   *
   * @param {string} fundingSourceId - The unique identifier of the funding source
   * @return {Object} Returns Promise that represents a collection of distribution objects
   */
  getDistributions(fundingSourceId: string) {
    return new Promise((resolve, reject) => {
      if (!fundingSourceId) {
        reject(new TUError(5, 'fundingSourceId must be provided.', { provided: fundingSourceId }))
        return
      }
      this.tu.runRequest(`AccountFundingSources/${fundingSourceId}/distributions`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
