# การตั้งค่า vercel.json สำหรับ Crystal Castle

ไฟล์ `vercel.json` อยู่ที่ root โปรเจกต์ ควบคุมการทำงานของ Vercel Deployment

## โครงสร้างพื้นฐานที่แนะนำ (สำหรับ Hobby Plan)

```json
{
  "cleanUrls": true,
    "trailingSlash": false,
      "functions": {
          "api/prompt.js": { "maxDuration": 60 },
              "api/post.js": { "maxDuration": 60 },
                  "api/video.js": { "maxDuration": 60 },
                      "api/magichour.js": { "maxDuration": 60 }
                        },
                          "ignoreCommand": "bash -c 'if ! git diff --quiet HEAD~1 -- api/ product.js cta-generator.js ; then echo \"Changes detected. Building...\"; else echo \"No critical changes. Skipping build.\" && exit 0; fi'",
                            "headers": [
                                {
                                      "source": "/(.*).(js|css|png|jpg|jpeg|gif|webp|svg|ico)",
                                            "headers": [
                                                    { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
                                                          ]
                                                              },
                                                                  {
                                                                        "source": "/api/(.*)",
                                                                              "headers": [
                                                                                      { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
                                                                                            ]
                                                                                                }
                                                                                                  ]
                                                                                                  }