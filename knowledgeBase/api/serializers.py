from rest_framework import serializers
from .models import Entry, Tag


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = '__all__'

    def update(self, instance, validated_data):
        # tag = Tag.objects.get(name=validated_data.get('tag').get('name'))
        # instance.tag = tag  # validated_data.pop('tag', instance.tag)
        instance.name = validated_data.pop('name', instance.name)
        instance.color = validated_data.pop('color', instance.color)

        instance.save()
        return instance


class EntrySerializer(serializers.ModelSerializer):
    # this allows me to access the foreign keys of the models in react, without it I would only see the primary keys

    # user = UserSerializer(required=False)
    tag = TagSerializer(required=False)

    class Meta:
        model = Entry
        fields = '__all__'

    def update(self, instance, validated_data):
        # tag = Tag.objects.get(name=validated_data.get('tag').get('name'))
        # instance.tag = tag  # validated_data.pop('tag', instance.tag)
        instance.content = validated_data.pop('content', instance.content)
        instance.answer = validated_data.pop('answer', instance.answer)

        instance.save()
        return instance
