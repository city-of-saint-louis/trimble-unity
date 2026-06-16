import { TUError } from './error'
import _ from 'lodash'

/**
 * Process module for Trimble Unity Construct
 *
 * Provides methods to interact with the Processes API endpoint
 * (approval workflows and project workflows).
 */
export class Process {
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
   * Get all processes accessible to the authenticated user
   *
   * @param {Object} [params] - Optional query parameters (e.g., { pageSize, pageNumber, projectId })
   * @return {Object} Returns Promise that represents a collection of Process objects
   */
  getAll(params?: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Processes', 'GET', undefined, params).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a single process by its ID
   *
   * @param {string} processId - The unique identifier of the process
   * @return {Object} Returns Promise that represents a Process object
   */
  getById(processId: string) {
    return new Promise((resolve, reject) => {
      if (!processId) {
        reject(new TUError(1, 'processId must be provided.', { provided: processId }))
        return
      }
      this.tu.runRequest(`Processes/${processId}`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Query processes using filter criteria
   *
   * @param {Object} queryData - Query filter object (see API documentation for available fields)
   * @return {Object} Returns Promise that represents a collection of matching Process objects
   */
  query(queryData: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Processes/Query', 'POST', queryData).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get processes by project ID
   *
   * @param {string} projectId - The unique identifier of the project
   * @param {Object} [params] - Optional additional query parameters
   * @return {Object} Returns Promise that represents a collection of Process objects for the project
   */
  getByProject(projectId: string, params?: Object) {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        reject(new TUError(2, 'projectId must be provided.', { provided: projectId }))
        return
      }
      const queryParams = _.assign({ projectId }, params)
      this.tu.runRequest('Processes', 'GET', undefined, queryParams).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get custom fields for a process
   *
   * @param {string} processId - The unique identifier of the process
   * @return {Object} Returns Promise that represents a collection of custom field objects
   */
  getCustomFields(processId: string) {
    return new Promise((resolve, reject) => {
      if (!processId) {
        reject(new TUError(3, 'processId must be provided.', { provided: processId }))
        return
      }
      this.tu.runRequest(`Processes/${processId}/customfields`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get steps for a process
   *
   * @param {string} processId - The unique identifier of the process
   * @return {Object} Returns Promise that represents a collection of process step objects
   */
  getSteps(processId: string) {
    return new Promise((resolve, reject) => {
      if (!processId) {
        reject(new TUError(4, 'processId must be provided.', { provided: processId }))
        return
      }
      this.tu.runRequest(`Processes/${processId}/steps`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
