from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name='tags',
        null=True,
        blank=True
    )
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        # Ensure a default category exists before saving
        if not self.category:
            # Try to get or create the default category
            default_category, created = Category.objects.get_or_create(
                name='General',
                defaults={'description': 'Default category for uncategorized tags'}
            )
            self.category = default_category

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

