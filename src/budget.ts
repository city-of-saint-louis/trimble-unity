import { TUError } from './error'
import _ from 'lodash'

/**
 * Budgets module for Trimble Unity Construct
 *
 * Provides methods to interact with the Budgets API endpoint.
 */
export class Budget {
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
   * Get all budgets accessible to the authenticated user
   *
   * @param {Object} [params] - Optional query parameters (e.g., { pageSize, pageNumber })
   * @return {Object} Returns Promise that represents a collection of Budget objects
   */
  getAll(params?: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Budgets', 'GET', undefined, params).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a single budget by its ID
   *
   * @param {string} budgetId - The unique identifier of the budget
   * @return {Object} Returns Promise that represents a Budget object
   */
  getById(budgetId: string) {
    return new Promise((resolve, reject) => {
      if (!budgetId) {
        reject(new TUError(1, 'budgetId must be provided.', { provided: budgetId }))
        return
      }
      this.tu.runRequest(`Budgets/${budgetId}`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Query budgets using filter criteria
   *
   * @param {Object} queryData - Query filter object (see API documentation for available fields)
   * @return {Object} Returns Promise that represents a collection of matching Budget objects
   */
  query(queryData: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Budgets/Query', 'POST', queryData).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get line items for a budget
   *
   * @param {string} budgetId - The unique identifier of the budget
   * @return {Object} Returns Promise that represents a collection of budget line items
   */
  getLineItems(budgetId: string) {
    return new Promise((resolve, reject) => {
      if (!budgetId) {
        reject(new TUError(2, 'budgetId must be provided.', { provided: budgetId }))
        return
      }
      this.tu.runRequest(`Budgets/${budgetId}/items`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get custom fields for a budget
   *
   * @param {string} budgetId - The unique identifier of the budget
   * @return {Object} Returns Promise that represents a collection of custom field objects
   */
  getCustomFields(budgetId: string) {
    return new Promise((resolve, reject) => {
      if (!budgetId) {
        reject(new TUError(3, 'budgetId must be provided.', { provided: budgetId }))
        return
      }
      this.tu.runRequest(`Budgets/${budgetId}/customfields`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get transactions for a budget
   *
   * @param {string} budgetId - The unique identifier of the budget
   * @return {Object} Returns Promise that represents a collection of transaction objects
   */
  getTransactions(budgetId: string) {
    return new Promise((resolve, reject) => {
      if (!budgetId) {
        reject(new TUError(4, 'budgetId must be provided.', { provided: budgetId }))
        return
      }
      this.tu.runRequest(`Budgets/${budgetId}/transactions`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get adjustments for a budget
   *
   * @param {string} budgetId - The unique identifier of the budget
   * @return {Object} Returns Promise that represents a collection of adjustment objects
   */
  getAdjustments(budgetId: string) {
    return new Promise((resolve, reject) => {
      if (!budgetId) {
        reject(new TUError(5, 'budgetId must be provided.', { provided: budgetId }))
        return
      }
      this.tu.runRequest(`Budgets/${budgetId}/adjustments`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
