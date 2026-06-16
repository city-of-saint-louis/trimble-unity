import _ from 'lodash'

export interface TUErrorMsgs {
  MessageType: number
  Code: number
  Service: string
  Name: string
  DebugDetails: string
  DisplayText: string
  InnerMessage: string | null
}

/**
 * TUErrorInt interface definition for implementation by TUError
 *
 * `{name: string, code: number, message: string, info?: string}`
 *
 */
export interface TUErrorInt {
  Name: string
  Code: number
  Message: string
  Error_messages?: Array<TUErrorMsgs>
  Info?: string
}

/**
 * TUError implements a custom error class for this codebase with additional information
 *
 */
export class TUError implements TUErrorInt {
  /**
   * Just statically set to "Trimble Unity Exception" for now
   */
  Name: string
  /**
   * Number for the thrown error (Efforts were made to make these unique when thrown throughout the codebase)
   */
  Code: number
  /**
   * The error message
   */
  Message: string
  /**
   * The error messages array
   */
  Error_messages: Array<TUErrorMsgs>
  /**
   * Object stuffed with any other information one wishes to include in the thrown error
   */
  Info?: string

  /**
   * TUError implements a custom error class for this codebase with additional information
   *
   * @param {number} code - Number for the thrown error
   * @param {string} message - The error message
   * @param {Object} info - Object stuffed with any other information one wishes to include in the thrown error
   * @return {Object} Returns instance of TUError object
   */
  constructor(code: number, message: string, info?: any) {
    this.Name = "Trimble Unity Exception"
    this.Code = code
    this.Message = message
    this.Error_messages = []
    if (typeof (info) !== 'undefined') {
      if (_.has(info, 'ErrorMessages')) {
        _.forEach(info.ErrorMessages, (v) => {
          _.set(v, 'Service', v.Service.replace(/([a-z])([A-Z])/g, '$1 $2'))
          _.set(v, 'Name', v.Name.replace(/([a-z])([A-Z])/g, '$1 $2'))
          this.Error_messages.push(v)
        })
      }
      if (_.has(info, 'Message'))
        this.Message = _.get(info, 'Message')
      this.Info = JSON.stringify(info)
    }
  }
}
