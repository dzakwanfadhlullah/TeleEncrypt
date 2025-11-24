package controller

import (
	"Backend/model"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)




func UploadHandler(c *gin.Context) {
    // 1. Ambil file dari form-data
    fileHeader, err := c.FormFile("file")
    if err != nil {
        c.JSON(400, gin.H{"error": "File diperlukan"})
        return
    }

    // 2. Buka file
    file, err := fileHeader.Open()
    if err != nil {
        c.JSON(500, gin.H{"error": "Gagal membuka file"})
        return
    }
    defer file.Close()

    // 3. Ambil User ID (misal dari JWT middleware)
    userIDStr := c.GetString("user_id") 
    userID, _ := uuid.Parse(userIDStr)

    // 4. Panggil fungsi Upload yang kita buat tadi
    savedFile, err := model.UploadAndSaveFile(fileHeader, file, userID)
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }

    c.JSON(200, gin.H{
        "message": "File berhasil diupload",
        "data":    savedFile,
    })
}



