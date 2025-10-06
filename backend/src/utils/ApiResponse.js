class ApiResponse{
    constructor(
        statusCode,
        data,
        message="sucess message was not given by u"
    ){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400
    }
}
export {ApiResponse}