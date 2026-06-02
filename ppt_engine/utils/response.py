from typing import Any, Optional, Dict

class ServiceResponse:
    def __init__(self, success: bool, message: Optional[str] = None, data: Optional[Any] = None, status: int = 200, **kwargs):
        self.success = success
        self.message = message
        self.data = data
        self.status = status
        self.extra = kwargs

    def to_dict(self) -> Dict[str, Any]:
        res = {
            "success": self.success,
            "status": self.status
        }
        if self.message is not None:
            res["message"] = self.message
        if self.data is not None:
            res["data"] = self.data
        for k, v in self.extra.items():
            res[k] = v
        return res

def success_response(message: Optional[str] = None, data: Optional[Any] = None, status: int = 200, **kwargs) -> Dict[str, Any]:
    """
    Builds a uniform success service response dictionary.
    """
    return ServiceResponse(success=True, message=message, data=data, status=status, **kwargs).to_dict()

def error_response(message: str, status: int = 500, **kwargs) -> Dict[str, Any]:
    """
    Builds a uniform error service response dictionary.
    """
    return ServiceResponse(success=False, message=message, status=status, **kwargs).to_dict()
