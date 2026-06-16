import { TrimbleUnityMaintain } from './index'

/**
 * Asset module for Trimble Unity Maintain (Cityworks AMS)
 *
 * Wraps the Cityworks GIS/Assets service endpoints for infrastructure asset management.
 * API path prefix: AMS/Gis / General/GisToken
 */
export class Asset {
  private tu: TrimbleUnityMaintain

  constructor(tu: TrimbleUnityMaintain) {
    this.tu = tu
  }

  /**
   * Search for assets by entity type and optional UIDs
   *
   * @param {string} entityType - The entity/feature class type (e.g., 'STORM_MAIN', 'WATER_MAIN')
   * @param {Array<string>} [entityUids] - Optional array of entity UIDs to filter
   * @return {Object} Returns Promise representing the list of matching assets
   */
  search(entityType: string, entityUids?: Array<string>) {
    const data: any = { EntityType: entityType }
    if (typeof entityUids !== 'undefined' && entityUids.length > 0) {
      data.EntityUIDs = entityUids
    }
    return this.tu.runRequest('AMS/Gis/Assets', data)
  }

  /**
   * Get work orders associated with an asset
   *
   * @param {string} entityType - The entity/feature class type
   * @param {string} entityUid - The entity UID
   * @return {Object} Returns Promise representing the list of associated work orders
   */
  getWorkOrders(entityType: string, entityUid: string) {
    return this.tu.runRequest('AMS/Gis/WorkOrders', { EntityType: entityType, EntityUID: entityUid })
  }

  /**
   * Get inspections associated with an asset
   *
   * @param {string} entityType - The entity/feature class type
   * @param {string} entityUid - The entity UID
   * @return {Object} Returns Promise representing the list of associated inspections
   */
  getInspections(entityType: string, entityUid: string) {
    return this.tu.runRequest('AMS/Gis/Inspections', { EntityType: entityType, EntityUID: entityUid })
  }

  /**
   * Get service requests associated with an asset
   *
   * @param {string} entityType - The entity/feature class type
   * @param {string} entityUid - The entity UID
   * @return {Object} Returns Promise representing the list of associated service requests
   */
  getServiceRequests(entityType: string, entityUid: string) {
    return this.tu.runRequest('AMS/Gis/ServiceRequests', { EntityType: entityType, EntityUID: entityUid })
  }

  /**
   * Get all entity types (asset types) available in this Maintain instance
   *
   * @return {Object} Returns Promise representing the list of entity types
   */
  getEntityTypes() {
    return this.tu.runRequest('AMS/Gis/EntityTypes', {})
  }

  /**
   * Get field definitions for a given entity type
   *
   * @param {string} entityType - The entity/feature class type
   * @return {Object} Returns Promise representing the field definitions
   */
  getEntityFields(entityType: string) {
    return this.tu.runRequest('AMS/Gis/EntityFields', { EntityType: entityType })
  }

  /**
   * Get asset history (all activity) for a specific asset
   *
   * @param {string} entityType - The entity/feature class type
   * @param {string} entityUid - The entity UID
   * @return {Object} Returns Promise representing the asset history
   */
  getHistory(entityType: string, entityUid: string) {
    return this.tu.runRequest('AMS/Gis/AssetHistory', { EntityType: entityType, EntityUID: entityUid })
  }
}
