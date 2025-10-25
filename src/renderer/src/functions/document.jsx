export const acceptedFiles = ["png", "jpg", "jpeg", "webp"]

export const getDocumentLink = (doc) =>  `http://localhost:3001/download/documents/${doc?.file_path}`
