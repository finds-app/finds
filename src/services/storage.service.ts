import { IMAGE_UPLOAD, STORAGE_BUCKETS } from '@/constants'
import type { UploadedFileDto } from '@/types'
import { supabase } from './supabase'

export const buildFindImagePath = (userId: string): string =>
  `${userId}/${crypto.randomUUID()}.${IMAGE_UPLOAD.extension}`

export const uploadImage = async (
  path: string,
  blob: Blob,
  bucket = STORAGE_BUCKETS.findsImages
): Promise<UploadedFileDto> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token ?? supabaseKey

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${supabaseUrl}/storage/v1/object/${bucket}/${path}`)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('apikey', supabaseKey)
    xhr.setRequestHeader('Content-Type', IMAGE_UPLOAD.contentType)
    xhr.onload = () => {
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(xhr.responseText))
    }
    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(blob)
  })

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
  return { path, publicUrl }
}
