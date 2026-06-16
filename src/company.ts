import { TUError } from './error'
import _ from 'lodash'

/**
 * Company module for Trimble Unity Construct
 *
 * Provides methods to interact with the Companies API endpoint.
 */
export class Company {
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
   * Get all companies accessible to the authenticated user
   *
   * @param {Object} [params] - Optional query parameters (e.g., { pageSize, pageNumber })
   * @return {Object} Returns Promise that represents a collection of Company objects
   */
  getAll(params?: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Companies', 'GET', undefined, params).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a single company by its ID
   *
   * @param {string} companyId - The unique identifier of the company
   * @return {Object} Returns Promise that represents a Company object
   */
  getById(companyId: string) {
    return new Promise((resolve, reject) => {
      if (!companyId) {
        reject(new TUError(1, 'companyId must be provided.', { provided: companyId }))
        return
      }
      this.tu.runRequest(`Companies/${companyId}`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Query companies using filter criteria
   *
   * @param {Object} queryData - Query filter object (see API documentation for available fields)
   * @return {Object} Returns Promise that represents a collection of matching Company objects
   */
  query(queryData: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Companies/Query', 'POST', queryData).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get contacts for a company
   *
   * @param {string} companyId - The unique identifier of the company
   * @return {Object} Returns Promise that represents a collection of Contact objects
   */
  getContacts(companyId: string) {
    return new Promise((resolve, reject) => {
      if (!companyId) {
        reject(new TUError(2, 'companyId must be provided.', { provided: companyId }))
        return
      }
      this.tu.runRequest(`Companies/${companyId}/contacts`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get projects associated with a company
   *
   * @param {string} companyId - The unique identifier of the company
   * @return {Object} Returns Promise that represents a collection of Project objects
   */
  getProjects(companyId: string) {
    return new Promise((resolve, reject) => {
      if (!companyId) {
        reject(new TUError(3, 'companyId must be provided.', { provided: companyId }))
        return
      }
      this.tu.runRequest(`Companies/${companyId}/projects`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get custom fields for a company
   *
   * @param {string} companyId - The unique identifier of the company
   * @return {Object} Returns Promise that represents a collection of custom field objects
   */
  getCustomFields(companyId: string) {
    return new Promise((resolve, reject) => {
      if (!companyId) {
        reject(new TUError(4, 'companyId must be provided.', { provided: companyId }))
        return
      }
      this.tu.runRequest(`Companies/${companyId}/customfields`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
