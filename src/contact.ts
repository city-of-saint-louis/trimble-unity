import { TUError } from './error'
import _ from 'lodash'

/**
 * Contact module for Trimble Unity Construct
 *
 * Provides methods to interact with the Contacts API endpoint.
 */
export class Contact {
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
   * Get all contacts accessible to the authenticated user
   *
   * @param {Object} [params] - Optional query parameters (e.g., { pageSize, pageNumber })
   * @return {Object} Returns Promise that represents a collection of Contact objects
   */
  getAll(params?: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Contacts', 'GET', undefined, params).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a single contact by their ID
   *
   * @param {string} contactId - The unique identifier of the contact
   * @return {Object} Returns Promise that represents a Contact object
   */
  getById(contactId: string) {
    return new Promise((resolve, reject) => {
      if (!contactId) {
        reject(new TUError(1, 'contactId must be provided.', { provided: contactId }))
        return
      }
      this.tu.runRequest(`Contacts/${contactId}`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Query contacts using filter criteria
   *
   * @param {Object} queryData - Query filter object (see API documentation for available fields)
   * @return {Object} Returns Promise that represents a collection of matching Contact objects
   */
  query(queryData: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Contacts/Query', 'POST', queryData).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get custom fields for a contact
   *
   * @param {string} contactId - The unique identifier of the contact
   * @return {Object} Returns Promise that represents a collection of custom field objects
   */
  getCustomFields(contactId: string) {
    return new Promise((resolve, reject) => {
      if (!contactId) {
        reject(new TUError(2, 'contactId must be provided.', { provided: contactId }))
        return
      }
      this.tu.runRequest(`Contacts/${contactId}/customfields`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get projects associated with a contact
   *
   * @param {string} contactId - The unique identifier of the contact
   * @return {Object} Returns Promise that represents a collection of Project objects
   */
  getProjects(contactId: string) {
    return new Promise((resolve, reject) => {
      if (!contactId) {
        reject(new TUError(3, 'contactId must be provided.', { provided: contactId }))
        return
      }
      this.tu.runRequest(`Contacts/${contactId}/projects`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
