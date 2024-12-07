from django.http import JsonResponse
from .models import Category
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_categories_with_tags(request):
    categories = Category.objects.all()
    data = [
        {
            "id": category.id,
            "name": category.name,
            "description": category.description,
            "slug": category.slug,
            "tags": [
                {"id": tag.id, "name": tag.name, "description": tag.description}
                for tag in category.tags.all()
            ],
        }
        for category in categories
    ]
    return JsonResponse({"categories": data})
