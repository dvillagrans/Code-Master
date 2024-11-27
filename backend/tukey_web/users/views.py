from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError


@api_view(["POST"])
def register_user(request):
    data = request.data
    try:
        # Valida que los campos necesarios estén presentes
        required_fields = ["first_name", "last_name", "username", "email", "password"]
        for field in required_fields:
            if field not in data:
                return Response({"error": f"{field} is required"}, status=400)

        # Crea el usuario
        user = User.objects.create(
            first_name=data["first_name"],
            last_name=data["last_name"],
            username=data["username"],
            email=data["email"],
            password=make_password(data["password"]),  # Hashea la contraseña
        )
        return Response({"message": "User registered successfully"}, status=201)

    except IntegrityError as e:  # Error por duplicado
        return Response({"error": "Username or email already exists"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)