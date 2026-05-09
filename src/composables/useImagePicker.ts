import { ref } from 'vue'
import { isPlatform } from '@ionic/vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import imageCompression from 'browser-image-compression'
import exifr from 'exifr'

interface Options {
  maxSizeMB?: number
  maxWidthOrHeight?: number
}

export const useImagePicker = (options: Options = {}) => {
  const { maxSizeMB = 0.8, maxWidthOrHeight = 1920 } = options

  const imagePreview = ref<string | null>(null)
  const imageBlob = ref<Blob | null>(null)
  const photoGps = ref<{ lat: number; lng: number } | null>(null)

  const compress = (file: File): Promise<Blob> =>
    imageCompression(file, { maxSizeMB, maxWidthOrHeight, useWebWorker: false })

  const extractGps = async (file: File) => {
    try {
      const gps = await exifr.gps(file)
      const lat = gps?.latitude
      const lng = gps?.longitude
      return typeof lat === 'number' && isFinite(lat) && typeof lng === 'number' && isFinite(lng)
        ? { lat, lng }
        : null
    } catch {
      return null
    }
  }

  const processFile = async (file: File) => {
    imagePreview.value = URL.createObjectURL(file)
    // Read EXIF GPS before compression — compression strips metadata
    photoGps.value = await extractGps(file)
    imageBlob.value = await compress(file)
  }

  const processDataUrl = async (dataUrl: string) => {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    const file = new File([blob], 'find.jpg', { type: 'image/jpeg' })
    imagePreview.value = dataUrl
    // Native Camera DataUrl strips EXIF — no GPS available this way
    photoGps.value = null
    imageBlob.value = await compress(file)
  }

  const pickImageNative = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
      })
      if (!photo.webPath) return
      const res = await fetch(photo.webPath)
      const blob = await res.blob()
      const file = new File([blob], 'find.jpg', { type: blob.type || 'image/jpeg' })
      imagePreview.value = photo.webPath
      photoGps.value = await extractGps(file)
      imageBlob.value = await compress(file)
    } catch {
      // user cancelled
    }
  }

  const pickImageWeb = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (file) await processFile(file)
    }
    input.click()
  }

  const pickImage = () => {
    if (isPlatform('capacitor')) {
      pickImageNative()
    } else {
      pickImageWeb()
    }
  }

  return { imagePreview, imageBlob, photoGps, pickImage }
}
