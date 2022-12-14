// const errroHandler=(err,req,res,next)=>{
//     const statusCode=res.statusCode ? res.statusCode : 500;

//     res.status(statusCode);
//     res.json({
//         message:err.message
//         // stack:process.env.NODE_ENV === "development" ? err.stack : null,
//     });
// };

// module.exports = errroHandler;

class AppError extends Error {  //here Error is In-built error class
    constructor(message, statusCode) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;