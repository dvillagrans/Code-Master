from django.db import models
from tags.models import Tag, Category
from django.utils.text import slugify

class Problem(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    description = models.TextField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, related_name='problems', null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name='problems', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        # Automatically generate slug if not provided
        if not self.slug:
            original_slug = slugify(self.title)
            unique_slug = original_slug
            num = 1
            while Problem.objects.filter(slug=unique_slug).exists():
                unique_slug = f'{original_slug}-{num}'
                num += 1
            self.slug = unique_slug

        super().save(*args, **kwargs)

    def is_completed_by_user(self, user):
        """
        Verifica si un usuario ha completado este problema.
        """
        from solutions.models import Solution  # Importar localmente para evitar circularidad
        return Solution.objects.filter(user=user, problem=self, status='Accepted').exists()

    def __str__(self):
        return self.title


class Example(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='examples')
    input_data = models.TextField()
    output_data = models.TextField()
    explanation = models.TextField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"Example for {self.problem.title}"
