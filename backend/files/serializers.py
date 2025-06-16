from rest_framework import serializers

from files.models import File


class FileSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    size = serializers.SerializerMethodField()
    class Meta:
        model = File
        fields = [
            'id', 'user', 'file', 'file_name', 'comment',
            'size', 'uploaded', 'downloaded', 'special_link'
            ]
        read_only_fields = ['id', 'size', 'uploaded', 'downloaded', 'special_link']

    def create(self, validated_data):
        if 'file_name' in validated_data:
            validated_data.pop('file_name')
        return super().create(validated_data)
    
    def get_size(self, obj):
        return f"{obj.size / 1024:.1f} KB" if obj.size < 1024*1024 else f"{obj.size / (1024*1024):.1f} MB"
    
    def validate_file(self, value):
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("Максимальный размер файла - 10 МБ")
        return value
