import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    console.log('CLOUDINARY DEBUG:', {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: Boolean(process.env.CLOUDINARY_API_KEY),
      hasApiSecret: Boolean(process.env.CLOUDINARY_API_SECRET),
    })

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cloudinary environment variables are missing',
        },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<{
      secure_url: string
      public_id: string
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'viva-apex/products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('CLOUDINARY CALLBACK ERROR:', error)
            reject(error)
            return
          }

          if (!result) {
            reject(new Error('No result returned from Cloudinary'))
            return
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          })
        }
      )

      stream.end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error('UPLOAD ROUTE ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown upload error occurred',
      },
      { status: 500 }
    )
  }
}