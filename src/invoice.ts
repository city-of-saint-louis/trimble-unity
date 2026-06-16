import { TUError } from './error'
import _ from 'lodash'

/**
 * Invoice module for Trimble Unity Construct
 *
 * Provides methods to interact with the CommitmentInvoices and GeneralInvoices API endpoints.
 */
export class Invoice {
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
   * Get all commitment invoices accessible to the authenticated user
   *
   * @param {Object} [params] - Optional query parameters (e.g., { pageSize, pageNumber })
   * @return {Object} Returns Promise that represents a collection of CommitmentInvoice objects
   */
  getAll(params?: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('CommitmentInvoices', 'GET', undefined, params).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a single commitment invoice by its ID
   *
   * @param {string} invoiceId - The unique identifier of the invoice
   * @return {Object} Returns Promise that represents a CommitmentInvoice object
   */
  getById(invoiceId: string) {
    return new Promise((resolve, reject) => {
      if (!invoiceId) {
        reject(new TUError(1, 'invoiceId must be provided.', { provided: invoiceId }))
        return
      }
      this.tu.runRequest(`CommitmentInvoices/${invoiceId}`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Query commitment invoices using filter criteria
   *
   * @param {Object} queryData - Query filter object (see API documentation for available fields)
   * @return {Object} Returns Promise that represents a collection of matching CommitmentInvoice objects
   */
  query(queryData: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('CommitmentInvoices/Query', 'POST', queryData).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get line items for a commitment invoice
   *
   * @param {string} invoiceId - The unique identifier of the invoice
   * @return {Object} Returns Promise that represents a collection of invoice line items
   */
  getLineItems(invoiceId: string) {
    return new Promise((resolve, reject) => {
      if (!invoiceId) {
        reject(new TUError(2, 'invoiceId must be provided.', { provided: invoiceId }))
        return
      }
      this.tu.runRequest(`CommitmentInvoices/${invoiceId}/lineItems`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get custom fields for a commitment invoice
   *
   * @param {string} invoiceId - The unique identifier of the invoice
   * @return {Object} Returns Promise that represents a collection of custom field objects
   */
  getCustomFields(invoiceId: string) {
    return new Promise((resolve, reject) => {
      if (!invoiceId) {
        reject(new TUError(3, 'invoiceId must be provided.', { provided: invoiceId }))
        return
      }
      this.tu.runRequest(`CommitmentInvoices/${invoiceId}/customfields`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all general invoices accessible to the authenticated user
   *
   * @param {Object} [params] - Optional query parameters (e.g., { pageSize, pageNumber })
   * @return {Object} Returns Promise that represents a collection of GeneralInvoice objects
   */
  getAllGeneral(params?: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('GeneralInvoices', 'GET', undefined, params).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a single general invoice by its ID
   *
   * @param {string} invoiceId - The unique identifier of the general invoice
   * @return {Object} Returns Promise that represents a GeneralInvoice object
   */
  getGeneralById(invoiceId: string) {
    return new Promise((resolve, reject) => {
      if (!invoiceId) {
        reject(new TUError(4, 'invoiceId must be provided.', { provided: invoiceId }))
        return
      }
      this.tu.runRequest(`GeneralInvoices/${invoiceId}`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Query general invoices using filter criteria
   *
   * @param {Object} queryData - Query filter object (see API documentation for available fields)
   * @return {Object} Returns Promise that represents a collection of matching GeneralInvoice objects
   */
  queryGeneral(queryData: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('GeneralInvoices/Query', 'POST', queryData).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
