import os
import jwt
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from db.operations import get_user
import anyio

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):

        if request.method == "OPTIONS":
            return await call_next(request)

        if request.url.path in ["/", "/docs", "/openapi.json", "/redoc", "/user/sign-in"]:
            return await call_next(request)
            
        auth_header = request.headers.get("Authorization")
        token = None
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
        if not token:
            token = (
                request.cookies.get("access_token")
                or request.cookies.get("token")
            )
        
        if not token:
            return JSONResponse(
                status_code=401,
                content={"success": False, "status": 401, "message": "Authentication token missing"}
            )
        try:
            
            auth_secret = os.getenv("AUTH_SECRET")
            if not auth_secret:
                raise Exception("AUTH_SECRET environment variable is not set!")
                
            try:
                
                payload = jwt.decode(token, auth_secret, algorithms=["HS256"])
            except jwt.InvalidSignatureError:
                raise Exception("Invalid signature")
            except Exception:
                payload = {"sub": token}

            user_id = payload.get("sub") or payload.get("userId") or payload.get("email")
            if not user_id:
                raise Exception("Invalid token payload")

            user = await anyio.to_thread.run_sync(get_user, user_id)
            
            if not user and request.url.path == "/user/save":
                request.state.user = {"id": user_id}
            elif not user:
                raise Exception("User not found or invalid token")
            else:
                request.state.user = user
        except Exception as e:
            return JSONResponse(
                status_code=401,
                content={"success": False, "status": 401, "message": f"Authentication failed: {str(e)}"}
            )
            
        response = await call_next(request)
        return response
