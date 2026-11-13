from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None and isinstance(response.data, dict):
        message = response.data.get("detail") or response.data
        response.data = {"success": False, "message": message}
    return response
