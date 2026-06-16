import { TrimbleUnityMaintain } from './index'

/**
 * Service Request module for Trimble Unity Maintain (Cityworks AMS)
 *
 * Wraps the Cityworks AMS ServiceRequest service endpoints.
 * API path prefix: AMS/ServiceRequest
 */
export class ServiceRequest {
  private tu: TrimbleUnityMaintain

  constructor(tu: TrimbleUnityMaintain) {
    this.tu = tu
  }

  /**
   * Get service requests by one or more request IDs
   *
   * @param {Array<number>} requestIds - Array of request SIDs
   * @return {Object} Returns Promise representing the JSON array of service requests
   */
  getById(requestIds: Array<number>) {
    return this.tu.runRequest('AMS/ServiceRequest/ById', { RequestIDs: requestIds })
  }

  /**
   * Search for service requests using filter criteria
   *
   * @param {Object} filters - Object of filter parameters (ProblemCode, Status, Priority, SubmitFromDate, etc.)
   * @return {Object} Returns Promise representing the list of matching service requests
   */
  search(filters: Object) {
    return this.tu.runRequest('AMS/ServiceRequest/Search', filters)
  }

  /**
   * Get all service requests (optionally paginated)
   *
   * @param {number} [pageSize] - Number of records per page
   * @param {number} [page] - Page number
   * @return {Object} Returns Promise representing the list of service requests
   */
  getAll(pageSize?: number, page?: number) {
    const data: any = {}
    if (typeof pageSize !== 'undefined') data.PageSize = pageSize
    if (typeof page !== 'undefined') data.PageNum = page
    return this.tu.runRequest('AMS/ServiceRequest/All', data)
  }

  /**
   * Create a new service request
   *
   * @param {Object} requestData - Object containing request fields (ProblemCode, Description, CallerName, etc.)
   * @return {Object} Returns Promise representing the created service request
   */
  create(requestData: Object) {
    return this.tu.runRequest('AMS/ServiceRequest/Create', requestData)
  }

  /**
   * Update an existing service request
   *
   * @param {Object} requestData - Object containing RequestID and fields to update
   * @return {Object} Returns Promise representing the updated service request
   */
  update(requestData: Object) {
    return this.tu.runRequest('AMS/ServiceRequest/Update', requestData)
  }

  /**
   * Close one or more service requests
   *
   * @param {Array<number>} requestIds - Array of request SIDs to close
   * @param {string} [closedDate] - Optional closed date (ISO date string)
   * @return {Object} Returns Promise representing the result
   */
  close(requestIds: Array<number>, closedDate?: string) {
    const data: any = { RequestIDs: requestIds }
    if (typeof closedDate !== 'undefined') data.ClosedDate = closedDate
    return this.tu.runRequest('AMS/ServiceRequest/Close', data)
  }

  /**
   * Cancel one or more service requests
   *
   * @param {Array<number>} requestIds - Array of request SIDs to cancel
   * @return {Object} Returns Promise representing the result
   */
  cancel(requestIds: Array<number>) {
    return this.tu.runRequest('AMS/ServiceRequest/Cancel', { RequestIDs: requestIds })
  }

  /**
   * Delete one or more service requests
   *
   * @param {Array<number>} requestIds - Array of request SIDs to delete
   * @return {Object} Returns Promise representing the result
   */
  delete(requestIds: Array<number>) {
    return this.tu.runRequest('AMS/ServiceRequest/Delete', { RequestIDs: requestIds })
  }

  /**
   * Get comments for a service request
   *
   * @param {number} requestId - Request SID
   * @return {Object} Returns Promise representing the list of comments
   */
  getComments(requestId: number) {
    return this.tu.runRequest('AMS/ServiceRequest/Comments', { RequestID: requestId })
  }

  /**
   * Add a comment to a service request
   *
   * @param {number} requestId - Request SID
   * @param {string} comment - Comment text
   * @return {Object} Returns Promise representing the added comment
   */
  addComment(requestId: number, comment: string) {
    return this.tu.runRequest('AMS/ServiceRequest/AddComment', { RequestID: requestId, Comments: comment })
  }

  /**
   * Get work orders linked to a service request
   *
   * @param {number} requestId - Request SID
   * @return {Object} Returns Promise representing the linked work orders
   */
  getLinkedWorkOrders(requestId: number) {
    return this.tu.runRequest('AMS/ServiceRequest/WorkOrders', { RequestID: requestId })
  }

  /**
   * Link a service request to a work order
   *
   * @param {number} requestId - Request SID
   * @param {number} woid - Work order SID
   * @return {Object} Returns Promise representing the link result
   */
  linkWorkOrder(requestId: number, woid: number) {
    return this.tu.runRequest('AMS/ServiceRequest/AddWorkOrder', { RequestID: requestId, WorkOrderSID: woid })
  }

  /**
   * Get the list of available problem codes for service requests
   *
   * @return {Object} Returns Promise representing the array of problem codes
   */
  getProblemCodes() {
    return this.tu.runRequest('AMS/ServiceRequest/ProblemCodes', {})
  }
}
