import { TUError } from './error'
import _ from 'lodash'

/**
 * Projects module for Trimble Unity Construct
 *
 * Provides methods to interact with the Projects API endpoint.
 */
export class Project {
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
   * Get all projects accessible to the authenticated user
   *
   * @param {Object} [params] - Optional query parameters (e.g., { pageSize, pageNumber })
   * @return {Object} Returns Promise that represents a collection of Project objects
   */
  getAll(params?: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Projects', 'GET', undefined, params).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a single project by its ID
   *
   * @param {string} projectId - The unique identifier of the project
   * @return {Object} Returns Promise that represents a Project object
   */
  getById(projectId: string) {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        reject(new TUError(1, 'projectId must be provided.', { provided: projectId }))
        return
      }
      this.tu.runRequest(`Projects/${projectId}`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Query projects using filter criteria
   *
   * @param {Object} queryData - Query filter object (see API documentation for available fields)
   * @return {Object} Returns Promise that represents a collection of matching Project objects
   */
  query(queryData: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Projects/Query', 'POST', queryData).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get custom fields for a project
   *
   * @param {string} projectId - The unique identifier of the project
   * @return {Object} Returns Promise that represents a collection of custom field objects
   */
  getCustomFields(projectId: string) {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        reject(new TUError(2, 'projectId must be provided.', { provided: projectId }))
        return
      }
      this.tu.runRequest(`Projects/${projectId}/customfields`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get budget line items for a project
   *
   * @param {string} projectId - The unique identifier of the project
   * @return {Object} Returns Promise that represents a collection of budget line items
   */
  getBudgetLineItems(projectId: string) {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        reject(new TUError(3, 'projectId must be provided.', { provided: projectId }))
        return
      }
      this.tu.runRequest(`Projects/${projectId}/budgetlineitems`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get commitments for a project
   *
   * @param {string} projectId - The unique identifier of the project
   * @return {Object} Returns Promise that represents a collection of Commitment objects
   */
  getCommitments(projectId: string) {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        reject(new TUError(4, 'projectId must be provided.', { provided: projectId }))
        return
      }
      this.tu.runRequest(`Projects/${projectId}/commitments`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get contacts for a project
   *
   * @param {string} projectId - The unique identifier of the project
   * @return {Object} Returns Promise that represents a collection of Contact objects
   */
  getContacts(projectId: string) {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        reject(new TUError(5, 'projectId must be provided.', { provided: projectId }))
        return
      }
      this.tu.runRequest(`Projects/${projectId}/contacts`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get companies associated with a project
   *
   * @param {string} projectId - The unique identifier of the project
   * @return {Object} Returns Promise that represents a collection of Company objects
   */
  getCompanies(projectId: string) {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        reject(new TUError(6, 'projectId must be provided.', { provided: projectId }))
        return
      }
      this.tu.runRequest(`Projects/${projectId}/companies`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get processes for a project
   *
   * @param {string} projectId - The unique identifier of the project
   * @return {Object} Returns Promise that represents a collection of Process objects
   */
  getProcesses(projectId: string) {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        reject(new TUError(7, 'projectId must be provided.', { provided: projectId }))
        return
      }
      this.tu.runRequest(`Projects/${projectId}/processes`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get documents for a project
   *
   * @param {string} projectId - The unique identifier of the project
   * @return {Object} Returns Promise that represents a collection of Document objects
   */
  getDocuments(projectId: string) {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        reject(new TUError(8, 'projectId must be provided.', { provided: projectId }))
        return
      }
      this.tu.runRequest(`Projects/${projectId}/documents`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
