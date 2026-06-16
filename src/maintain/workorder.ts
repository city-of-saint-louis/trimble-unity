import { TrimbleUnityMaintain } from './index'

/**
 * Work Order module for Trimble Unity Maintain (Cityworks AMS)
 *
 * Wraps the Cityworks AMS WorkOrder service endpoints.
 * API path prefix: AMS/WorkOrder
 */
export class WorkOrder {
  private tu: TrimbleUnityMaintain

  constructor(tu: TrimbleUnityMaintain) {
    this.tu = tu
  }

  /**
   * Get work orders by one or more work order SIDs
   *
   * @param {Array<number>} woid - Array of work order SIDs
   * @return {Object} Returns Promise representing the JSON array of work orders
   */
  getById(woid: Array<number>) {
    return this.tu.runRequest('AMS/WorkOrder/ById', { WorkOrderSIDs: woid })
  }

  /**
   * Search for work orders using filter criteria
   *
   * @param {Object} filters - Object of filter parameters (e.g., EntityType, Status, StartDate, EndDate, EmployeeSID, etc.)
   * @return {Object} Returns Promise representing the list of matching work orders
   */
  search(filters: Object) {
    return this.tu.runRequest('AMS/WorkOrder/Search', filters)
  }

  /**
   * Get all work orders (optionally paginated)
   *
   * @param {number} [pageSize] - Number of records per page (default varies by server config)
   * @param {number} [page] - Page number
   * @return {Object} Returns Promise representing the list of work orders
   */
  getAll(pageSize?: number, page?: number) {
    const data: any = {}
    if (typeof pageSize !== 'undefined') data.PageSize = pageSize
    if (typeof page !== 'undefined') data.PageNum = page
    return this.tu.runRequest('AMS/WorkOrder/All', data)
  }

  /**
   * Create a new work order
   *
   * @param {Object} woData - Object containing work order fields (EntityType, Status, Priority, etc.)
   * @return {Object} Returns Promise representing the created work order
   */
  create(woData: Object) {
    return this.tu.runRequest('AMS/WorkOrder/Create', woData)
  }

  /**
   * Update an existing work order
   *
   * @param {Object} woData - Object containing WorkOrderSID and fields to update
   * @return {Object} Returns Promise representing the updated work order
   */
  update(woData: Object) {
    return this.tu.runRequest('AMS/WorkOrder/Update', woData)
  }

  /**
   * Close one or more work orders
   *
   * @param {Array<number>} woids - Array of work order SIDs to close
   * @param {string} [closedDate] - Optional closed date (ISO date string)
   * @return {Object} Returns Promise representing the result
   */
  close(woids: Array<number>, closedDate?: string) {
    const data: any = { WorkOrderSIDs: woids }
    if (typeof closedDate !== 'undefined') data.ClosedDate = closedDate
    return this.tu.runRequest('AMS/WorkOrder/Close', data)
  }

  /**
   * Cancel one or more work orders
   *
   * @param {Array<number>} woids - Array of work order SIDs to cancel
   * @return {Object} Returns Promise representing the result
   */
  cancel(woids: Array<number>) {
    return this.tu.runRequest('AMS/WorkOrder/Cancel', { WorkOrderSIDs: woids })
  }

  /**
   * Delete one or more work orders
   *
   * @param {Array<number>} woids - Array of work order SIDs to delete
   * @return {Object} Returns Promise representing the result
   */
  delete(woids: Array<number>) {
    return this.tu.runRequest('AMS/WorkOrder/Delete', { WorkOrderSIDs: woids })
  }

  /**
   * Get comments for a work order
   *
   * @param {number} woid - Work order SID
   * @return {Object} Returns Promise representing the list of comments
   */
  getComments(woid: number) {
    return this.tu.runRequest('AMS/WorkOrder/Comments', { WorkOrderSID: woid })
  }

  /**
   * Add a comment to a work order
   *
   * @param {number} woid - Work order SID
   * @param {string} comment - Comment text
   * @return {Object} Returns Promise representing the added comment
   */
  addComment(woid: number, comment: string) {
    return this.tu.runRequest('AMS/WorkOrder/AddComment', { WorkOrderSID: woid, Comments: comment })
  }

  /**
   * Get tasks/activities linked to a work order
   *
   * @param {number} woid - Work order SID
   * @return {Object} Returns Promise representing the list of tasks
   */
  getTasks(woid: number) {
    return this.tu.runRequest('AMS/WorkOrder/Tasks', { WorkOrderSID: woid })
  }

  /**
   * Get entities (GIS assets) linked to a work order
   *
   * @param {number} woid - Work order SID
   * @return {Object} Returns Promise representing the list of entities
   */
  getEntities(woid: number) {
    return this.tu.runRequest('AMS/WorkOrder/Entities', { WorkOrderSID: woid })
  }

  /**
   * Get the custom field templates available for work orders
   *
   * @param {string} entityType - The entity/template type code
   * @return {Object} Returns Promise representing the custom field definitions
   */
  getCustomFieldTemplates(entityType: string) {
    return this.tu.runRequest('AMS/WorkOrder/CustomFields', { EntityType: entityType })
  }

  /**
   * Get the list of available work order templates/entity types
   *
   * @return {Object} Returns Promise representing the array of entity types
   */
  getEntityTypes() {
    return this.tu.runRequest('AMS/WorkOrder/EntityTypes', {})
  }
}
