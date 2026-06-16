import { TUError } from './error'
import _ from 'lodash'

/**
 * Document module for Trimble Unity Construct
 *
 * Provides methods to interact with the Documents API endpoint.
 */
export class Document {
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
   * Get all documents accessible to the authenticated user
   *
   * @param {Object} [params] - Optional query parameters (e.g., { pageSize, pageNumber, projectId })
   * @return {Object} Returns Promise that represents a collection of Document objects
   */
  getAll(params?: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Documents', 'GET', undefined, params).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a single document by its ID
   *
   * @param {string} documentId - The unique identifier of the document
   * @return {Object} Returns Promise that represents a Document object
   */
  getById(documentId: string) {
    return new Promise((resolve, reject) => {
      if (!documentId) {
        reject(new TUError(1, 'documentId must be provided.', { provided: documentId }))
        return
      }
      this.tu.runRequest(`Documents/${documentId}`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Query documents using filter criteria
   *
   * @param {Object} queryData - Query filter object (see API documentation for available fields)
   * @return {Object} Returns Promise that represents a collection of matching Document objects
   */
  query(queryData: Object) {
    return new Promise((resolve, reject) => {
      this.tu.runRequest('Documents/Query', 'POST', queryData).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get documents by project ID
   *
   * @param {string} projectId - The unique identifier of the project
   * @param {Object} [params] - Optional additional query parameters
   * @return {Object} Returns Promise that represents a collection of Document objects for the project
   */
  getByProject(projectId: string, params?: Object) {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        reject(new TUError(2, 'projectId must be provided.', { provided: projectId }))
        return
      }
      const queryParams = _.assign({ projectId }, params)
      this.tu.runRequest('Documents', 'GET', undefined, queryParams).then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get versions of a document
   *
   * @param {string} documentId - The unique identifier of the document
   * @return {Object} Returns Promise that represents a collection of document version objects
   */
  getVersions(documentId: string) {
    return new Promise((resolve, reject) => {
      if (!documentId) {
        reject(new TUError(3, 'documentId must be provided.', { provided: documentId }))
        return
      }
      this.tu.runRequest(`Documents/${documentId}/versions`, 'GET').then((response: any) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
