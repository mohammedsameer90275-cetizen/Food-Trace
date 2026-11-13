from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product


class ReportsView(APIView):
    def get(self, request):
        products = Product.objects.all()
        return Response({
            "totalProducts": products.count(),
            "fresh": products.filter(status="Fresh").count(),
            "warning": products.filter(status="Warning").count(),
            "expired": products.filter(status="Expired").count(),
        })
