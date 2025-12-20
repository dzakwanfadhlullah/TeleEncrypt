package controller

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"Backend/database"
	"Backend/model"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func UploadFile(c *gin.Context) {
	// Ambil user dari JWT middleware
	userID := c.GetString("user_id")
	log.Println("Uploading file for user:", userID)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot open file"})
		return
	}
	defer src.Close()

	fileBytes, err := io.ReadAll(src)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot read file"})
		return
	}

	// Path file di Supabase Storage
	storagePath := fmt.Sprintf("%s/%s", userID, file.Filename)

	// 1️⃣ Upload ke Supabase Storage
	err = UploadToSupabase(
		storagePath,
		fileBytes,
		file.Header.Get("Content-Type"),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 2️⃣ INSERT metadata ke tabel files
	fileID, err := insertFileRecord(
		file.Filename,
		storagePath,
		file.Header.Get("Content-Type"),
		file.Size,
		userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file metadata"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "file uploaded successfully",
		"file_id":   fileID.String(),
		"file_name": file.Filename,
		"path":      storagePath,
		"size":      file.Size,
	})
}

func insertFileRecord(
	fileName string,
	filePath string,
	fileType string,
	fileSize int64,
	userID string,
) (uuid.UUID, error) {

	uid, err := uuid.Parse(userID)
	if err != nil {
		return uuid.Nil, err
	}

	newFileID := uuid.New()
	file := model.Files{
		FileID:    newFileID,
		FileName:  fileName,
		FilePath:  filePath,
		FileType:  fileType,
		FileSize:  int64(fileSize),
		UserID:    uid,
		CreatedAt: time.Now(),
	}

	err = database.DB.Create(&file).Error
	return newFileID, err
}

func UploadToSupabase(path string, data []byte, contentType string) error {
	supabaseURL := os.Getenv("SUPABASE_URL")
	bucket := os.Getenv("SUPABASE_BUCKET")
	serviceKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	if supabaseURL == "" || bucket == "" || serviceKey == "" {
		return fmt.Errorf("supabase env not set")
	}

	url := fmt.Sprintf(
		"%s/storage/v1/object/%s/%s",
		supabaseURL,
		bucket,
		path,
	)

	// ⚠️ WAJIB PUT (bukan POST)
	req, err := http.NewRequest(http.MethodPut, url, bytes.NewReader(data))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+serviceKey)
	req.Header.Set("Content-Type", contentType)
	req.Header.Set("Content-Length", strconv.Itoa(len(data)))
	req.Header.Set("x-upsert", "false")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("supabase error [%d]: %s", resp.StatusCode, body)
	}

	return nil
}

func GetUserFiles(c *gin.Context) {
	userIDStr := c.GetString("user_id")

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	var files []model.Files

	err = database.DB.
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&files).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch files"})
		return
	}

	c.JSON(http.StatusOK, files)
}

func DownloadFile(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, _ := uuid.Parse(userIDStr)

	fileID := c.Param("id")

	var file model.Files
	err := database.DB.
		Where("file_id = ? AND user_id = ?", fileID, userID).
		First(&file).Error

	if err != nil {
		c.JSON(404, gin.H{"error": "file not found"})
		return
	}

	signedURL, err := GenerateSignedURL(file.FilePath)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to generate signed url"})
		return
	}

	c.JSON(200, gin.H{
		"url": signedURL,
	})
}

func GenerateSignedURL(path string) (string, error) {
	supabaseURL := os.Getenv("SUPABASE_URL")
	bucket := os.Getenv("SUPABASE_BUCKET")
	serviceKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	if supabaseURL == "" || bucket == "" || serviceKey == "" {
		return "", fmt.Errorf("supabase env not set for signed URL")
	}

	url := fmt.Sprintf(
		"%s/storage/v1/object/sign/%s/%s",
		supabaseURL,
		bucket,
		path,
	)

	payload := strings.NewReader(`{"expiresIn":3600}`)

	req, _ := http.NewRequest("POST", url, payload)
	req.Header.Set("Authorization", "Bearer "+serviceKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("Supabase sign error: %s", string(body))
		return "", fmt.Errorf("failed to get signed URL from Supabase: %d", resp.StatusCode)
	}

	var result struct {
		SignedURL string `json:"signedURL"`
	}

	json.NewDecoder(resp.Body).Decode(&result)

	if result.SignedURL == "" {
		return "", fmt.Errorf("empty signed URL from Supabase")
	}

	return supabaseURL + "/storage/v1" + result.SignedURL, nil
}

func DeleteFile(c *gin.Context) {
	// 1️⃣ Ambil user_id dari JWT
	userIDStr := c.GetString("user_id")
	if userIDStr == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	// 2️⃣ Ambil file_id dari param
	fileIDStr := c.Param("id")
	fileID, err := uuid.Parse(fileIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid file id"})
		return
	}

	// 3️⃣ Ambil data file (ownership check)
	var file model.Files
	err = database.DB.
		Where("file_id = ? AND user_id = ?", fileID, userID).
		First(&file).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}

	// 4️⃣ Hapus file di Supabase Storage
	if err := DeleteFromSupabase(file.FilePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to delete file from storage",
		})
		return
	}

	// 5️⃣ Hapus record di database
	if err := database.DB.Delete(&file).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to delete file metadata",
		})
		return
	}

	// 6️⃣ Response sukses
	c.JSON(http.StatusOK, gin.H{
		"message":   "file deleted successfully",
		"file_id":   file.FileID,
		"file_name": file.FileName,
	})
}

func DeleteFromSupabase(path string) error {
	supabaseURL := os.Getenv("SUPABASE_URL")
	bucket := os.Getenv("SUPABASE_BUCKET")
	serviceKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")

	if supabaseURL == "" || bucket == "" || serviceKey == "" {
		return fmt.Errorf("supabase env not set")
	}

	url := fmt.Sprintf(
		"%s/storage/v1/object/%s/%s",
		supabaseURL,
		bucket,
		path,
	)

	req, err := http.NewRequest(http.MethodDelete, url, nil)
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+serviceKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("supabase delete error [%d]: %s", resp.StatusCode, body)
	}

	return nil
}
