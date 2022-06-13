from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Entry, Tag
from .serializers import EntrySerializer, TagSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'Token': '/token',
        'Refresh Token': '/token/refresh',
        'Entries List': '/Entries',
        'Get User Tags': '/Tags',
        'Update Entry': '/updateEntry',
    }
    return Response(api_urls)


@api_view(['GET'])
def getEntries(request):
    print("User: ", get_user_model())

    entries = Entry.objects.all()[::-1]

    serializer = EntrySerializer(entries, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def getTags(request):
    tags = Tag.objects.all()[::-1]

    serializer = TagSerializer(tags, many=True)

    return Response(serializer.data)


@api_view(['POST'])
def createTag(request):
    serializer = TagSerializer(data=request.data)
    print(request.data)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
        print(serializer.data)
    print("createTag")
    return Response(serializer.data)


@api_view(['POST'])
def updateTag(request, tagId):
    tag = Tag.objects.get(id=tagId)
    serializer = TagSerializer(instance=tag, data=request.data)
    print(request.data)
    if serializer.is_valid():
        serializer.save()
        print(serializer.data)
    else:
        print("didn't work")
        print(serializer.errors)

    return Response(serializer.data)


@api_view(['DELETE'])
def deleteTag(request, tagId):
    tag = Tag.objects.get(id=tagId)
    tag.delete()

    return Response("Tag Deleted")


@api_view(['POST'])
def createEntry(request):
    print(request.data)
    tag_id = request.data.get("tag").get("id")
    tag = Tag.objects.get(id=tag_id)

    entry = Entry.objects.create(
        user=request.user, tag=tag, content="", answer="")
    entry.save()

    serializer = EntrySerializer(instance=entry, data=request.data)

    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
        print(serializer.data)
    print(serializer.data)
    return Response(serializer.data)


@api_view(['POST'])
def updateEntry(request, entryId):
    data = request.data
    entry = Entry.objects.get(id=entryId)

    try:
        tag_id = data.get("tag").get("id")
        tag = Tag.objects.get(id=tag_id)
        entry.tag = tag
        entry.save()
        print(entry.tag)
    except:
        pass

    serializer = EntrySerializer(instance=entry, data=data)

    if serializer.is_valid():
        serializer.save()
        print("serializer: ",  serializer.data)
    else:
        print(serializer.errors)
    return Response(serializer.data)


@api_view(['DELETE'])
def deleteEntry(request, entryId):
    entry = Entry.objects.get(id=entryId)
    entry.delete()

    return Response("Entry Deleted")


@api_view(['GET'])
def filter_entries(request, tagId):
    tag = Tag.objects.get(id=tagId)
    print(tag)
    entries = Entry.objects.filter(tag=tag)
    print(entries)
    serializer = EntrySerializer(entries, many=True)
    print(serializer.data)
    return Response(serializer.data)
