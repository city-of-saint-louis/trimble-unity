import { TrimbleUnityMaintain } from './index'

/**
 * Cost module for Trimble Unity Maintain (Cityworks AMS)
 *
 * Wraps the Cityworks AMS cost tracking endpoints: labor, material, and equipment costs.
 * API path prefixes: AMS/WorkOrderCost, AMS/InspectionCost, AMS/ServiceRequestCost
 */
export class Cost {
  private tu: TrimbleUnityMaintain

  constructor(tu: TrimbleUnityMaintain) {
    this.tu = tu
  }

  // ─── Work Order Costs ──────────────────────────────────────────────────────

  /**
   * Get labor cost entries for a work order
   *
   * @param {number} woid - Work order SID
   * @return {Object} Returns Promise representing the list of labor cost entries
   */
  getWorkOrderLabor(woid: number) {
    return this.tu.runRequest('AMS/WorkOrderCost/Labor', { WorkOrderSID: woid })
  }

  /**
   * Add a labor cost entry to a work order
   *
   * @param {Object} costData - Labor cost fields (WorkOrderSID, EmployeeSID, Hours, HourlyRate, etc.)
   * @return {Object} Returns Promise representing the created labor cost entry
   */
  addWorkOrderLabor(costData: Object) {
    return this.tu.runRequest('AMS/WorkOrderCost/AddLabor', costData)
  }

  /**
   * Get material cost entries for a work order
   *
   * @param {number} woid - Work order SID
   * @return {Object} Returns Promise representing the list of material cost entries
   */
  getWorkOrderMaterial(woid: number) {
    return this.tu.runRequest('AMS/WorkOrderCost/Material', { WorkOrderSID: woid })
  }

  /**
   * Add a material cost entry to a work order
   *
   * @param {Object} costData - Material cost fields (WorkOrderSID, MaterialSID, Quantity, UnitCost, etc.)
   * @return {Object} Returns Promise representing the created material cost entry
   */
  addWorkOrderMaterial(costData: Object) {
    return this.tu.runRequest('AMS/WorkOrderCost/AddMaterial', costData)
  }

  /**
   * Get equipment cost entries for a work order
   *
   * @param {number} woid - Work order SID
   * @return {Object} Returns Promise representing the list of equipment cost entries
   */
  getWorkOrderEquipment(woid: number) {
    return this.tu.runRequest('AMS/WorkOrderCost/Equipment', { WorkOrderSID: woid })
  }

  /**
   * Add an equipment cost entry to a work order
   *
   * @param {Object} costData - Equipment cost fields (WorkOrderSID, EquipmentSID, Hours, HourlyRate, etc.)
   * @return {Object} Returns Promise representing the created equipment cost entry
   */
  addWorkOrderEquipment(costData: Object) {
    return this.tu.runRequest('AMS/WorkOrderCost/AddEquipment', costData)
  }

  // ─── Inspection Costs ─────────────────────────────────────────────────────

  /**
   * Get labor cost entries for an inspection
   *
   * @param {number} inspectionId - Inspection SID
   * @return {Object} Returns Promise representing the list of labor cost entries
   */
  getInspectionLabor(inspectionId: number) {
    return this.tu.runRequest('AMS/InspectionCost/Labor', { InspectionSID: inspectionId })
  }

  /**
   * Add a labor cost entry to an inspection
   *
   * @param {Object} costData - Labor cost fields (InspectionSID, EmployeeSID, Hours, HourlyRate, etc.)
   * @return {Object} Returns Promise representing the created labor cost entry
   */
  addInspectionLabor(costData: Object) {
    return this.tu.runRequest('AMS/InspectionCost/AddLabor', costData)
  }

  /**
   * Get material cost entries for an inspection
   *
   * @param {number} inspectionId - Inspection SID
   * @return {Object} Returns Promise representing the list of material cost entries
   */
  getInspectionMaterial(inspectionId: number) {
    return this.tu.runRequest('AMS/InspectionCost/Material', { InspectionSID: inspectionId })
  }

  /**
   * Add a material cost entry to an inspection
   *
   * @param {Object} costData - Material cost fields (InspectionSID, MaterialSID, Quantity, UnitCost, etc.)
   * @return {Object} Returns Promise representing the created material cost entry
   */
  addInspectionMaterial(costData: Object) {
    return this.tu.runRequest('AMS/InspectionCost/AddMaterial', costData)
  }

  // ─── Service Request Costs ────────────────────────────────────────────────

  /**
   * Get labor cost entries for a service request
   *
   * @param {number} requestId - Service request SID
   * @return {Object} Returns Promise representing the list of labor cost entries
   */
  getServiceRequestLabor(requestId: number) {
    return this.tu.runRequest('AMS/ServiceRequestCost/Labor', { RequestID: requestId })
  }

  /**
   * Add a labor cost entry to a service request
   *
   * @param {Object} costData - Labor cost fields (RequestID, EmployeeSID, Hours, HourlyRate, etc.)
   * @return {Object} Returns Promise representing the created labor cost entry
   */
  addServiceRequestLabor(costData: Object) {
    return this.tu.runRequest('AMS/ServiceRequestCost/AddLabor', costData)
  }
}
