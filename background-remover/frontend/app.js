const imageInput = document.getElementById('imageInput')
const removeBtn = document.getElementById('removeBtn')
const resultImage = document.getElementById('resultImage')
const downloadLink = document.getElementById('downloadLink')
const loadingIndicator = document.getElementById('loadingIndicator')

removeBtn.addEventListener('click', async () => {
  loadingIndicator.style.display = 'block'
  const file = imageInput.files[0]

  if (!file) {
    alert('Please select an image file.')
    loadingIndicator.style.display = 'none'
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('http://localhost:8000/remove-bg', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      loadingIndicator.style.display = 'none'
      const errorData = await response.json()
      console.error('Server error:', errorData)
      throw new Error('Failed to remove background')
    }

    loadingIndicator.style.display = 'none'
    const blob = await response.blob()
    const imageUrl = URL.createObjectURL(blob)
    resultImage.src = imageUrl
    downloadLink.href = imageUrl
    downloadLink.style.display = 'block'
  } catch (error) {
    loadingIndicator.style.display = 'none'
    console.error('Error removing background:', error)
  }
})
