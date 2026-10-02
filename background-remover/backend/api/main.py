from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
  return {"status": "ok"}

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
  image_bytes = await file.read()
  img = Image.open(io.BytesIO(image_bytes))

  img_no_bg = remove(img)

  buffer = io.BytesIO()
  img_no_bg.save(buffer, format="PNG")
  buffer.seek(0)

  return Response(content=buffer.getvalue(), media_type="image/png")