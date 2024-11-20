class ApiError extends Error {
    constructor(statusCode, message, type, code ) {
      super(message)
      this.statusCode = statusCode
      this.type = type
      this.code = code

      Error.captureStackTrace(this, this.constructor)
    }
  }
  
  export default ApiError