import { TUError } from './error'
import _ from 'lodash'

/**
 * Commitments module for Trimble Unity Construct
 *
 * Provides methods to interact with the Commitments API endpoint
 * (contracts/purchase orders with vendors).
 */
export class Commitment {
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
   * Get all commitments accessible to the authenticated user
   *
   * @param {Object} [params] - Optional query parameters (e.g., { pageSize, pageNumber })
   * @return {Object} Returns Promise that represents a collection of Commitment objects
   */
  getAll(params?: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Commitments', 'GET', undefined, params).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a single commitment by its ID
   *
   * @param {string} commitmentId - The unique identifier of the commitment
   * @return {Object} Returns Promise that represents a Commitment object
   */
  getById(commitmentId: string) {
    return new Promise((resolve, reject) => {
      if (!commitmentId) {
        reject(new TUError(1, 'commitmentId must be provided.', { provided: commitmentId }))
        return
      }
      this.tu.runRequest(`Commitments/${commitmentId}`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Query commitments using filter criteria
   *
   * @param {Object} queryData - Query filter object (see API documentation for available fields)
   * @return {Object} Returns Promise that represents a collection of matching Commitment objects
   */
  query(queryData: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Commitments/Query', 'POST', queryData).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get line items for a commitment
   *
   * @param {string} commitmentId - The unique identifier of the commitment
   * @return {Object} Returns Promise that represents a collection of commitment line items
   */
  getItems(commitmentId: string) {
    return new Promise((resolve, reject) => {
      if (!commitmentId) {
        reject(new TUError(2, 'commitmentId must be provided.', { provided: commitmentId }))
        return
      }
      this.tu.runRequest(`Commitments/${commitmentId}/items`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get changes (amendments) for a commitment
   *
   * @param {string} commitmentId - The unique identifier of the commitment
   * @return {Object} Returns Promise that represents a collection of change objects
   */
  getChanges(commitmentId: string) {
    return new Promise((resolve, reject) => {
      if (!commitmentId) {
        reject(new TUError(3, 'commitmentId must be provided.', { provided: commitmentId }))
        return
      }
      this.tu.runRequest(`Commitments/${commitmentId}/changes`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get custom fields for a commitment
   *
   * @param {string} commitmentId - The unique identifier of the commitment
   * @return {Object} Returns Promise that represents a collection of custom field objects
   */
  getCustomFields(commitmentId: string) {
    return new Promise((resolve, reject) => {
      if (!commitmentId) {
        reject(new TUError(4, 'commitmentId must be provided.', { provided: commitmentId }))
        return
      }
      this.tu.runRequest(`Commitments/${commitmentId}/customfields`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get invoices for a commitment
   *
   * @param {string} commitmentId - The unique identifier of the commitment
   * @return {Object} Returns Promise that represents a collection of Invoice objects
   */
  getInvoices(commitmentId: string) {
    return new Promise((resolve, reject) => {
      if (!commitmentId) {
        reject(new TUError(5, 'commitmentId must be provided.', { provided: commitmentId }))
        return
      }
      this.tu.runRequest(`Commitments/${commitmentId}/invoices`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
