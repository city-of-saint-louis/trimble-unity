import { TrimbleUnityMaintain } from './index'

/**
 * Employee module for Trimble Unity Maintain (Cityworks)
 *
 * Wraps the Cityworks Employee/user management service endpoints.
 * API path prefix: General/Employee
 */
export class Employee {
  private tu: TrimbleUnityMaintain

  constructor(tu: TrimbleUnityMaintain) {
    this.tu = tu
  }

  /**
   * Get employees by one or more employee SIDs
   *
   * @param {Array<number>} empSids - Array of employee SIDs
   * @return {Object} Returns Promise representing the JSON array of employees
   */
  getById(empSids: Array<number>) {
    return this.tu.runRequest('General/Employee/ById', { EmployeeSIDs: empSids })
  }

  /**
   * Get the employee record for the currently authenticated user
   *
   * @return {Object} Returns Promise representing the current employee record
   */
  current() {
    return this.tu.runRequest('General/Employee/Current', {})
  }

  /**
   * Search for employees using filter criteria
   *
   * @param {Object} filters - Object of filter parameters (FullName, LoginName, OrgCode, etc.)
   * @return {Object} Returns Promise representing the list of matching employees
   */
  search(filters: Object) {
    return this.tu.runRequest('General/Employee/Search', filters)
  }

  /**
   * Get all employees in the system
   *
   * @return {Object} Returns Promise representing the list of all employees
   */
  getAll() {
    return this.tu.runRequest('General/Employee/All', {})
  }

  /**
   * Get the groups that an employee belongs to
   *
   * @param {number} empSid - Employee SID
   * @return {Object} Returns Promise representing the list of groups
   */
  getGroups(empSid: number) {
    return this.tu.runRequest('General/Employee/Groups', { EmployeeSID: empSid })
  }

  /**
   * Get the service requests assigned to an employee
   *
   * @param {number} empSid - Employee SID
   * @return {Object} Returns Promise representing the list of service requests
   */
  getServiceRequests(empSid: number) {
    return this.tu.runRequest('AMS/ServiceRequest/Search', { EmployeeSID: empSid })
  }

  /**
   * Get the work orders assigned to an employee
   *
   * @param {number} empSid - Employee SID
   * @return {Object} Returns Promise representing the list of work orders
   */
  getWorkOrders(empSid: number) {
    return this.tu.runRequest('AMS/WorkOrder/Search', { EmployeeSID: empSid })
  }

  /**
   * Get the inspections assigned to an employee
   *
   * @param {number} empSid - Employee SID
   * @return {Object} Returns Promise representing the list of inspections
   */
  getInspections(empSid: number) {
    return this.tu.runRequest('AMS/Inspection/Search', { EmployeeSID: empSid })
  }
}
