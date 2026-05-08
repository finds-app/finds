import { ref } from 'vue'
import { isPlatform } from '@ionic/vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import imageCompression from 'browser-image-compression'

interface Options {
  maxSizeMB?: number
  maxWidthOrHeight?: number
}

export const useImagePicker = (options: Options = {}) => {
  const { maxSizeMB = 0.8, maxWidthOrHeight = 1920 } = options

  const imagePreview = ref<string | null>(null)
  const imageBlob = ref<Blob | null>(null)

  const compress = (file: File): Promise<Blob> =>
    imageCompression(file, { maxSizeMB, maxWidthOrHeight, useWebWorker: false })

  const processFile = async (file: File) => {
    imagePreview.value = URL.createObjectURL(file)
    imageBlob.value = await compress(file)
  }

  const processDataUrl = async (dataUrl: string) => {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    const file = new File([blob], 'find.jpg', { type: 'image/jpeg' })
    imagePreview.value = dataUrl
    imageBlob.value = await compress(file)
  }

  const pickImageNative = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      })
      if (photo.dataUrl) await processDataUrl(photo.dataUrl)
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

  return { imagePreview, imageBlob, pickImage }
}
