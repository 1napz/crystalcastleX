import fal_client

result = fal_client.subscribe("fal-ai/nano-banana-2", 
    arguments={"prompt": "a sunset over mountains"}
)
print(result["images"][0]["url"])