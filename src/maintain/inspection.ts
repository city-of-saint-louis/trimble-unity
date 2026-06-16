import { TrimbleUnityMaintain } from './index'

/**
 * Inspection module for Trimble Unity Maintain (Cityworks AMS)
 *
 * Wraps the Cityworks AMS Inspection service endpoints.
 * API path prefix: AMS/Inspection
 */
export class Inspection {
  private tu: TrimbleUnityMaintain

  constructor(tu: TrimbleUnityMaintain) {
    this.tu = tu
  }

  /**
   * Get inspections by one or more inspection SIDs
   *
   * @param {Array<number>} inspectionIds - Array of inspection SIDs
   * @return {Object} Returns Promise representing the JSON array of inspections
   */
  getById(inspectionIds: Array<number>) {
    return this.tu.runRequest('AMS/Inspection/ById', { InspectionSIDs: inspectionIds })
  }

  /**
   * Search for inspections using filter criteria
   *
   * @param {Object} filters - Object of filter parameters (EntityType, Status, EmployeeSID, StartDate, EndDate, etc.)
   * @return {Object} Returns Promise representing the list of matching inspections
   */
  search(filters: Object) {
    return this.tu.runRequest('AMS/Inspection/Search', filters)
  }

  /**
   * Get all inspections (optionally paginated)
   *
   * @param {number} [pageSize] - Number of records per page
   * @param {number} [page] - Page number
   * @return {Object} Returns Promise representing the list of inspections
   */
  getAll(pageSize?: number, page?: number) {
    const data: any = {}
    if (typeof pageSize !== 'undefined') data.PageSize = pageSize
    if (typeof page !== 'undefined') data.PageNum = page
    return this.tu.runRequest('AMS/Inspection/All', data)
  }

  /**
   * Create a new inspection
   *
   * @param {Object} inspectionData - Object containing inspection fields (EntityType, EntityUID, etc.)
   * @return {Object} Returns Promise representing the created inspection
   */
  create(inspectionData: Object) {
    return this.tu.runRequest('AMS/Inspection/Create', inspectionData)
  }

  /**
   * Update an existing inspection
   *
   * @param {Object} inspectionData - Object containing InspectionSID and fields to update
   * @return {Object} Returns Promise representing the updated inspection
   */
  update(inspectionData: Object) {
    return this.tu.runRequest('AMS/Inspection/Update', inspectionData)
  }

  /**
   * Close one or more inspections
   *
   * @param {Array<number>} inspectionIds - Array of inspection SIDs to close
   * @param {string} [closedDate] - Optional closed date (ISO date string)
   * @return {Object} Returns Promise representing the result
   */
  close(inspectionIds: Array<number>, closedDate?: string) {
    const data: any = { InspectionSIDs: inspectionIds }
    if (typeof closedDate !== 'undefined') data.ClosedDate = closedDate
    return this.tu.runRequest('AMS/Inspection/Close', data)
  }

  /**
   * Cancel one or more inspections
   *
   * @param {Array<number>} inspectionIds - Array of inspection SIDs to cancel
   * @return {Object} Returns Promise representing the result
   */
  cancel(inspectionIds: Array<number>) {
    return this.tu.runRequest('AMS/Inspection/Cancel', { InspectionSIDs: inspectionIds })
  }

  /**
   * Delete one or more inspections
   *
   * @param {Array<number>} inspectionIds - Array of inspection SIDs to delete
   * @return {Object} Returns Promise representing the result
   */
  delete(inspectionIds: Array<number>) {
    return this.tu.runRequest('AMS/Inspection/Delete', { InspectionSIDs: inspectionIds })
  }

  /**
   * Get results/observations for an inspection
   *
   * @param {number} inspectionId - Inspection SID
   * @return {Object} Returns Promise representing the inspection results
   */
  getResults(inspectionId: number) {
    return this.tu.runRequest('AMS/Inspection/Results', { InspectionSID: inspectionId })
  }

  /**
   * Get comments for an inspection
   *
   * @param {number} inspectionId - Inspection SID
   * @return {Object} Returns Promise representing the list of comments
   */
  getComments(inspectionId: number) {
    return this.tu.runRequest('AMS/Inspection/Comments', { InspectionSID: inspectionId })
  }

  /**
   * Add a comment to an inspection
   *
   * @param {number} inspectionId - Inspection SID
   * @param {string} comment - Comment text
   * @return {Object} Returns Promise representing the added comment
   */
  addComment(inspectionId: number, comment: string) {
    return this.tu.runRequest('AMS/Inspection/AddComment', { InspectionSID: inspectionId, Comments: comment })
  }

  /**
   * Get entities (GIS assets) linked to an inspection
   *
   * @param {number} inspectionId - Inspection SID
   * @return {Object} Returns Promise representing the list of entities
   */
  getEntities(inspectionId: number) {
    return this.tu.runRequest('AMS/Inspection/Entities', { InspectionSID: inspectionId })
  }

  /**
   * Get the list of available inspection templates/entity types
   *
   * @return {Object} Returns Promise representing the array of entity types
   */
  getEntityTypes() {
    return this.tu.runRequest('AMS/Inspection/EntityTypes', {})
  }
}
